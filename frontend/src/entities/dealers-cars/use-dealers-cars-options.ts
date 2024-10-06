import { dealersCarsControllerGetDealersCarMappedOptionsByCarId, OptionsCategoryDictionaryDto } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";


const queryKey = 'dealers-cars-options'
export function useDealersCarsMappedOptions(carId:string) {
    const {
        data: options,
        isLoading,
        isError,
        error,
    } = useQuery<OptionsCategoryDictionaryDto, Error>({
        queryKey: [ queryKey, carId],
        queryFn: () => dealersCarsControllerGetDealersCarMappedOptionsByCarId(carId),
    });

    return { options, isLoading, isError, error };
}