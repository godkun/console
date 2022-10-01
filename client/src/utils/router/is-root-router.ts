export function isRootRouter(item) {
  return item.meta?.alwaysShow != true && item.children?.length === 1
}
