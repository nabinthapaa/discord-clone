export const paths = [
  "/",
  "/register",
  "/login",
  "/@me",
  "/@me/:channelId",
  "/server/:serverId/:channelId",
  "/not-found",
];

export function isValidPath(path: string): boolean {
  // Create a regex pattern for each valid path
  const pathPatterns = paths.map((p) => {
    const pattern = p
      .replace(/:[^\s/]+/g, "[^/]+") // Replace :param with regex for dynamic segments
      .replace(/\//g, "\\/"); // Escape slashes for regex
    return `^${pattern}$`;
  });

  const regex = new RegExp(pathPatterns.join("|"));
  return regex.test(path);
}
