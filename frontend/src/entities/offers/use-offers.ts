import { OfferDto, OffersControllerGetOffersParams, offersControllerGetOffers } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

const queryKey = 'offers'
export function useOffers(params: OffersControllerGetOffersParams) {
    const {
        data: offers,
        isLoading: isLoadingOffers,
        isError: isErrorOffers,
        error: errorOffers,
    } = useQuery<OfferDto[], Error>({
        queryKey: [queryKey, params],
        queryFn: () => offersControllerGetOffers(params),
        enabled: !!params.lot_id
    });

    return { offers, isLoadingOffers, isErrorOffers, errorOffers };
}
