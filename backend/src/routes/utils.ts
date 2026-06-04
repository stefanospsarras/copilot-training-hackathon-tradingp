export const getErrorStatus = (error: unknown, fallbackStatus = 400): number => {
  if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
    return 404;
  }

  return fallbackStatus;
};
