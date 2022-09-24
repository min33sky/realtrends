import { Item, ItemLike, ItemStats, Publisher, User } from '@prisma/client';
import algolia from '../lib/algolia';
import AppError from '../lib/AppError';
import db from '../lib/db';
import NextAppError from '../lib/NextAppError';
import { createPagination, PaginationOptionType } from '../lib/pagination';
import { calcurateRankingScore } from '../lib/ranking';
import { extractPageInfo } from '../lib/validateUrl';
import { CreateItemBodyType } from '../routes/api/items/schema';

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
    { title, link, tags, body }: CreateItemBodyType,
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

    const itemLikedMap = userId
      ? await this.getItemLikedMap({ itemIds: [item.id], userId })
      : null;

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

    return this.mergeItemLiked(itemWithItemStats, itemLikedMap?.[item.id]);
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
      },
    });

    if (!item) {
      throw new AppError('NotFoundError');
    }

    const itemLikedMap = userId
      ? await this.getItemLikedMap({ itemIds: [id], userId })
      : null;

    return this.mergeItemLiked(item, itemLikedMap?.[id]);
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

  async getRecentItems({
    limit,
    cursor,
  }: {
    limit?: number;
    cursor?: number | null;
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
  }: {
    limit: number;
    cursor?: number | null;
    startDate?: string;
    endDate?: string;
  }) {
    console.log('####### getPastItems: ', startDate, endDate);

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
  }: {
    limit: number;
    cursor?: number | null;
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
        return this.getTrendingItems({ limit: _limit, cursor });
      }
      if (mode === 'past') {
        return this.getPastItems({ limit: _limit, cursor, startDate, endDate });
      }
      return this.getRecentItems({ limit: _limit, cursor });
    })();

    const itemLikedMap = userId
      ? await this.getItemLikedMap({
          itemIds: list.map((item) => item.id),
          userId: userId,
        })
      : null;

    const listWithLiked = list.map((item) =>
      this.mergeItemLiked(item, itemLikedMap?.[item.id]),
    );

    return createPagination({
      list: listWithLiked,
      totalCount,
      pageInfo: {
        endCursor: hasNextPage ? endCursor : null,
        hasNextPage,
      },
    });
  }

  async getItemsByIds(itemIds: number[]) {
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
      },
    });

    type FullItem = Item & {
      user: User;
      publisher: Publisher;
      ItemStats: ItemStats | null;
    };

    const itemMap = result.reduce<Record<number, FullItem>>((acc, item) => {
      acc[item.id] = item;
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
      },
    });

    const itemLikedMap = userId
      ? await this.getItemLikedMap({ itemIds: [item.id], userId })
      : null;

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

    return this.mergeItemLiked(updatedItem, itemLikedMap?.[item.id]);
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
   * 해당 사용자가 좋아요를 누른 아이템 목록을 가져오는 함수
   * @param params
   * @returns 아이템 번호를 키, 좋아요 모델을 값으로 하는 Map을 리턴
   */
  async getItemLikedMap(params: GetItemLikedParams) {
    const { userId, itemIds } = params;

    //? 사용자가 좋아요 누른 글 목록 조회
    const list = await db.itemLike.findMany({
      where: {
        userId,
        itemId: {
          in: itemIds,
        },
      },
    });

    return list.reduce((acc, cur) => {
      acc[cur.itemId] = cur;
      return acc;
    }, {} as Record<number, ItemLike>);
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
