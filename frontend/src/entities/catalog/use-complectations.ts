import { ModificationDto, carCatalogControllerGetModificationByConfiguration, CarCatalogControllerGetModificationByConfigurationParams, carCatalogControllerGetComplectationNamesWithOptionsByEngineHash, ComplectationWithOptionsDto } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useComplectations(markId?: string, modelId?: string, generationId?: string, configurationId?: string, params?: CarCatalogControllerGetModificationByConfigurationParams) {
    const isEnabled = !!markId && !!modelId && !!generationId && !!configurationId; 
    const paramsKey = JSON.stringify(params);
    const {
        data: complectations,
        isLoading,
        isError,
        error,
    } = useQuery<ModificationDto[], Error>({
        queryKey: ['car-catalog', markId, modelId, generationId, configurationId, paramsKey],
        queryFn: () => carCatalogControllerGetModificationByConfiguration(markId!, modelId!, generationId!, configurationId!, params),
        enabled: isEnabled
    });

    return { complectations, isLoading, isError, error };
}

export function useComplectationNamesWithOptionsByEngineHash(engineHash: string) {
    const {
        data: complectationsWithOptions,
        isLoading,
        isError,
        error,
    } = useQuery<ComplectationWithOptionsDto[], Error>({
        queryKey: ['car-/complectations/engine', engineHash],
        queryFn: () => carCatalogControllerGetComplectationNamesWithOptionsByEngineHash(engineHash),
    });

    return { complectationsWithOptions, isLoading, isError, error };
}