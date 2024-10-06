import { CreateMessageDto, MessageDto, processesControllerCreateMessage } from "@/shared/api/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMessage(onSuccessCreateMessage?: ((data: MessageDto) => void) | undefined) {
    const queryClient = useQueryClient();

    const { mutate: createMessage, error, isPending, isError, isSuccess } = useMutation({
        mutationFn: (messageData: CreateMessageDto) => processesControllerCreateMessage(messageData),
        onSuccess: (data:MessageDto) => {
            queryClient.invalidateQueries({ queryKey: ['process', data.process_id] });
            if (onSuccessCreateMessage) {
                onSuccessCreateMessage(data);
            }
        },
        onError: (error: Error) => {
            console.error("Ошибка при создании лота:", error.message);
        }
    });

    return { createMessage, isPending, error, isError, isSuccess };
}