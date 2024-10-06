
import { OfferDto, OfferIdDto, offersControllerDeleteOfferById } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useDeleteOffer(onSuccessDeleteOffer: ((data: any) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: deleteOffer, error, isPending, isError, isSuccess } = useMutation<OfferIdDto, any, string>({
        mutationFn: (offerId: string) => offersControllerDeleteOfferById(offerId),
        onSuccess: (data: OfferIdDto) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['lots', data.lot_id] });
            if (onSuccessDeleteOffer) {
                onSuccessDeleteOffer(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при удалении предложения:", error.message);
        }
    });

    return { deleteOffer, isPending, error, isError, isSuccess, /* onSuccess */ };
}