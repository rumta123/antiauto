import { authControllerSignUp } from "@/shared/api/generated";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useSignUpForm() {
    const router = useRouter();

    const { register, control, getValues, handleSubmit } = useForm<{
        email: string,
        password: string
    }>()
    const [isCodeVerificationRequired, setIsCodeVerificationRequired] = useState(false);


    const signUpMutation = useMutation({
        mutationFn: authControllerSignUp,
        onSuccess(data) {
            // Проверяем, требуется ли подтверждение по email
            if (data && !data.isEmailVerified) {
                // Если требуется, показываем форму для ввода кода
                setIsCodeVerificationRequired(true);
            } else {
                // Если не требуется, перенаправляем на главную страницу
                queryClient.invalidateQueries({ queryKey: ['session'] });
                queryClient.invalidateQueries({ queryKey: ['account'] });
                router.push("/");
            }
        }
    });

    const errorMessage = signUpMutation.error instanceof AxiosError
        ? signUpMutation.error?.response?.data?.message
        : undefined;

    return {
        register,
        control,
        getSignUpFormValues: getValues,
        errorMessage,
        handleSubmit: handleSubmit(data => signUpMutation.mutate(data)),
        isPending: signUpMutation.isPending,
        isCodeVerificationRequired
    }
}