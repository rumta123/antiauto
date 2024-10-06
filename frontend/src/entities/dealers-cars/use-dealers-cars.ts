import { DealersCarDto, DealersCarsControllerGetAllDealersCarsParams, PatchDealersCarDto, dealersCarsControllerGetAllDealersCars, dealersCarsControllerGetDealersCarById } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

const queryKey = 'dealers-cars'
export function useDealersCars(params?:DealersCarsControllerGetAllDealersCarsParams) {
    const {
        data: cars,
        isLoading,
        isError,
        error,
    } = useQuery<DealersCarDto[], Error>({
        queryKey: [ queryKey],
        queryFn: () => dealersCarsControllerGetAllDealersCars(params),
    });

    return { cars, isLoading, isError, error };
}

export function useDealersCarById(carId:string) {
    const {
        data: car,
        isLoading,
        isError,
        error,
    } = useQuery<DealersCarDto, Error>({
        queryKey: [ queryKey, carId],
        queryFn: () => dealersCarsControllerGetDealersCarById(carId),
    });

    return {car, isLoading, isError, error }
}

