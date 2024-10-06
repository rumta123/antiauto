import { AuthResDto, authControllerSignIn } from "@/shared/api/generated";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useSignInForm(onSuccessCallback?: (arg0: AuthResDto) => void) {
    const router = useRouter();

    const { register, control, getValues, handleSubmit } = useForm<{
        email: string,
        password: string
    }>()
    const [isCodeVerificationRequired, setIsCodeVerificationRequired] = useState(false);


    const signInMutation = useMutation({
        mutationFn: authControllerSignIn,
        onSuccess(data) {
            if (data && !data.isEmailVerified) {
                // Если требуется, показываем форму для ввода кода
                setIsCodeVerificationRequired(true);
            } else {
                // Если не требуется, перенаправляем на главную страницу
                queryClient.invalidateQueries({ queryKey: ['session'] });
                queryClient.invalidateQueries({ queryKey: ['account'] });
                if (onSuccessCallback) {
                    onSuccessCallback(data);
                }
            }
        }
    });

    const errorMessage = signInMutation.error instanceof AxiosError
        ? signInMutation.error?.response?.data?.message
        : undefined;

    return {
        register,
        control,
        getSignInFormValues: getValues,
        errorMessage,
        handleSubmit: handleSubmit(data => signInMutation.mutate(data)),
        isPending: signInMutation.isPending,
        isCodeVerificationRequired
    }
}