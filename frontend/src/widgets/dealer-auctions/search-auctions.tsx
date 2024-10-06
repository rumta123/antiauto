"use client"
import { useLots } from "@/entities/lots/use-lots"
import { SelectCarDialog } from "@/features/dealer-cars"
import { LotsList } from "@/features/lot/ui/lots-list"
import { CityDto, LotsControllerGetAllLotsParams, citiesControllerGetCities } from "@/shared/api/generated"
import { UiButton, UiAutoComplete, UiSelectButton, UiSpinner, UiInputNumber } from "@/shared/ui"
import { useEffect, useState } from "react"

export default function SearchAuctionsWidget() {
    const filterStatusItems = [
        { name: 'Активные', value: 'active' },
        { name: 'Завершённые', value: 'finished' }
    ];
    interface filterProps {
        status: string;
        city_id?: string;
        minPrice?: number
    }
    const [filter, setFilter] = useState<LotsControllerGetAllLotsParams>({
        status: filterStatusItems[0].value
    })


    const { lots, isLoading, isError, error } = useLots(filter)
    const [cityQuery, setCityQuery] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<CityDto[]>([]);
    const fetchCities = async (query: string) => {
        try {
            const response = await citiesControllerGetCities({ name: query });
            setCitySuggestions(response);
        } catch (error) {
            console.error("Ошибка при получении городов:", error);
        }
    };

    return <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-center">
            <p className="text-4xl text-brand-900 font-black">Все аукционы</p>
            <UiSelectButton buttonSize="small" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.value })} optionLabel="name" options={filterStatusItems} />
        </div>
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
                <SelectCarDialog onSelected={(data) => {
                    if (data.type === 'car') {
                        setFilter({
                            ...filter,
                            dealer_car_id: data.selectedCar?.id || undefined,
                            mark_id: undefined,
                            model_id: undefined,
                            gen_id: undefined,
                            conf_id: undefined
                        })
                    } else if (data.type === 'catalog') {
                        setFilter({
                            ...filter,
                            dealer_car_id: undefined,
                            mark_id: data.selectedCatalogData?.brand?.id,
                            model_id: data.selectedCatalogData?.model?.id,
                            gen_id: data.selectedCatalogData?.generation?.id,
                            conf_id: data.selectedCatalogData?.configuration?.id
                        })
                    }
                }}/>
                <UiAutoComplete
                    uiSize="small"
                    label="Город"
                    placeholder="Начните вводить"
                    value={cityQuery}
                    suggestions={citySuggestions}
                    readOnly={!!filter.city_id}
                    field="name"
                    showClear={!!filter.city_id}
                    onClear={() => {
                        setFilter({ ...filter, city_id: undefined })
                        setCityQuery('')
                    }}
                    completeMethod={(e) => {
                        setCityQuery(e.query);
                        fetchCities(e.query)
                    }}
                    onSelect={(e) => {
                        setFilter({ ...filter, city_id: e.value.id })
                        setCityQuery(e.value.name);
                    }}
                />
                <UiInputNumber label="Цена от" uiSize="small" onChange={(e) => setFilter({ ...filter, minPrice: e.value || undefined })} />
            </div>
        </div>

        {isLoading ?
            <UiSpinner />
            :
            isError ?
                <div>Error: {error?.message}</div>
                :
                <LotsList lots={lots} />
        }
    </div>
}