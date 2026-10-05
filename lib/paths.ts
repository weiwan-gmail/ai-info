const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: string) {
  const hashAt = path.indexOf("#");
  const hash = hashAt >= 0 ? path.slice(hashAt) : "";
  const beforeHash = hashAt >= 0 ? path.slice(0, hashAt) : path;
  const queryAt = beforeHash.indexOf("?");
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : "";
  let pathname = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;
  if (pathname !== "/" && !pathname.endsWith("/")) pathname = `${pathname}/`;
  return `${basePath}${pathname}${query}${hash}`;
}

export function assetPath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
