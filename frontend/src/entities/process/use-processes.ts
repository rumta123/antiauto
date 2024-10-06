import { ProcessDto, processesControllerGetConversations, ProcessesControllerGetConversationsParams } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

const queryKey = 'processes'
export function useProcesses(params?: ProcessesControllerGetConversationsParams) {
    const {
        data: chats,
        isLoading,
        isError,
        error,
    } = useQuery<ProcessDto[], Error>({
        queryKey: [queryKey, params],
        queryFn: () => processesControllerGetConversations(params),
    });

    return { chats, isLoading, isError, error };
}