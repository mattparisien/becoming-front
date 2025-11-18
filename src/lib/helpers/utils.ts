export const groupBy = <T extends Record<string, unknown>>(array: T[], key: keyof T): Record<string, T[]> =>
  array.reduce((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);