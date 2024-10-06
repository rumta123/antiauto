import { DetailedModificationDto, ModificationDto, carCatalogControllerGetComplectationInfoByEngineHash, carCatalogControllerGetComplectationSpecificationInfoByEngineHash, carCatalogControllerGetDetailedModification } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useDetailedComplectation(markId: string, modelId: string, generationId: string, configurationId: string, complectationId: string) {
    const {
        data: detailedComplectation,
        isLoading,
        isError,
        error,
    } = useQuery<DetailedModificationDto, Error>({
        queryKey: ['car-catalog', markId, modelId, generationId, configurationId, complectationId],
        queryFn: () => carCatalogControllerGetDetailedModification(markId, modelId, generationId, configurationId, complectationId),
        enabled: !!markId && !!modelId && !!generationId && !!configurationId && !!complectationId
    });

    return { detailedComplectation, isLoading, isError, error };
}

export function useDetailedComplectationByEngineHash(engineHash: string) {
    const {
        data: detailedComplectation,
        isLoading,
        isError,
        error,
    } = useQuery<DetailedModificationDto, Error>({
        queryKey: ['car-catalog/ComplectationSpecification', engineHash],
        queryFn: () => carCatalogControllerGetComplectationSpecificationInfoByEngineHash(engineHash),
    });

    return { detailedComplectation, isLoading, isError, error };
}

export function useComplectationByEngineHash(engineHash: string) {
    const {
        data: complectation,
        isLoading,
        isError,
        error,
    } = useQuery<ModificationDto, Error>({
        queryKey: ['car-catalog/modification', engineHash],
        queryFn: () => carCatalogControllerGetComplectationInfoByEngineHash(engineHash),
    });

    return { complectation, isLoading, isError, error };
}
