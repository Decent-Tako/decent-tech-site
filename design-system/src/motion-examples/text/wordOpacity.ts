export type WordProgressRange = {
  start: number;
  end: number;
};

export function getWordProgressRange(
  index: number,
  count: number,
  spread: number,
  wordDuration: number,
): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * spread;
  return {
    start,
    end: Math.min(1, start + wordDuration),
  };
}

