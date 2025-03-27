export const getQueryParams = <T extends Record<string, any>>(queries: T): string => {
  const queryParams = Object.entries(queries)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return queryParams ? `?${queryParams}` : ''
}
