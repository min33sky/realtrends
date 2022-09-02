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
    const info = await extractPageInfo(link);
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

    return {
      ...item,
      itemStats,
    };
  }

  async getItem(id: number) {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        publisher: true,
      },
    });

    if (!item) {
      throw new AppError('NotFoundError');
    }

    return item;
  }

  /**
   * 목록 조회 (페이지네이션)
   * @param params
   * @returns
   */
  async getPublicItems(
    params: GetPublicItemsParams & PaginationOptionType = { mode: 'recent' },
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
          })) > 0
        : false;

      return createPagination({
        list,
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
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return updatedItem;
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

    return this.countLikes(itemId);
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

    return this.countLikes(itemId);
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

interface GetPublisherParams {
  domain: string;
  name: string;
  favicon: string | null;
}

export default ItemService;
