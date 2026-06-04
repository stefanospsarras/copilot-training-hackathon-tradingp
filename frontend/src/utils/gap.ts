export const getGap = (targetLevel: number, currentLevel?: number): number | undefined => {
  if (currentLevel === undefined) {
    return undefined;
  }

  return targetLevel - currentLevel;
};

export const getGapBackground = (targetLevel: number, currentLevel?: number): string => {
  const gap = getGap(targetLevel, currentLevel);

  if (gap === undefined) {
    return '#e2e8f0';
  }
  if (gap <= 0) {
    return '#4ade80';
  }
  if (gap === 1) {
    return '#facc15';
  }
  if (gap === 2) {
    return '#fb923c';
  }
  return '#f87171';
};

export const getGapText = (targetLevel: number, currentLevel?: number): string => {
  const gap = getGap(targetLevel, currentLevel);
  return gap === undefined ? 'N/A' : gap.toString();
};
