import {
  Bookmark,
  Item,
  ItemLike,
  ItemStats,
  Publisher,
  User,
} from '@prisma/client';
import algolia from '../lib/algolia';
import AppError from '../lib/AppError';
import db from '../lib/db';
import NextAppError from '../lib/NextAppError';
import { createPagination, PaginationOptionType } from '../lib/pagination';
import { calcurateRankingScore } from '../lib/ranking';
import { extractPageInfo } from '../lib/validateUrl';

class ItemService {
  private static instance: ItemService;

  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService();
    }
    return ItemService.instance;
  }

  /**
   * 퍼블리셔 정보 조회하기
   */
  private async getPublisher({ domain, favicon, name }: GetPublisherParams) {
    const exists = await db.publisher.findUnique({
      where: {
        domain,
      },
    });

    if (exists) return exists;

    const publisher = await db.publisher.create({
      data: {
        domain,
        favicon,
        name,
      },
    });

    return publisher;
  }

  async createItem(
    userId: number,
    {
      title,
      link,
      tags,
      body,
    }: { title: string; link: string; tags?: string[]; body: string },
  ) {
    // 페이지 정보 추출
    const info = await extractPageInfo(link);

    // 퍼블리셔 정보 조회 및 생성
    const publisher = await this.getPublisher({
      domain: info.domain,
      favicon: info.favicon,
      name: info.publisher,
    });

    const item = await db.item.create({
      data: {
        title,
        body,
        link: info.url,
        userId,
        thumbnail: info.thumbnail,
        author: info.author ?? undefined,
        publisherId: publisher.id,
      },
      include: {
        user: true,
        publisher: true,
      },
    });

    const itemStats = await db.itemStats.create({
      data: {
        itemId: item.id,
      },
    });

    const itemWithItemStats = { ...item, ItemStats: itemStats };

    //? algolia에 저장
    algolia
      .sync({
        id: item.id,
        author: item.author,
        body: item.body,
        link: item.link,
        thumbnail: item.thumbnail,
        title: item.title,
        username: item.user.username,
        publisher: item.publisher,
      })
      .catch(console.error);

    return this.serialize(itemWithItemStats);
  }

  async getItem(id: number, userId: number | null = null) {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        publisher: true,
        ItemStats: true,
        bookmarks: userId ? { where: { userId } } : false,
        itemLikes: userId ? { where: { userId } } : false,
      },
    });

    if (!item) {
      throw new AppError('NotFoundError');
    }

    return this.serialize(item);
  }

  /**
   * Item에 좋아요 여부 추가하는 함수
   * @param item
   * @param itemLike
   */
  private mergeItemLiked<T extends Item>(item: T, itemLike?: ItemLike) {
    return {
      ...item,
      isLiked: !!itemLike,
    };
  }

  /**
   * Item 정보에 isLiked, isBookmarked 추가하여 반환하는 함수
   */
  serialize<
    T extends Item & { itemLikes?: ItemLike[]; bookmarks?: Bookmark[] },
  >(item: T) {
    return {
      ...item,
      isLiked: !!item.itemLikes?.length,
      isBookmarked: !!item.bookmarks?.length,
    };
  }

  async getRecentItems({
    limit,
    cursor,
    userId,
  }: {
    limit?: number;
    cursor?: number | null;
    userId?: number;
  }) {
    const [totalCount, list] = await Promise.all([
      db.item.count(),
      db.item.findMany({
        orderBy: {
          id: 'desc',
        },
        where: {
          id: cursor
            ? {
                lt: cursor,
              }
            : undefined,
        },
        include: {
          user: true,
          publisher: true,
          ItemStats: true,
          itemLikes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
        },
        take: limit,
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.item.count({
          where: {
            id: {
              lt: endCursor,
            },
          },
          orderBy: {
            id: 'desc',
          },
        })) > 0
      : false;

    return { totalCount, list, endCursor, hasNextPage };
  }

  async getPastItems({
    limit,
    cursor,
    endDate,
    startDate,
    userId,
  }: {
    limit: number;
    cursor?: number | null;
    startDate?: string;
    endDate?: string;
    userId?: number;
  }) {
    if (!startDate || !endDate) {
      throw new NextAppError('BadRequest', {
        message: 'startDate or endDate is missing',
      });
    }

    const dateDiff =
      new Date(endDate).getTime() - new Date(startDate).getTime();

    //? throw Error if not yyyy-mm-dd format
    if (
      [startDate, endDate].some((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date))
    ) {
      throw new NextAppError('BadRequest', {
        message: 'startDate or endDate is not yyyy-mm-dd format',
      });
    }

    /**
     * 1주일 이상의 기간은 조회할 수 없음
     * @example 일요일을 기준으로 토요일까지 1주일 기간이므로 시작일부터 6일 이상 차이나면 에러
     * */
    if (dateDiff > 1000 * 60 * 60 * 24 * 6) {
      throw new NextAppError('BadRequest', {
        message: 'Date range bigger than 7 days',
      });
    }

    const d1 = new Date(`${startDate} 00:00:00`);
    const d2 = new Date(`${endDate} 23:59:59`);

    const [totalCount, list] = await Promise.all([
      db.item.count({
        where: {
          createdAt: {
            gte: d1,
            lte: d2,
          },
        },
      }),
      db.item.findMany({
        orderBy: [
          {
            ItemStats: {
              likes: 'desc',
            },
          },
          {
            id: 'desc',
          },
        ],
        where: {
          id: cursor ? { lt: cursor } : undefined,
          createdAt: {
            gte: d1,
            lte: d2,
          },
        },
        include: {
          user: true,
          publisher: true,
          ItemStats: true,
          itemLikes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
        },
        take: limit,
      }),
    ]);

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.item.count({
          where: {
            id: {
              lt: endCursor,
            },
            createdAt: {
              gte: d1,
              lte: d2,
            },
          },
          orderBy: [
            {
              ItemStats: {
                likes: 'desc',
              },
            },
            {
              id: 'desc',
            },
          ],
        })) > 0
      : false;

    return { totalCount, list, endCursor, hasNextPage };
  }

  async getTrendingItems({
    limit,
    cursor,
    userId,
  }: {
    limit: number;
    cursor?: number | null;
    userId?: number;
  }) {
    const totalCount = await db.itemStats.count({
      where: {
        score: {
          gte: 0.001,
        },
      },
    });

    const cursorItem = cursor
      ? await db.item.findUnique({
          where: {
            id: cursor,
          },
          include: {
            ItemStats: true,
          },
        })
      : null;

    const list = await db.item.findMany({
      where: {
        ...(cursor ? { id: { lt: cursor } } : {}),
        ItemStats: {
          score: {
            gte: 0.001,
            ...(cursorItem ? { lte: cursorItem.ItemStats?.score } : {}),
          },
        },
      },
      orderBy: [
        {
          ItemStats: {
            score: 'desc',
          },
        },
        {
          ItemStats: {
            itemId: 'desc',
          },
        },
      ],
      include: {
        user: true,
        publisher: true,
        ItemStats: true,
        itemLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
      take: limit,
    });

    const endCursor = list.at(-1)?.id ?? null;

    const hasNextPage = endCursor
      ? (await db.item.count({
          where: {
            ItemStats: {
              score: {
                gte: 0.001,
                lte: list.at(-1)?.ItemStats?.score,
              },
              itemId: {
                lt: endCursor,
              },
            },
          },
          orderBy: [
            {
              ItemStats: {
                score: 'desc',
              },
            },
            {
              ItemStats: {
                itemId: 'desc',
              },
            },
          ],
        })) > 0
      : false;

    return {
      totalCount,
      list,
      endCursor,
      hasNextPage,
    };
  }

  /**
   * 목록 조회 (페이지네이션)
   * @param params
   * @returns
   */
  async getItems(
    {
      mode,
      cursor,
      limit,
      userId,
      endDate,
      startDate,
    }: GetItemsParams & PaginationOptionType & { userId?: number } = {
      mode: 'recent',
    },
  ) {
    const { endCursor, hasNextPage, list, totalCount } = await (() => {
      const _limit = limit ?? 20;

      if (mode === 'trending') {
        return this.getTrendingItems({ limit: _limit, cursor, userId });
      }
      if (mode === 'past') {
        return this.getPastItems({
          limit: _limit,
          cursor,
          startDate,
          endDate,
          userId,
        });
      }
      return this.getRecentItems({ limit: _limit, cursor, userId });
    })();

    const serializedList = list.map(this.serialize);

    return createPagination({
      list: serializedList,
      totalCount,
      pageInfo: {
        endCursor: hasNextPage ? endCursor : null,
        hasNextPage,
      },
    });
  }

  async getItemsByIds(itemIds: number[], userId?: number) {
    const result = await db.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
      include: {
        user: true,
        publisher: true,
        ItemStats: true,
        bookmarks: userId ? { where: { userId } } : false,
        itemLikes: userId ? { where: { userId } } : false,
      },
    });

    type FullItem = Item & {
      user: User;
      publisher: Publisher;
      ItemStats: ItemStats | null;
    };

    const itemMap = result.reduce<Record<number, FullItem>>((acc, item) => {
      acc[item.id] = this.serialize(item);
      return acc;
    }, {});

    return itemMap;
  }

  async updateItem({ itemId, userId, title, body }: UpdateItemParams) {
    //? 수정할 글을 가져와서 작성자가 작성한 글인지 확인한다. 다르면 에러발생
    const item = await this.getItem(itemId);

    if (item.userId !== userId) {
      throw new AppError('ForbiddenError');
    }

    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        title,
        body,
      },
      include: {
        user: true,
        publisher: true,
        ItemStats: true,
        bookmarks: userId ? { where: { userId } } : false,
        itemLikes: userId ? { where: { userId } } : false,
      },
    });

    algolia
      .sync({
        id: item.id,
        author: item.author,
        body: item.body,
        link: item.link,
        thumbnail: item.thumbnail,
        title: item.title,
        username: item.user.username,
        publisher: item.publisher,
      })
      .then(console.log)
      .catch(console.error);

    return this.serialize(updatedItem);
  }

  async deleteItem({ itemId, userId }: ItemActionParams) {
    const item = await this.getItem(itemId);

    if (item.userId !== userId) {
      throw new AppError('ForbiddenError');
    }

    await db.item.delete({
      where: {
        id: itemId,
      },
    });

    algolia.delete(itemId).catch(console.error);
  }

  async countLikes(itemId: number) {
    const count = await db.itemLike.count({
      where: {
        itemId,
      },
    });

    return count;
  }

  async updateItemLikes({ itemId, likes }: UpdateItemLikesParams) {
    return db.itemStats.update({
      where: {
        itemId,
      },
      data: {
        likes,
      },
    });
  }

  async likeItem({ itemId, userId }: ItemActionParams) {
    const alreadyLiked = await db.itemLike.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    });

    if (!alreadyLiked) {
      try {
        await db.itemLike.create({
          data: {
            itemId,
            userId,
          },
        });
      } catch (error) {}
    }

    const likes = await this.countLikes(itemId);
    const itemStats = await this.updateItemLikes({
      itemId,
      likes,
    });

    this.recalculateRanking(itemId, likes).catch(console.error);

    return itemStats;
  }

  async unLikeItem({ itemId, userId }: ItemActionParams) {
    // TODO: 좋아요 누르지 않은 상태에서 좋아요 취소를 누르면 500 에러 발생
    try {
      await db.itemLike.delete({
        where: {
          itemId_userId: {
            itemId,
            userId,
          },
        },
      });
    } catch (error) {}

    const likes = await this.countLikes(itemId);
    const itemStats = await this.updateItemLikes({
      itemId,
      likes,
    });

    this.recalculateRanking(itemId, likes).catch(console.error);

    return itemStats;
  }

  /**
   * Trending Score 계산 함순
   */
  async recalculateRanking(itemId: number, likeCount?: number) {
    const item = await db.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) return;

    const likes = likeCount ?? (await this.countLikes(itemId));

    const age =
      (Date.now() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60;

    const score = calcurateRankingScore(likes, age);

    return db.itemStats.update({
      where: {
        itemId,
      },
      data: {
        score,
      },
    });
  }
}

type GetItemsParams = {
  mode: 'trending' | 'recent' | 'past';
  startDate?: string;
  endDate?: string;
};

interface UpdateItemParams {
  itemId: number;
  userId: number;
  title: string;
  body: string;
}

interface ItemActionParams {
  itemId: number;
  userId: number;
}

interface UpdateItemLikesParams {
  itemId: number;
  likes: number;
}

interface GetPublisherParams {
  domain: string;
  name: string;
  favicon: string | null;
}

interface GetItemLikedParams {
  userId: number;
  itemIds: number[];
}

export default ItemService;
