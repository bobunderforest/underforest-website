const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export type DateStyle = 'numeric' | 'short'

export const formatMonthYear = (
  value: string,
  style: DateStyle = 'numeric',
): string => {
  if (value === 'present') return 'present'

  const [year, month] = value.split('-')
  if (!month) return year

  if (style === 'short') {
    const name = MONTHS[Number(month) - 1]
    return name ? `${name} ${year}` : year
  }

  return `${year}.${month.padStart(2, '0')}`
}

export const formatDateRange = (
  from: string,
  to: string,
  style: DateStyle = 'numeric',
) =>
  from === to
    ? formatMonthYear(from, style)
    : `${formatMonthYear(from, style)} — ${formatMonthYear(to, style)}`

const parseYearMonth = (value: string) => {
  if (value === 'present') {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }

  const [yearValue, monthValue] = value.split('-')
  const year = Number(yearValue)
  const month = Number(monthValue)

  if (!year || month < 1 || month > 12) return null

  return { year, month }
}

export const formatDateDuration = (from: string, to: string) => {
  const start = parseYearMonth(from)
  const end = parseYearMonth(to)

  if (!start || !end) return null

  const durationInMonths =
    (end.year - start.year) * 12 + end.month - start.month + 1
  if (durationInMonths < 1) return null

  const years = Math.floor(durationInMonths / 12)
  const months = durationInMonths % 12
  const parts = [
    years > 0 ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : null,
    months > 0 ? `${months} ${months === 1 ? 'mo' : 'mos'}` : null,
  ]

  return parts.filter(Boolean).join(' ')
}
