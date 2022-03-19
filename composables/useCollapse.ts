export const useCollapse = (collapse = false) => useState<boolean>('collapse', () => collapse)
