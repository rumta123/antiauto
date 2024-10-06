import { AccountDto, accountControllerGetAccount } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";


export function useAccount() {

    const {
        data: account,
        isLoading,
        isError,
        error,
    } = useQuery<AccountDto, Error>({
        queryKey: ['account'],
        queryFn: () => accountControllerGetAccount(),
    });

    return { account, isLoading, isError, error };
}
