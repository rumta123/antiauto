import { BackBtn } from "@/features/navigation";
import { ConfigurationDto, GenerationDto, ModificationDto, PatchDealersCarDto } from "@/shared/api/generated";
import { useEffect, useRef, useState } from "react";
import { PatchCarForm } from "./patch-car-form";
import { BrandSelector } from "@/features/catalog/ui/brand-selector";
import { ModelSelector } from "@/features/catalog/ui/model-selector";
import { GenerationsConfigurationsList } from "@/features/catalog/ui/gen-conf-list";
import { useGenerations } from "@/entities/catalog/use-generations";
import { useComplectations } from "@/entities/catalog/use-complectations";
import { ComplectationsList } from "@/features/catalog/ui/complectations-list";
import { ComplectationSpecOpts } from "@/features/catalog/ui/complectation-spec-opts";
import { UiButton, UiToast } from "@/shared/ui";
import { useBrandModelGenConf } from "@/entities/catalog/use-brand-model-gen-conf";
import { useDealersCarCreate, usePatchDealersCar } from "@/entities/dealers-cars";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";

interface DealerCarOptionType {
    id: string;
    option_id: string;
    value: string;
    value_type: string;
    option_name: string;
    is_complectation_option?: boolean;
}

interface ExtendedPatchCarData extends PatchDealersCarDto {
    brand_name?: string;
    model_name?: string;
    generation?: GenerationDto;
    configuration?: ConfigurationDto;
    complectation?: ModificationDto;
}

