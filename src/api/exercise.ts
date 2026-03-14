export const EXERCISE_RECORD_ENDPOINTS = {
  LIST: '/exercise-record',
  CREATE: '/exercise-record',
  DETAIL: (id: number) => `/exercise-record/${id}`,
  UPDATE: (id: number) => `/exercise-record/${id}`,
  DELETE: (id: number) => `/exercise-record/${id}`,
}