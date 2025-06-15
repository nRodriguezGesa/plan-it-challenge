export function msToSeconds(ms: number): number {
  return ms / 1000;
}
export function secondsBetweenDates(startDate: Date, endDate: Date): number {
  const diff = endDate.getTime() - startDate.getTime();
  return msToSeconds(diff);
}
