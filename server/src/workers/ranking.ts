import PQueue from 'p-queue';
import db from '../lib/db';
import { calcurateRankingScore } from '../lib/ranking';
import cron from 'node-cron';

/**
 *? 오래된 아이템일수록 점수가 0에 가까워진다.
 *? 점수가 0.001보다 낮은 아이템들에 대해서 좋아요수를 기반으로
 *? 점수 계산을 다시 해야함
 */

/**
 * 0.001보다 낮은 점수를 가진 아이템들을 찾는 함수
 */
async function findRecalculateTargets() {
  const data = await db.itemStats.findMany({
    where: {
      // score: {
      //   lte: 0.001,
      // },
    },
    select: {
      itemId: true,
      likes: true,
      item: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  return data;
}

async function recalculate() {
  const queue = new PQueue({ concurrency: 10 });
  const targets = await findRecalculateTargets();
  const now = Date.now();

  console.log(`Recalculating ${targets.length} items`);

  targets.forEach((itemStat) => {
    queue.add(async () => {
      const hourAge =
        (now - new Date(itemStat.item.createdAt).getTime()) / 1000 / 60 / 60;
      const score = calcurateRankingScore(itemStat.likes, hourAge);

      await db.itemStats.update({
        where: {
          itemId: itemStat.itemId,
        },
        data: {
          score,
        },
      });
    });
  });

  await queue.onIdle();
  console.log(`Recalculating successfully`);
}

//? 1. 점수가 0.001보다 낮은 아이템들을 찾는다.
//? 2. 점수를 다시 계산한다.
//? 3. 점수를 업데이트한다.
recalculate();
cron.schedule('*/5 * * * *', recalculate);
