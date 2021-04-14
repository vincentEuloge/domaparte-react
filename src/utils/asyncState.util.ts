export function match<
  T extends { readonly status: string },
  Out
>(
  pattern: {
    [K in T['status']]: (x: Extract<T, { readonly status: K }>) => Out
  },
): (x: T) => Out {
  return (x) => (pattern as any)[x.status](x);  //eslint-disable-line
}
