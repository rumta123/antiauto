import { MarkWithModelsDto, ModelDto, carCatalogControllerGetMarkWithModels, carCatalogControllerGetModelinfo } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useModels(markId: string, onlyBrandData?: boolean) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<MarkWithModelsDto, Error>({
        queryKey: ['car-catalog', markId, { onlyBrandData }], // Добавляем onlyBrandData в ключ запроса
        queryFn: () => carCatalogControllerGetMarkWithModels(markId, { onlyBrandData }), // Передаем onlyBrandData в API-функцию
    });

    // Если onlyBrandData === true, то models будет undefined, иначе возвращаем data.items
    const models = onlyBrandData ? undefined : data?.items;

    return { brand: data, models, isLoading, isError, error };
}


export function useModelInfo(modelId: string) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<ModelDto, Error>({
        queryKey: ['car-catalog','model-info', modelId],
        queryFn: () => carCatalogControllerGetModelinfo(modelId),
        enabled: !!modelId,
    });

    return { model: data, isLoading, isError, error };
}