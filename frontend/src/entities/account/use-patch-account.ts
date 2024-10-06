import { accountControllerPatchAccount, AccountDto, PatchAccountDto } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function usePatchAccount(onSuccessPatch?: ((data: AccountDto) => void)) {
    const queryClient = useQueryClient();

    const { mutate: updateAccount, error, isPending, isError } = useMutation({
        mutationFn: (body: PatchAccountDto) => accountControllerPatchAccount(body),
        onSuccess: (data:AccountDto) => {
            // При успешном обновлении телефона вы можете инвалидировать или обновить кеш с аккаунтом
            queryClient.invalidateQueries({ queryKey: ['account'] });
            if (onSuccessPatch) {
                onSuccessPatch(data);
            }
        },
        onError: (error: Error) => {
            // Обработка ошибок, если что-то пойдет не так
            console.error("Ошибка при обновлении аккаунта:", error.message);
        }
    });

    return { updateAccount, isPending, error, isError };
}