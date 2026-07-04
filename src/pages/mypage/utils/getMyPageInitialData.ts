import type { InitialData } from '../hooks/useMyPageForm'

type User = {
  email?: string
  nickname?: string
  target_budget?: number | null
  target_exercise_count?: number | null
  premium_point?: number | null
}

export const getMyPageInitialData = (user?: User | null): InitialData => ({
  email: user?.email ?? '',
  nickname: user?.nickname ?? '',
  budget:
    user?.target_budget === null || user?.target_budget === undefined
      ? ''
      : String(user.target_budget),
  exerciseGoal:
    user?.target_exercise_count === null ||
    user?.target_exercise_count === undefined
      ? ''
      : String(user.target_exercise_count),
  premiumPoint: user?.premium_point ? `${user.premium_point}P` : '0P',
})