import { ConfigurationDto, GenerationDto, carCatalogControllerGetConfigurationInfo, carCatalogControllerGetConfigurationsByGeneration } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useConfigurations(markId: string, modelId: string, generationId: string) {
    const {
        data: configurations,
        isLoading,
        isError,
        error,
    } = useQuery<ConfigurationDto[], Error>({
        queryKey: ['car-catalog', markId, modelId, generationId],
        queryFn: () => carCatalogControllerGetConfigurationsByGeneration(markId, modelId, generationId),
    });

    return { configurations, isLoading, isError, error };
}

export function useConfigurationInfo(generationId_configurationId: string) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<GenerationDto, Error>({
        queryKey: ['car-catalog', 'genconfinfo', generationId_configurationId],
        queryFn: () => carCatalogControllerGetConfigurationInfo(generationId_configurationId),
    });

    return { configurationInfo:data, isLoading, isError, error };
}