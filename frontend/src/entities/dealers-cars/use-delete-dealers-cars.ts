import { DealersCarIdDto, dealersCarsControllerDeleteDealersCar } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useDeleteDealersCar(onSuccessPatchDilersCar: ((data: DealersCarIdDto) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: deleteCar, error, isPending, isError, isSuccess } = useMutation<DealersCarIdDto, any, string>({
        mutationFn: (carId: string) => dealersCarsControllerDeleteDealersCar(carId),
        onSuccess: (data: DealersCarIdDto) => {
            queryClient.invalidateQueries({ queryKey: ['dealers-cars'] });
            queryClient.invalidateQueries({ queryKey: ['dealers-cars', data.id] });
            if (onSuccessPatchDilersCar) {
                onSuccessPatchDilersCar(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при удалени автомобиля:", error.message);
        }
    });

    return { deleteCar, isPending, error, isError, isSuccess };
}