interface PatchCarProps {
    mode?: string;
    initialCarData: ExtendedPatchCarData;
    initialEngineHashData?: any;
    engineHash?: string;
    setEngineHash?: (engineHash: string) => void;
    setComplectationId?: (value: string) => void;
}
export function PatchCar({ initialCarData, initialEngineHashData, mode = "edit", engineHash = '', setEngineHash, setComplectationId }: PatchCarProps) {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [carData, setCarData] = useState<ExtendedPatchCarData>(initialCarData)
    useEffect(() => {
        if (!!initialEngineHashData) {
            setCarData({
                ...carData,
                id: initialEngineHashData.id,
                brand_id: initialEngineHashData.brand_id,
                engine_hash: initialEngineHashData.engine_hash,
                configuration_id: initialEngineHashData.configuration_id,
                generation_id: initialEngineHashData.generation_id,
                model_id: initialEngineHashData.model_id,
            })
        }
    }, [initialEngineHashData]);

    const [searchBrand, setSearchBrand] = useState('');
    const [searchModel, setSearchModel] = useState('');
    const { generations } = useGenerations(carData?.brand_id, carData?.model_id);
    const { complectations } = useComplectations(carData?.brand_id, carData?.model_id, carData?.generation_id, carData?.configuration_id);

    // const [selectedPossibleOptions, setSelectedPossibleOptions] = useState(initialCarData.options.filter(opt=>opt.is_complectation_option===false))
    const [selectedPossibleOptions, setSelectedPossibleOptions] = useState<{ [key: string]: any }>()
    const [selectedDefaultOptions, setSelectedDefaultOptions] = useState()

    useEffect(() => {
        console.log('selectedPossibleOptions', selectedPossibleOptions)
    }, [selectedPossibleOptions])

    useEffect(() => {
        if (initialCarData.options.length) {
            const extraOpts = initialCarData.options.filter(opt => opt.is_complectation_option === false)
            const optionsForCategory: Record<string, any> = {};
            for (const option of extraOpts) {
                optionsForCategory[option.option_name] = {
                    id: option.id,
                    option_id: option.combined_option_id,
                    option_name: option.option.name,
                    value: option.value
                };
            }
            setSelectedPossibleOptions(
                optionsForCategory
            )
        }
    }, [initialCarData])

    const { catalogData } = useBrandModelGenConf(carData?.engine_hash);
    useEffect(() => {
        if (catalogData) {
            setCarData({
                ...carData,
                brand_name: catalogData.brand.name,
                model_name: catalogData.model.name,
                generation: catalogData.generation,
                configuration: catalogData.configuration
            });
        }
    }, [catalogData]);
    const { patchCar, isPendingPatchCar, isSuccessPatchCar, isErrorPatchCar, errorPatchCar } = usePatchDealersCar(data => {
        // if (mode === "add") {
        //     router.push("/cars")
        // } else if (mode === "edit") {
        router.push(`/cars/${data.id}`)
        // }
    });
    const { createCar, isPending: isCarCreatePending, isError: isCarCreateError, error: errorCarCreate, isSuccess: isCarCreateSuccess } = useDealersCarCreate(data => {
        // if (mode === "add") {
        router.push("/cars")
        // } else if (mode === "edit") {
        //     router.push(`/cars/${data.id}`)
        // }
    })
    useEffect(() => {
        if (isErrorPatchCar && errorPatchCar) {
            toast.current?.show({
                severity: 'error',
                summary: errorPatchCar?.response?.data?.message || 'Произошла ошибка при сохранении автомобиля.'
            })
        }
    }, [errorPatchCar, isErrorPatchCar])
    useEffect(() => {
        if (isSuccessPatchCar) {
            toast.current?.show({
                severity: 'success',
                summary: 'Автомобиль сохранён'
            })

        }
    }, [isSuccessPatchCar])

    const handleCarPatch = async () => {
        const defaultOptionsWithKeys = selectedDefaultOptions ? Object.entries(selectedDefaultOptions as Record<string, DealerCarOptionType>).map(([key, option]): DealerCarOptionType => ({
            ...option,
            is_complectation_option: true,
            option_name: key
        })) : [];
        const additionalOptionsWithKeys = selectedPossibleOptions ? Object.entries(selectedPossibleOptions as Record<string, DealerCarOptionType>).map(([key, option]): DealerCarOptionType => ({
            ...option,
            option_name: key // Использование ключа как optionName
        })) : [];
        const combinedOptions: DealerCarOptionType[] = [
            ...defaultOptionsWithKeys,
            ...additionalOptionsWithKeys
        ];
        const patchData: PatchDealersCarDto = {
            brand_id: carData.brand_id,
            city_id: (!!carData.city_id ? carData.city_id : undefined),
            city_name: carData.city_name,
            complectation_id: carData.complectation_id,
            configuration_id: carData.configuration_id,
            engine_hash: carData.engine_hash,
            generation_id: carData.generation_id,
            id: carData.id,
            isMileageAbroad: carData.isMileageAbroad,
            mileage: carData.mileage,
            model_id: carData.model_id,
            options: combinedOptions.map(option => ({
                combined_option_id: option.option_id,
                value: option.value,
                value_type: option.value_type,
                is_complectation_option: option.is_complectation_option || false,
                option_name: option.option_name
            })),
            photos: [],
            vin: carData.vin,
            year: carData.year
        };
        if (!!carData) {
            if (mode === "edit") {
                patchCar(patchData)
            } else {
                // const { createCar, isPending: isCarCreatePending, isError: isCarCreateError, error: errorCarCreate, isSuccess: isCarCreateSuccess } = useDealersCarCreate(setEngineHashData)
                createCar(patchData)
            }
        }
    }

    return (<>
        <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center gap-4">
                <BackBtn path={mode === "add" ? '/cars' : `/cars/${initialCarData?.id}`} />
                <p className="text-4xl text-brand-900 font-black">{mode === "add" ? "Добавить автомобиль" : "Редактирование автомобиля"}</p>
            </div>
            <PatchCarForm
                carData={carData}
                setCarData={setCarData}
                setSearchBrand={setSearchBrand}
                setSearchModel={setSearchModel}
                generations={generations}
                complectations={complectations}
                setEngineHash={setEngineHash}
                setComplectationId={setComplectationId}
            />
            {!carData?.brand_id && <BrandSelector searchBrand={searchBrand}
                onSelectBrand={(brand) => {
                    setCarData({
                        ...carData,
                        brand_name: brand.name, brand_id: brand.id,
                        model_name: undefined, model_id: '',
                        configuration: undefined, configuration_id: '',
                        engine_hash: '',
                        generation_id: '', generation: undefined
                    });
                }} />}
            {carData?.brand_id && !carData?.model_id && <ModelSelector
                brandId={carData.brand_id}
                onSelectModel={(model) => { setCarData({ ...carData, model_id: model.id, model_name: model.name }) }}
                searchModel={searchModel} />}
            {carData?.brand_id && carData?.model_id && !carData?.generation_id && <GenerationsConfigurationsList
                generations={generations}
                onSelect={(generation, configuration) => {
                    setCarData({ ...carData, generation_id: generation.id, generation, configuration_id: configuration.id, configuration })
                }} />}

            {carData?.brand_id && carData?.model_id && carData?.generation_id && !carData?.complectation_id && <ComplectationsList
                complectations={complectations}

                onSelect={(complectation) => {
                    if (!!setEngineHash) { setEngineHash(complectation.engineHash); }
                    !!setComplectationId && setComplectationId(complectation.id)
                    setCarData({ ...carData, complectation_id: complectation.id, complectation, engine_hash: complectation.engineHash })
                }}
                {...(mode === 'add' && { engine_hash: carData.engine_hash })}
            />}
            {carData?.brand_id && carData?.model_id && carData?.generation_id && carData?.configuration_id && carData?.complectation_id && carData?.engine_hash && <ComplectationSpecOpts
                brandId={carData.brand_id}
                modelId={carData.model_id}
                generationId={carData.generation_id}
                configurationId={carData.configuration_id}
                complectationId={carData.complectation_id}
                engineHash={carData.engine_hash}
                selectedPossibleOptions={selectedPossibleOptions}
                setSelectedPossibleOptions={setSelectedPossibleOptions}
                setSelectedDefaultOptions={setSelectedDefaultOptions}
            />}
            <div className="flex flex-row gap-4">
                <UiButton
                    disabled={!carData.brand_id || !carData.model_id || !carData.generation_id || !carData.configuration_id || !carData.complectation_id}
                    onClick={handleCarPatch}>
                    Сохранить автомобиль в базе
                </UiButton>
                <UiToast ref={toast} />
                {/* {isErrorPatchCar && <Message severity="error" text={errorPatchCar?.message} />} */}
            </div>
        </div>
    </>)
}