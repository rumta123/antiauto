import { OfferCreateDto, OfferDto, OffersControllerGetOffersTemplatesParams, offersControllerCreate, offersControllerGetOffersTemplates } from "@/shared/api/generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ApiErrorData {
    message: string;
    severity: 'error' | 'info' | 'warn' | 'success';
}

export function useOfferCreate(onSuccessCreateOffer: ((data: OfferDto) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: createOffer, error, isPending, isError, isSuccess } = useMutation<OfferDto,any,any>({
        mutationFn: (offerData: OfferCreateDto) => offersControllerCreate(offerData),
        onSuccess: (data: OfferDto) => {
            // queryClient.invalidateQueries({ queryKey: ['lots'] });
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            queryClient.invalidateQueries({ queryKey: ["offers-templates", { lot_id: data.lot_id }] });
            if (onSuccessCreateOffer) {
                onSuccessCreateOffer(data);
            }
        },
        onError: (error: AxiosError<ApiErrorData>) => {
            console.error("Ошибка при создании предложения:", error.message);

        }
    });

    return { createOffer, isPending, error: error?.response?.data, isError, isSuccess };
}


export function useOffersCreateTemplates(params: OffersControllerGetOffersTemplatesParams) {
    const {
        data: offersTemplates,
        isLoading: isLoadingOffersTemplates,
        isError: isErrorOffersTemplates,
        error: errorOffersTemplates,
    } = useQuery<OfferCreateDto[], Error>({
        queryKey: ["offers-templates", params],
        queryFn: () => offersControllerGetOffersTemplates(params),
    });

    return { offersTemplates, isLoadingOffersTemplates, isErrorOffersTemplates, errorOffersTemplates };
}