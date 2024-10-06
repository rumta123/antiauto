import { offersControllerGetMostImportantStatusByCarId, OffersStatusDto } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useOffersMostImportantStatus(carId:string) {
    const {
        data: status,
        isLoading,
        isError,
        error,
    } = useQuery<OffersStatusDto, Error>({
        queryKey: [['offers-status'], carId],
        queryFn: () => offersControllerGetMostImportantStatusByCarId(carId),
        enabled: !!carId
    });
    return { status, isLoading, isError, error };
}