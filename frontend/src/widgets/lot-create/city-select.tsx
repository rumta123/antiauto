"use client"

import { useModelInfo, useModels } from "@/entities/catalog/use-models";
import { useCities } from "@/entities/cities/use-cities";
import { LotCard } from "@/features/lot-create/ui/lot-card";
import { LotProgress } from "@/features/lot-create/ui/lot-progress";
import UiAutoComplete from "@/shared/ui/UiAutocomplete";
import UiButton from "@/shared/ui/UiButton";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "primereact/hooks";
import { Slider } from "primereact/slider";
import { useEffect, useState } from "react";
import { CityDto, citiesControllerGetCities } from "@/shared/api/generated";
import clsx from "clsx";
import { useComplectationText } from "@/features/catalog/model/use-complectation-text";
import { useConfigurationText } from "@/features/catalog/model/use-configuration-text";
import { useOptionsText } from "@/features/lot-create/model/use-options-text";

interface CitySelectWidgetProps {
    brandId: string;
    modelId: string;
    generationId_configurationId: string;
    engine_hash: string;
}

const CitySelectWidget: React.FC<CitySelectWidgetProps> = ({ brandId, modelId, generationId_configurationId, engine_hash }) => {
    const router = useRouter();
    const [newLotData, setNewLotData] = useLocalStorage<any>({}, 'lot-create');
    const { brand } = useModels(brandId, true);
    const { model } = useModelInfo(modelId);
    const { configurationText } = useConfigurationText(generationId_configurationId);
    const { complectationText } = useComplectationText(engine_hash);
    const [distance, setDistance] = useState<number | [number, number]>(newLotData.distance || 5)
    const [selectedCity, setSelectedCity] = useState<CityDto>(newLotData.city || null);
    // const {optionsText} = useOptionsText(newLotData.requiredOptions)

    useEffect(() => {
        // Обновление состояний при изменении значений в newLotData
        if (newLotData.city) {
            setSelectedCity(newLotData.city);
            setCityQuery(newLotData.city.name)
        }
        if (newLotData.distance) {
            setDistance(newLotData.distance);
        }
    }, [newLotData.city, newLotData.distance]);

    const [cityQuery, setCityQuery] = useState('');
    const [suggestions, setSuggestions] = useState<CityDto[]>([]);
    const fetchCities = async (query: string) => {
        try {
            const response = await citiesControllerGetCities({ name: query });
            setSuggestions(response);
        } catch (error) {
            console.error("Ошибка при получении городов:", error);
            // Обработка ошибок запроса
        }
    };


    const cityLine = `${selectedCity?.name} до ${distance} км`;

    return (
        <div className="flex flex-col gap-4 mt-2">
            <LotProgress value={85} />
            <div className='flex flex-col gap-2'>
                <p className="text-xl font-semibold">Создание лота. Выберите город</p>
            </div>
            <LotCard
                brand={brand?.name || ''}
                brand_logo={brand?.logo || ''}
                model={model?.name || ''}
                generation_configuration={configurationText}
                complectation={complectationText}
                options={newLotData.requiredOptions}
                additionalOptions={newLotData.electiveOptions}
                city={selectedCity && cityLine} />

            <div className="flex flex-col  gap-4">
                <UiAutoComplete
                    className="w-9/12"
                    label="Город"
                    placeholder="Начните вводить"
                    value={cityQuery}
                    suggestions={suggestions}
                    field="name"
                    completeMethod={(e) => {
                        setCityQuery(e.query);
                        fetchCities(e.query)
                    }}
                    onSelect={(e) => {
                        setSelectedCity(e.value)
                        setCityQuery(e.value.name);
                    }}
                />

                <p className="w-9/12">Максимальное расстояние от города {distance} км</p>
                <div className="w-9/12 flex flex-col ">
                    <Slider
                        className=""
                        value={distance}
                        onChange={(e) => setDistance(e.value)}
                        step={5}
                        min={5}
                        max={100}
                        pt={{
                            root: ({ props }: { props: any }) => ({
                                className: clsx(
                                    'relative',
                                    'bg-seabrand-100 dark:bg-gray-800 border-0 rounded-6',
                                    { 'h-1 w-full': props.orientation == 'horizontal', 'w-1 h-56': props.orientation == 'vertical' },
                                    { 'opacity-60 select-none pointer-events-none cursor-default': props.disabled }
                                )
                            }),
                            range: ({ props }: { props: any }) => ({
                                className: clsx('bg-seabrand-500', 'block absolute', {
                                    'top-0 left-0 h-full': props.orientation == 'horizontal',
                                    'bottom-0 left-0 w-full': props.orientation == 'vertical'
                                })
                            }),
                            handle: ({ props }: { props: any }) => ({
                                className: clsx(
                                    'h-4 w-4 bg-seabrand-500 dark:bg-gray-600 border-2 border-seabrand-500 rounded-full transition duration-200',
                                    'cursor-grab touch-action-none block',
                                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(207,237,239,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                                    'hover:bg-seabrand-700 hover:border hover:border-seabrand-700',
                                    {
                                        'top-[50%] mt-[-0.5715rem] ml-[-0.5715rem]': props.orientation == 'horizontal',
                                        'left-[50%] mb-[-0.5715rem] ml-[-0.4715rem]': props.orientation == 'vertical'
                                    }
                                )
                            })
                        }}
                    />
                    <div className="flex flex-row content-between justify-between mt-1 ">
                        <span className="text-sm">5</span>
                        <span className="text-sm">100</span>
                    </div>
                </div>
            </div>

            <div className='flex flex-row gap-4 my-2'>
                <UiButton severity='secondary' outlined onClick={() => router.push(`/lot-create/${brandId}/${modelId}/${generationId_configurationId}/${engine_hash}`)}>
                    Назад
                </UiButton>
                <UiButton
                    disabled={!selectedCity}
                    onClick={() => {
                        setNewLotData({ ...newLotData, city: selectedCity, distance })
                        router.push(`/lot-create/${brandId}/${modelId}/${generationId_configurationId}/${engine_hash}/city/finish`)
                    }}>
                    Продолжить
                </UiButton>
            </div>
        </div>
    )
}
export default CitySelectWidget