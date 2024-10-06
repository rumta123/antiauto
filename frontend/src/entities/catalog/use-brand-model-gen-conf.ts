import { BrandModelGenConfDto, carCatalogControllerGetBrandModelGenConfInfoByEngineHash } from "@/shared/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useBrandModelGenConf(engine_hash:string) {
    const {
        data:catalogData,
        isLoading,
        isError,
        error,
    } = useQuery<BrandModelGenConfDto, Error>({
        queryKey: ['car-catalog', 'brand-model-gen-conf', engine_hash],
        queryFn: () => carCatalogControllerGetBrandModelGenConfInfoByEngineHash(engine_hash),
        enabled: !!engine_hash
    });

    return { catalogData, isLoading, isError, error };
}