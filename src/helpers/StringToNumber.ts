export function stringToNumber(value: string | number | number) {
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  return undefined;
}
