
import { PatchDealersCarDto, dealersCarsControllerGetDealersCarPatchInfoById, dealersCarsControllerPatchDealersCars } from "@/shared/api/generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export function usePatchDealersCar(onSuccessPatchDilersCar: ((data: PatchDealersCarDto) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: patchCar, error: errorPatchCar, isPending: isPendingPatchCar, isError: isErrorPatchCar, isSuccess: isSuccessPatchCar } = useMutation<PatchDealersCarDto,any,PatchDealersCarDto>({
        mutationFn: (data: PatchDealersCarDto) => dealersCarsControllerPatchDealersCars(data),
        onSuccess: (data: PatchDealersCarDto) => {
            queryClient.invalidateQueries({ queryKey: ['dealers-cars'] });
            queryClient.invalidateQueries({ queryKey: ['dealers-cars', data.id] });
            if (onSuccessPatchDilersCar) {
                onSuccessPatchDilersCar(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при сохранении автомобиля:", error.message);
        }
    });

    return { patchCar, isPendingPatchCar, errorPatchCar, isErrorPatchCar, isSuccessPatchCar };
}

export function usePatchInfoDealersCarById(carId: string) {
    const {
        data: car,
        isLoading,
        isError,
        error,
    } = useQuery<PatchDealersCarDto, Error>({
        queryKey: ['dealers-cars-patch-info', carId],
        queryFn: () => dealersCarsControllerGetDealersCarPatchInfoById(carId),
    });

    return { car, isLoading, isError, error }
}