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

export const clampDayToMonth = (year: number, month: number, day: number) =>
  Math.min(day, new Date(year, month, 0).getDate())

export const isDateRangeValid = (startDate: Date, endDate: Date) =>
  formatDateForApi(startDate) <= formatDateForApi(endDate)

export const isBeforeTicketRegistration = (exerciseDate: Date, registrationDate: string) =>
  formatDateForApi(exerciseDate) < registrationDate
