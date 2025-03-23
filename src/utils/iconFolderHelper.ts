export const getIconContext = (iconName: string): string => {
  if (/^[a-z]{2}(-[a-z]+)?$/i.test(iconName)) {
    return 'flags'
  }
  return 'icons'
}
