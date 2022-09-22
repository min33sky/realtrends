const G = 1.4;

export function calcurateRankingScore(likes: number, hourAge: number) {
  return likes / Math.pow(hourAge + 2, G);
}
