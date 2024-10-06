import { useMutation } from "@tanstack/react-query";
import { useSignUpForm } from "../model/use-sign-up-form";
import { authControllerSendCode} from "@/shared/api/generated";

export function useSendCode(email:string) {
    const { mutate: sendCode, isPending, error } = useMutation({
        mutationFn: () => authControllerSendCode({ email }),
        onSuccess: () => {
            // Обработайте успешную отправку, например, покажите уведомление
            console.log("Код успешно отправлен на email:", email);
        },
        onError: (error) => {
            // Обработайте ошибку отправки
            console.error("Ошибка отправки кода:", error);
        },
    });
    return { sendCode, isPending, error };
}
