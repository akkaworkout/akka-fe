export const CALENDAR_ENDPOINTS = {
  LIST: '/calendar',
  GOAL: '/calendar/goal',
  SUMMARY: '/calendar/summary',
  DATE: (date: string) => `/calendar/${date}`,
}