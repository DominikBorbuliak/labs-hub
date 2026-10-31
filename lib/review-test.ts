// Throwaway file for testing the review workflow. Never merge this.
export const getLastScore = (scores: number[]) => scores[scores.length];

export const isPassing = (score: number) => {
  const limit = 50;
  return score < limit;
};
