"use client"

import { LotCard } from '@/features/lot-create/ui/lot-card';
import { LotProgress } from '@/features/lot-create/ui/lot-progress';

import React from 'react';
import UiButton from '@/shared/ui/UiButton';
import { useRouter } from 'next/navigation';
import ComplectationSearchWidget from '../../features/lot-create/ui/complectation-search';
import { useModelInfo, useModels } from '@/entities/catalog/use-models';
import { useLocalStorage } from 'primereact/hooks';
import { useConfigurationText } from '@/features/catalog/model/use-configuration-text';

interface ComplectationSelectProps {
    brandId: string;
    modelId: string;
    generationId: string;
    configurationId: string;
}

const ComplectationSelectWidget: React.FC<ComplectationSelectProps> = ({ brandId, modelId, generationId, configurationId }) => {
    const router = useRouter();
    const [newLotData, setNewLotData] = useLocalStorage<any>({}, 'lot-create');
    const { brand } = useModels(brandId, true);
    const { model } = useModelInfo(modelId);
    const { configurationText } = useConfigurationText(`${generationId}_${configurationId}`);
    return (
        <div className="flex flex-col gap-4 mt-2">
            <LotProgress value={50} />
            <div className='flex flex-col gap-2'>
                <p className="text-xl font-semibold">Создание лота. Выберите модификацию</p>
                <p className="">Дилер предложит вам именно такой автомобиль</p>
            </div>
            <LotCard brand={brand?.name || ''} brand_logo={brand?.logo || ''} model={model?.name || ''} generation_configuration={configurationText} />
            <div className='flex flex-row gap-4 my-2'>
                <UiButton severity='secondary' outlined onClick={() => router.push(`/lot-create/${brandId}/${modelId}`)}>Назад</UiButton>
                <ComplectationSearchWidget brandId={brandId} modelId={modelId} generationId={generationId} configurationId={configurationId}
                    onComplectationSelected={(engine_hash) => setNewLotData({ ...newLotData, engine_hash })} />
            </div>
        </div>
    )
}

export default ComplectationSelectWidget