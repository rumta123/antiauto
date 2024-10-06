import { ProcessDto, processesControllerGetProcess } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useProcessById(processId: string) {
    const {
        data: process,
        isLoading,
        isError,
        error,
    } = useQuery<ProcessDto, Error>({
        queryKey: ['process', processId],
        queryFn: () => processesControllerGetProcess(processId),
    });

    return { process, isLoading, isError, error };
}