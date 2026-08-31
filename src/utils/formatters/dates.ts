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
) => `${formatMonthYear(from, style)} — ${formatMonthYear(to, style)}`
