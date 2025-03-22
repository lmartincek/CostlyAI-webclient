import { DAYS_AS_ORDINALS, MONTHS } from '@/constants/date.ts'

export function parseDateAsOrdinalsWithMonths(date: Date): string | null {
  const day = DAYS_AS_ORDINALS[date.getDate()] ?? `${date.getDate()}th`
  const month = MONTHS[date.getMonth() + 1]

  if (day && month) return `${day} of ${month}, ${date.getFullYear()}`
  return null
}

const DateFormats = {
  DayMonthYear: 'DD-MM-YYYY',
  YearMonthDay: 'YYYY-MM-DD',
} as const
type DateFormat = (typeof DateFormats)[keyof typeof DateFormats]

export function parseDateStandard(
  date: string,
  format: DateFormat = DateFormats.DayMonthYear,
): string | null {
  const parsedDate = new Date(date)

  if (!parsedDate) return null

  const day = parsedDate.getDate()
  const month = parsedDate.getMonth() + 1
  const year = parsedDate.getFullYear()

  if (format === DateFormats.DayMonthYear) return `${day}.${month}.${year}`
  if (format === DateFormats.YearMonthDay) return `${year}.${month}.${day}`
  return null
}
