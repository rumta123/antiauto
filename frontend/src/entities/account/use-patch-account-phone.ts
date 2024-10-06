import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostAccountPhoneVerifyDto, accountControllerPatchAccountPhone, accountControllerPostAccountPhoneVerify } from "@/shared/api/generated";

export function useUpdateAccountPhone() {
    const queryClient = useQueryClient();

    const { mutate: updatePhone, error, isPending, isError } = useMutation({
        mutationFn: (phone: string) => accountControllerPatchAccountPhone({ phone }),
        onSuccess: () => {
            // При успешном обновлении телефона вы можете инвалидировать или обновить кеш с аккаунтом
            queryClient.invalidateQueries({ queryKey: ['account'] });
        },
        onError: (error: Error) => {
            // Обработка ошибок, если что-то пойдет не так
            console.error("Ошибка при обновлении телефона аккаунта:", error.message);
        }
    });

    return { updatePhone, isPending, error, isError };
}

export function useUpdateAccountPhoneVerifyCode() {
    const queryClient = useQueryClient();

    const { mutate: updatePhoneCode, error, isPending, isError } = useMutation({
        mutationFn: (data:PostAccountPhoneVerifyDto) => accountControllerPostAccountPhoneVerify(data),
        onSuccess: () => {
            // При успешном обновлении телефона вы можете инвалидировать или обновить кеш с аккаунтом
            queryClient.invalidateQueries({ queryKey: ['account'] });
        },
        onError: (error: Error) => {
            // Обработка ошибок, если что-то пойдет не так
            console.error("Ошибка при обновлении телефона аккаунта:", error.message);
        }
    });

    return { updatePhoneCode, isPending, error, isError };
}