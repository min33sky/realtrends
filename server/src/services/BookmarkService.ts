import { Bookmark } from '@prisma/client';
import db from '../lib/db';
import NextAppError from '../lib/NextAppError';
import ItemService from './ItemService';

export default class BookmarkService {
  private static instance: BookmarkService;

  public static getInstance() {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

  async createBookmark({ userId, itemId }: { userId: number; itemId: number }) {
    try {
      const bookmark = await db.bookmark.create({
        data: {
          userId,
          itemId,
        },
        include: {
          item: {
            include: {
              user: true,
              publisher: true,
              ItemStats: true,
            },
          },
        },
      });

      return bookmark;
    } catch (error) {
      if ((error as any)?.message?.includes(['Unique constraint failed'])) {
        throw new NextAppError('AlreadyExists');
      }
      throw error;
    }
  }

  async getBookmarks({
    userId,
    cursor,
    limit,
  }: {
    userId: number;
    limit: number;
    cursor?: number;
  }) {
    //? cursor가 있다면 해당 cursor의 createdAt을 가져온다.
    const cursorDate = cursor
      ? (
          await db.bookmark.findUnique({
            where: {
              id: cursor,
            },
          })
        )?.createdAt ?? null
      : null;

    const [totalCount, bookmarks] = await Promise.all([
      db.bookmark.count({
        where: {
          userId,
        },
      }),
      db.bookmark.findMany({
        where: {
          userId,
          createdAt: cursorDate
            ? {
                lt: cursorDate,
              }
            : undefined,
        },
        include: {
          item: {
            include: {
              user: true,
              publisher: true,
              ItemStats: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      }),
    ]);

    const itemService = ItemService.getInstance();

    const list = bookmarks.map((bookmark) => ({
      ...bookmark,
      item: itemService.serialize(bookmark.item),
    }));

    const endCursor = list.at(-1)?.id ?? null;
    const hasNextPage = endCursor
      ? (await db.bookmark.count({
          where: {
            userId,
            createdAt: {
              lt: list.at(-1)?.createdAt,
            },
          },
        })) > 0
      : false;

    return {
      totalCount,
      list,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    };
  }

  async deleteBookmark({
    bookmarkId,
    userId,
  }: {
    userId: number;
    bookmarkId: number;
  }) {
    const bookmark = await db.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) {
      throw new NextAppError('NotFound');
    }

    if (bookmark.userId !== userId) {
      throw new NextAppError('Forbidden');
    }

    await db.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  async getBookmarkMap({
    itemIds,
    userId,
  }: {
    itemIds: number[];
    userId: number;
  }) {
    const bookmarks = await db.bookmark.findMany({
      where: {
        userId,
        itemId: {
          in: itemIds,
        },
      },
    });

    return bookmarks.reduce<Record<number, Bookmark>>((acc, current) => {
      acc[current.itemId] = current;
      return acc;
    }, {});
  }
}
