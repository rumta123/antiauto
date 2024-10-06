import { useQuery } from "@tanstack/react-query";
import { citiesControllerGetCities, CitiesControllerGetCitiesParams, CityDto } from "@/shared/api/generated";

export function useCities(params?: CitiesControllerGetCitiesParams) {
    const paramsKey = JSON.stringify(params);
    const {
        data: cities,
        isLoading: isCitiesLoading,
        isError: isCitiesError,
        error: citiesError,
    } = useQuery<CityDto[], Error>({
        queryKey: ['cities',paramsKey],
        queryFn: () => citiesControllerGetCities(params),
    });

    return { cities, isCitiesLoading, isCitiesError, citiesError };
}
