import { Item, ItemLike, ItemStats } from '@prisma/client';
import AppError from '../lib/AppError';
import db from '../lib/db';
import { createPagination, PaginationOptionType } from '../lib/pagination';
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
   * Item 정보에 Item 관련 추가 정보를 합친 객체를 반환하는 함수
   * @param item
   * @param itemLike
   */
  private mergeItemLiked<T extends Item & { ItemStats: ItemStats | null }>(
    item: T,
    itemLike?: ItemLike,
  ) {
    return {
      ...item,
      ItemStats: {
        ...item.ItemStats,
        isLiked: !!itemLike ?? false,
      },
    };
  }

  /**
   * 목록 조회 (페이지네이션)
   * @param params
   * @returns
   */
  async getPublicItems(
    params: GetPublicItemsParams &
      PaginationOptionType & { userId?: number } = { mode: 'recent' },
  ) {
    const limit = params.limit ?? 20;

    if (params.mode === 'recent') {
      const [totalCount, list] = await Promise.all([
        db.item.count(),
        db.item.findMany({
          orderBy: { createdAt: 'desc' },
          where: {
            id: params.cursor
              ? {
                  lt: params.cursor,
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

      const itemLikedMap = params.userId
        ? await this.getItemLikedMap({
            itemIds: list.map((item) => item.id),
            userId: params.userId,
          })
        : null;
      const listWithLiked = list.map((item) =>
        this.mergeItemLiked(item, itemLikedMap?.[item.id]),
      );

      const endCursor = list.at(-1)?.id ?? null;
      const hasNextPage = endCursor
        ? (await db.item.count({
            where: {
              id: {
                lt: endCursor,
              },
            },
          })) > 0
        : false;

      return createPagination({
        list: listWithLiked,
        pageInfo: {
          endCursor,
          hasNextPage,
        },
        totalCount,
      });
    }
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
    return { ...itemStats, isLiked: true };
  }

  async unLikeItem({ itemId, userId }: ItemActionParams) {
    // TODO: 좋아요 누르지 않은 상태에서 좋아요 취소를 누르면 500 에러 발생

    await db.itemLike.delete({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    });

    const likes = await this.countLikes(itemId);
    const itemStats = await this.updateItemLikes({
      itemId,
      likes,
    });

    return {
      ...itemStats,
      isLiked: false,
    };
  }

  /**
   * 해당 사용자가 좋아요를 누른 아이템 목록을 가져오는 함수
   * @param params
   * @returns 아이템 번호를 키, 좋아요 모델을 값으로 하는 Map을 리턴
   */
  private async getItemLikedMap(params: GetItemLikedParams) {
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
}

type GetPublicItemsParams =
  | {
      mode: 'trending' | 'recent';
    }
  | {
      mode: 'past';
      date: string;
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
