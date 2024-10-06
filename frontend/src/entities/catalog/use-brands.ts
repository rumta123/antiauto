import { useQuery } from "@tanstack/react-query";
import { carCatalogControllerGetAllBrands, CarCatalogControllerGetAllBrandsParams, MarkDto } from "@/shared/api/generated";

export function useBrands(params?: CarCatalogControllerGetAllBrandsParams) {
    const paramsKey = JSON.stringify(params);
    const {
        data: marks,
        isLoading,
        isError,
        error,
    } = useQuery<MarkDto[], Error>({
        queryKey: ['car-catalog',paramsKey],
        queryFn: () => carCatalogControllerGetAllBrands(params),
    });

    return { marks, isLoading, isError, error };
}
