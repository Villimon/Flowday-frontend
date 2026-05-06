import { useQuery } from '@tanstack/react-query';
import { fetchMe } from './fetch-me';
import { useMemo } from 'react';

export const useAuth = () => {
    const query = useQuery({
        queryKey: ['user'],
        queryFn: fetchMe,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    return useMemo(
        () => ({
            data: query.data,
            isAuth: Boolean(query.data),
            isInitialized: !query.isLoading && !query.isFetching,
        }),
        [query.data, query.isLoading, query.isFetching]
    );
};
