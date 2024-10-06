import { authControllerSignUpSub, SignUpSubAccountBodyDto } from "@/shared/api/generated";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

export function useSignUpSubaccount(onSuccessCustom?: () => void) {
    const { register, control, handleSubmit, formState: { errors } } = useForm<SignUpSubAccountBodyDto>();

    const signUpSubaccount = useMutation({
        mutationFn: authControllerSignUpSub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sub-accounts'] });
            if (onSuccessCustom) {
                onSuccessCustom();
            }
        }
    });
    const trimPhone = (phone?: string) => phone?.replace(/[\s\(\)-]/g, '') || '';

    const handleFormSubmit = (data: SignUpSubAccountBodyDto) => {
        data.phone = trimPhone(data.phone)
        signUpSubaccount.mutate(data);
    };

    return {
        register,
        control,
        handleSubmit: handleSubmit(handleFormSubmit), // This binds react-hook-form validation to your submission logic
        isPending: signUpSubaccount.isPending,
        error: signUpSubaccount.error
    };
}

