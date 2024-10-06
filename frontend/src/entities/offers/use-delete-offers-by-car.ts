import { offersControllerDeleteOffersByCarId } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useDeleteOffersByCar(onSuccessDeleteOffers: ((data: any) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: deleteOffersByCar, error, isPending, isError, isSuccess } = useMutation<void, any, string>({
        mutationFn: (carId: string) => offersControllerDeleteOffersByCarId(carId),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['dealers-cars'] });
            if (onSuccessDeleteOffers) {
                onSuccessDeleteOffers(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при удалении предложений:", error.message);
        }
    });

    return { deleteOffersByCar, isPending, error, isError, isSuccess, /* onSuccess */ };
}