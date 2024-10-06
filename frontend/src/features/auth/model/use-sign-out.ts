
import { useResetSession } from "@/entities/session";
import { authControllerSignOut } from "@/shared/api/generated";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useSignOut() {
    const router = useRouter();
    const resetSession = useResetSession();

    const signOutMutation = useMutation({
        mutationFn: authControllerSignOut,
        async onSuccess() {
            // resetSession();
            router.push("/");
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['account'] });
        },
        onError() {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['account'] });
        }
    })

    const errorCode = signOutMutation.error instanceof AxiosError
        ? signOutMutation.error?.response?.data?.statusCode
        : undefined;

    return {
        isPending: signOutMutation.isPending,
        isError: signOutMutation.isError,
        errorCode: errorCode,
        signOut: signOutMutation.mutate,
    };
}