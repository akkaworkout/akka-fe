export const ticketApi = {
  BASE: '/tickets',
  DETAIL: (id: number) => `/tickets/${id}`,
  END: (id: number) => `/tickets/${id}/end`,
  SUMMARY: (id: number) => `/tickets/${id}/summary`,
}