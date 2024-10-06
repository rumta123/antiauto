import { accountControllerGetSubAccounts, SubAccountDto } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useSubAccounts() {
    const {
        data: subAccounts,
        isLoading,
        isError,
        error,
    } = useQuery<SubAccountDto[], Error>({
        queryKey: ['sub-accounts'],
        queryFn: () => accountControllerGetSubAccounts(),
    });

    return { subAccounts, isLoading, isError, error };
}

