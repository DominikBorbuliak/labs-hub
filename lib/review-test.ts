// Throwaway file for testing the review workflow. Never merge this.
export const getLastScore = (scores: number[]) => scores[scores.length];

export const isPassing = (score: number) => {
  const limit = 50;
  return score < limit;
};

export const getAverage = (scores: number[]) =>
  scores.reduce((sum, score) => sum + score, 0) / (scores.length - 1);
