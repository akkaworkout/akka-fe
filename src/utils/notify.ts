export type Notice = { message: string; tone: 'success' | 'error' | 'info'; id: number }

export const notify = (message: string, tone?: Notice['tone']) => {
  const resolvedTone =
    tone ?? (/실패|오류|못했|다시 시도|올바르지|불러오지/.test(message) ? 'error' : 'success')
  window.dispatchEvent(
    new CustomEvent<Notice>('akka:notice', {
      detail: { message, tone: resolvedTone, id: Date.now() + Math.random() },
    }),
  )
}
