"use client"
import { LotCard } from '@/features/lot-create/ui/lot-card';
import { LotProgress } from '@/features/lot-create/ui/lot-progress';
import React, { useEffect, useState } from 'react';
import UiButton from '@/shared/ui/UiButton';
import { useRouter } from 'next/navigation';
import { useModelInfo, useModels } from '@/entities/catalog/use-models';
import OptionsSearchWidget from '../../features/lot-create/ui/options-search';
import { useOptionsByEngineHash } from '@/entities/catalog/use-options';
import { useLocalStorage } from 'primereact/hooks';
import UiTooltipIcon from '@/shared/ui/UiTooltip';
import { useComplectationText } from '@/features/catalog/model/use-complectation-text';
import { useConfigurationText } from '@/features/catalog/model/use-configuration-text';
import { useComplectationNamesWithOptionsByEngineHash } from '@/entities/catalog/use-complectations';

interface OptionsSelectProps {
    brandId: string;
    modelId: string;
    generationId_configurationId: string;
    engine_hash: string;
}

const OptionsSelectWidget: React.FC<OptionsSelectProps> = ({ brandId, modelId, generationId_configurationId, engine_hash }) => {
    const router = useRouter();
    const [newLotData, setNewLotData] = useLocalStorage<any>({}, 'lot-create');
    const { brand } = useModels(brandId, true);
    const { model } = useModelInfo(modelId);
    const { configurationText } = useConfigurationText(generationId_configurationId);
    const { complectationText } = useComplectationText(engine_hash);
    const { options } = useOptionsByEngineHash(engine_hash, { part: 'paid' })
    const { options: defaultOptions } = useOptionsByEngineHash(engine_hash, { part: 'default' })
    const { complectationsWithOptions } = useComplectationNamesWithOptionsByEngineHash(engine_hash)

    const { requiredOptions: initialRequiredOptions, electiveOptions: initialElectiveOptions } = newLotData;
    const [requiredOptions, setRequiredOptions] = useState(newLotData.requiredOptions || {});
    const [electiveOptions, setElectiveOptions] = useState(newLotData.electiveOptions || {});

    useEffect(() => {
        setRequiredOptions(initialRequiredOptions);
        setElectiveOptions(initialElectiveOptions);
    }, [initialRequiredOptions, initialElectiveOptions]);

    const handleRequiredOptionsSelected = (selectedOptions: any) => {
        setRequiredOptions(selectedOptions);
        setNewLotData({ ...newLotData, requiredOptions: selectedOptions })
    };
    const handleElectiveOptionsSelected = (selectedOptions: any) => {
        setElectiveOptions(selectedOptions);
        setNewLotData({ ...newLotData, electiveOptions: selectedOptions })
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <LotProgress value={70} />
            <div className='flex flex-col gap-2'>
                <p className="text-xl font-semibold">Создание лота. Выберите опции</p>
                <p className="">Дилер предложит вам именно такой автомобиль</p>
            </div>
            <LotCard brand={brand?.name || ''} brand_logo={brand?.logo || ''} model={model?.name || ''} generation_configuration={configurationText} complectation={complectationText} />

            {defaultOptions && !!Object.entries(defaultOptions).length &&
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                        <p className="text-lg font-semibold">У выбранного автомобиля есть</p>
                        <UiTooltipIcon text={`Перечисленные опции установлены \nво все автомобили выбранной конфигурации`} />
                    </div>
                    <div className='mt-2 grid grid-cols-3 grid-flow-row-dense gap-4'>
                        {Object.entries(defaultOptions).map(([groupName, optionItems]) => (
                            <div key={groupName}>
                                <h3 className='text-md font-semibold mb-2'>{groupName}</h3>
                                {Object.entries(optionItems).map(([optionKey, value], index) => (
                                    <div key={index} className='text-xs py-0.5'>
                                        <p>{optionKey}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
            {options && !!Object.entries(options).length && <>
                <OptionsSearchWidget options={options ? options : {}} initialSelectedOptions={initialRequiredOptions} blockedOptions={electiveOptions} onOptionsSelected={handleRequiredOptionsSelected} required complectations={complectationsWithOptions} />
                <OptionsSearchWidget options={options ? options : {}} initialSelectedOptions={initialElectiveOptions} blockedOptions={requiredOptions} onOptionsSelected={handleElectiveOptionsSelected} />
            </>}
            {defaultOptions && !Object.entries(defaultOptions).length && options && !Object.entries(options).length && <>
                <p className="text-lg font-semibold">Для данного автомобиля выбор опций не предусмотрен производителем.</p>
                <p className="text-sm ">{`Нажмите \"Продолжить\" для указания места приобретения автомобиля.`}</p>
            </>}
            <div className='flex flex-row gap-4 my-2'>
                <UiButton severity='secondary' outlined onClick={() => router.push(`/lot-create/${brandId}/${modelId}/${generationId_configurationId}`)}>
                    Назад
                </UiButton>
                <UiButton onClick={() => {
                    setNewLotData({ ...newLotData, requiredOptions, electiveOptions })
                    router.push(`/lot-create/${brandId}/${modelId}/${generationId_configurationId}/${engine_hash}/city`)
                }}>
                    Продолжить
                </UiButton>
            </div>
        </div>
    )
}

export default OptionsSelectWidget