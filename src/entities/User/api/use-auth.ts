import { useQuery } from '@tanstack/react-query';
import { fetchMe } from './fetch-me';

export const useAuth = () => {
    const query = useQuery({
        queryKey: ['user'],
        queryFn: fetchMe,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    return {
        ...query,
        isAuth: Boolean(query.data),
        isInitialized: !query.isLoading && !query.isFetching,
    }
};
