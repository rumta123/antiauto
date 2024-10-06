import { LotDto, LotsControllerGetAllLotsParams, LotsControllerGetLotOptionsByLotIdParams, LotsControllerGetLotsByCarIdParams, OptionsCategoryDictionaryDto, lotsControllerGetAllLots, lotsControllerGetLotById, lotsControllerGetLotOptionsByLotId, lotsControllerGetLotsByCarId } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useLots(params?:LotsControllerGetAllLotsParams) {
    const {
        data: lots,
        isLoading,
        isError,
        error,
    } = useQuery<LotDto[], Error>({
        queryKey: ['lots',params],
        queryFn: () => lotsControllerGetAllLots(params),
    });

    return { lots, isLoading, isError, error };
}

export function useLotsByCarId(carId: string, params: LotsControllerGetLotsByCarIdParams) {
    const {
        data: lots,
        isLoading,
        isError,
        error,
    } = useQuery<LotDto[], Error>({
        queryKey: ['lots-by-car', carId, params],
        queryFn: () => lotsControllerGetLotsByCarId(carId, params),
        enabled: !!carId.length
    });

    return { lots, isLoading, isError, error };
}

export function useLotById(lotId?: string) {
    const {
        data: lot,
        isLoading,
        isError,
        error,
    } = useQuery<LotDto, Error>({
        queryKey: ['lots', lotId],
        queryFn: () => lotId ? lotsControllerGetLotById(lotId) : Promise.reject("lotId is undefined"),
        enabled: !!lotId
    });

    return { lot, isLoading, isError, error };
}

export function useLotOptionsDictByLotId(lotId: string,params:LotsControllerGetLotOptionsByLotIdParams) {
    const {
        data: options,
        isLoading,
        isError,
        error,
    } = useQuery<OptionsCategoryDictionaryDto, Error>({
        queryKey: ['lots/options', lotId, params],
        queryFn: () => lotsControllerGetLotOptionsByLotId(lotId, params),
    });

    return { options, isLoading, isError, error };
}