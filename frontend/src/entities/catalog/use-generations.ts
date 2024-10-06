import { GenerationDto, carCatalogControllerGetGenerationsByModel } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useGenerations(markId?: string, modelId?: string) {
    const isEnabled = !!markId && !!modelId; 
    const {
        data: generations,
        isLoading,
        isError,
        error,
    } = useQuery<GenerationDto[], Error>({
        queryKey: ['car-catalog', markId, modelId],
        queryFn: () => carCatalogControllerGetGenerationsByModel(markId!, modelId!),
        enabled: isEnabled
    });

    return { generations, isLoading, isError, error };
}