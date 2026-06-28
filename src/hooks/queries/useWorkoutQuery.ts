import { useQuery } from '@tanstack/react-query';

import { getExerciseDetail } from '@/api/workoutApi';

// 특정 운동 기록 조회
export const useExerciseDetailQuery = (
    recordId?: number
) => {
    return useQuery({
        queryKey: ['exerciseDetail', recordId],
        queryFn: () => getExerciseDetail(recordId!),
        enabled: !!recordId,
    });
};