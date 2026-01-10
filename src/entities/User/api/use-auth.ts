import { useQuery } from '@tanstack/react-query';
import { fetchMe } from './fetch-me';

export const useAuth = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchMe,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};
