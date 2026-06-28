import { useQuery } from '@tanstack/react-query';

import { getTickets, getActiveTickets, getTicketSummary } from '@/api/ticketApi'

// 전체 이용권 조회
export const useTicketsQuery = () => {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: getTickets
    });
}

// 진행 중인 이용권 조회
export const useActiveTicketsQuery = () => {
    return useQuery({
        queryKey: ['activeTickets'],
        queryFn: getActiveTickets
    });
};

// 이용권 요약 정보 조회
export const useTicketSummaryQuery = (
    ticketId: number
) => {
    return useQuery({
        queryKey: ['exerciseSummary', ticketId],
        queryFn: () => getTicketSummary(ticketId),
        enabled: !!ticketId
    });
};