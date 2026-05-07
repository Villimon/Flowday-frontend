import { useQuery } from '@tanstack/react-query';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';
import { fetchLabels } from './fetch-labels';

export const useLabels = () => {
    return useQuery({
        queryKey: LABEL_KEYS.lists(),
        queryFn: fetchLabels,
        retryOnMount: false,
        refetchOnWindowFocus: false,
    });
};
