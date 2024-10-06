
import { DealersCarsControllerCreateParams, PatchDealersCarDto, dealersCarsControllerCreate } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDealersCarCreate(onSuccessCreateDilersCar: ((data: PatchDealersCarDto) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: createCar, error, isPending, isError, isSuccess } = useMutation({
        mutationFn: (createParams: PatchDealersCarDto) => dealersCarsControllerCreate(createParams),
        onSuccess: (data: PatchDealersCarDto) => {
            queryClient.invalidateQueries({ queryKey: ['dealers-cars'] });
            if (onSuccessCreateDilersCar) {
                onSuccessCreateDilersCar(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при создании автомобиля:", error.message);
        }
    });

    return { createCar, isPending, error, isError, isSuccess };
}