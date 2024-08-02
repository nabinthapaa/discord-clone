export function getMilliseconds(time: string): number {
  const value = parseInt(time.slice(0, -1), 10);
  const unit = time.slice(-1);

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "m":
      return value * 30 * 24 * 60 * 60 * 1000;
    case "y":
      return value * 12 * 30 * 24 * 60 * 60 * 1000;
    default:
      const parseValue = parseInt(time, 10);
      if (!isNaN(parseValue)) return parseValue;
      return 0;
  }
}
