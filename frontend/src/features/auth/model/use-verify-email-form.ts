import { AuthResDto, EmailVerificationDto, authControllerEmailVerify } from "@/shared/api/generated";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function useVerifyEmailForm(onSuccessCallback?: (arg0: AuthResDto) => void) {

    const { register, handleSubmit, control } = useForm<{
        email: string,
        code: string
    }>()

    const verifyEmailMutation = useMutation({
        mutationFn: (data:{email:string,code:string}) => authControllerEmailVerify(data),
        onSuccess(data) {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['account'] });
            //router.push('/')
            if (onSuccessCallback) {
                onSuccessCallback(data);
            }
        },
        onError(err) {
            console.error('error',err)
        }
    })
    
    return {
        register,
        control,
        error: verifyEmailMutation.error,
        handleSubmitVerifyEmail: handleSubmit(data => verifyEmailMutation.mutate(data) ),
        isPending: verifyEmailMutation.isPending,
        isError: verifyEmailMutation.isError
    }
}