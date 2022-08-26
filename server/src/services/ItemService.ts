import db from '../lib/db';
import { CreateItemBodyType } from '../routes/api/items/schema';

class ItemService {
  private static instance: ItemService;

  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService();
    }
    return ItemService.instance;
  }

  async createItem(
    userId: number,
    { title, link, tags, body }: CreateItemBodyType,
  ) {
    const item = await db.item.create({
      data: {
        title,
        body,
        link,
        userId,
      },
    });

    return item;
  }
}

export default ItemService;
