const padDatePart = (value: number) => String(value).padStart(2, '0')

export const formatDateForApi = (date: Date) => {
  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}-${month}-${day}`
}

export const formatDateForDisplay = (date: Date) => formatDateForApi(date).replaceAll('-', '.')

export const getYearMonth = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
})
