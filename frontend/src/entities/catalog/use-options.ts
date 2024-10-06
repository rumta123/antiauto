
import { CarCatalogControllerGetOptionsByEngineHashParams, OptionsAttrMapCategoryDictionaryDto, carCatalogControllerGetOptionsByConfiguration, carCatalogControllerGetOptionsByEngineHash, carCatalogControllerGetOptionsDictionary } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useOptions(configurationId: string) {
    const {
        data: options,
        isLoading,
        isError,
        error,
    } = useQuery<OptionsAttrMapCategoryDictionaryDto, Error>({
        queryKey: ['car-catalog', 'options-map', configurationId],
        queryFn: () => carCatalogControllerGetOptionsByConfiguration(configurationId),
    });

    return { options, isLoading, isError, error };
}

export function useOptionsByEngineHash(engine_hash: string, params?: CarCatalogControllerGetOptionsByEngineHashParams) {
    const {
        data: options,
        isLoading,
        isError,
        error,
    } = useQuery<OptionsAttrMapCategoryDictionaryDto, Error>({
        queryKey: ['car-catalog', 'options-map', engine_hash, params],
        queryFn: () => carCatalogControllerGetOptionsByEngineHash(engine_hash, params),
    });

    return { options, isLoading, isError, error };
}

export function useOptionsDictionary(){
    const {
        data: optionsDictionary,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['car-catalog', 'options-dict'],
        queryFn:()=> carCatalogControllerGetOptionsDictionary()
    })
    return { optionsDictionary, isLoading, isError, error };
}