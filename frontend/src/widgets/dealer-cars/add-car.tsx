"use client"
import { useEffect, useState } from "react"
import { ConfigurationDto, GenerationDto, ModificationDto, PatchDealersCarDto } from "@/shared/api/generated"
import { useDealersCarCreate } from "@/entities/dealers-cars"
import { PatchCar } from "@/features/dealer-cars/ui/patch-car"
import { useBrandModelGenConf } from "@/entities/catalog/use-brand-model-gen-conf"

interface ExtendedPatchCarData extends PatchDealersCarDto {
    brand_name?: string;
    model_name?: string;
    generation?: GenerationDto;
    configuration?: ConfigurationDto;
    complectation?: ModificationDto;
}

interface AddCarProps {
    engine_hash?: string | undefined
}

export function AddCar({ engine_hash }: AddCarProps) {
    const [carData, setCarData] = useState<ExtendedPatchCarData>({
        brand_id: "",
        city_id: '',
        city_name: '',
        complectation_id: '',
        configuration_id: '',
        engine_hash: '',
        generation_id: '',
        id: '',
        isMileageAbroad: false,
        model_id: '',
        options: [],
        photos: []
    });
    const [engineHash, setEngineHash] = useState(engine_hash);
    const [complectationId, setComplectationId] = useState('');

    const [engineHashData, setEngineHashData] = useState<any>()
    const [requestMade, setRequestMade] = useState(false);
    const { catalogData } = useBrandModelGenConf(engine_hash || '')
    // const { createCar, isPending: isCarCreatePending, isError: isCarCreateError, error: errorCarCreate, isSuccess: isCarCreateSuccess } = useDealersCarCreate(setEngineHashData)
    useEffect(() => {
        if (catalogData) {
            // setCarData({
            //     ...carData,
            //     brand_name: catalogData.brand.name,
            //     model_name: catalogData.model.name,
            //     generation: catalogData.generation,
            //     configuration: catalogData.configuration
            // });

            setEngineHashData({
                ...engineHashData,
                brand_id: catalogData.brand.id,
                model_id: catalogData.model.id,
                generation_id: catalogData.generation.id,
                configuration_id: catalogData.configuration.id,
                engine_hash: engine_hash
            })
        }
    },[catalogData,complectationId])
    useEffect(() => {
        if (!requestMade && engineHash && engineHash?.length > 0 && !!complectationId) { // Проверка, был ли уже сделан запрос
            // createCar(engineHash ? { engine_hash: engineHash, complectation_id: complectationId } : {});
            setRequestMade(true); // Установка флага в true, чтобы предотвратить будущие запросы
        }
    }, [engineHash]);

    return <>
        <PatchCar initialCarData={carData} initialEngineHashData={engineHashData} setEngineHash={setEngineHash} setComplectationId={setComplectationId} mode="add" />
    </>
}