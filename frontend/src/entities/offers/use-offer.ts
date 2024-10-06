

import { OfferDto, offersControllerGetOfferById } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

const queryKey = 'offer'
export function useOffer(offerId?: string) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<OfferDto, Error>({
        queryKey: [queryKey, offerId],
        queryFn: () => offerId ? offersControllerGetOfferById(offerId) : Promise.reject('Offer ID is undefined'),
        enabled: !!offerId
    });

    return { data, isLoading, isError, error }
}