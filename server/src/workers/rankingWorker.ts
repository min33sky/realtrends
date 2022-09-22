import PQueue from 'p-queue';
import db from '../lib/db';
import { calcurateRankingScore } from '../lib/ranking';

/**
 *? 점수가 0.001보다 낮은 아이템들에 대해서 점수 계산을 다시 해야함
 */
async function findRecalculateTargets() {
  const data = await db.itemStats.findMany({
    where: {
      score: {
        lte: 0.001,
      },
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

  return queue.onIdle();
}

function main() {
  //? 1. 점수가 0.001보다 낮은 아이템들을 찾는다.
  //? 2. 점수를 다시 계산한다.
  //? 3. 점수를 업데이트한다.
  // register crons
}
