
import { OfferDto, offersControllerSetOfferStatus } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface useSetOfferStatusProps { offerId: string, statusDirection: "prev" | "next" }
export function useSetOfferStatus(onSuccesssetOfferStatus: ((data: any) => void) | undefined) {
    const queryClient = useQueryClient();

    
    const { mutate: setOfferStatus, error, isPending, isError, isSuccess } = useMutation<any,any,useSetOfferStatusProps>({
        mutationFn: ({ offerId, statusDirection }:useSetOfferStatusProps ) => offersControllerSetOfferStatus(offerId, statusDirection),
        onSuccess: (data: OfferDto) => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ['lots', data.lot_id] });
            if (onSuccesssetOfferStatus) {
                onSuccesssetOfferStatus(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при установке статуса предложения:", error.message);
        }
    });

    return { setOfferStatus, isPending, error, isError, isSuccess, };
}