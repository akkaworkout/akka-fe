// 백엔드 배포 서버
export const API_BASE_URL =
  'https://port-0-akka-workout-be-mkqkv57u21e615f4.sel3.cloudtype.app'

export const TICKET_ENDPOINTS = {
  LIST: '/tickets',
  CREATE: '/tickets',
  DETAIL: (id: number) => `/tickets/${id}`,
  DELETE: (id: number) => `/tickets/${id}`,
  END: (id: number) => `/tickets/${id}/end`,
}