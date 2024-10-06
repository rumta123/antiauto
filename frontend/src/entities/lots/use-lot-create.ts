import { LotCreateDto, LotIdDto, lotsControllerCreate } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLotCreate(onSuccessCreateLot: ((data: LotIdDto) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: createLot, error, isPending, isError, isSuccess } = useMutation({
        mutationFn: (lotData: LotCreateDto) => lotsControllerCreate(lotData),
        onSuccess: (data:LotIdDto) => {
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            if (onSuccessCreateLot) {
                onSuccessCreateLot(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при создании лота:", error.message);
        }
    });

    return { createLot, isPending, error, isError, isSuccess };
}