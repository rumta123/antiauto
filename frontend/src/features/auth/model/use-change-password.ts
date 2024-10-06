import { authControllerChangePassword, ChangePasswordBodyDto } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChangePassword() {
    const queryClient = useQueryClient();
    const { mutate: changePassword, error, isPending, isError } = useMutation({
        mutationFn: ({ password, newPassword }:ChangePasswordBodyDto) => authControllerChangePassword({ password, newPassword }),
        onSuccess: () => {
            // При успешном обновлении пароля вы можете инвалидировать или обновить кеш с аккаунтом
            queryClient.invalidateQueries({ queryKey: ['account'] });
            queryClient.invalidateQueries({ queryKey: ['session'] });
        },
        onError: (error: Error) => {
            // Обработка ошибок, если что-то пойдет не так
            console.error("Ошибка при обновлении пароля:", error.message);
        }
    });

    return { changePassword, isPending, error, isError };
}

