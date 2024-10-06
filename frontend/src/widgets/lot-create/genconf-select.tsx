"use client"
import { LotCard } from '@/features/lot-create/ui/lot-card';
import { LotProgress } from '@/features/lot-create/ui/lot-progress';
import React from 'react';
import GenConfsSearchWidget from '../../features/lot-create/ui/genconf-search';
import UiButton from '@/shared/ui/UiButton';
import { useRouter } from 'next/navigation';
import { useModelInfo, useModels } from '@/entities/catalog/use-models';
import { useLocalStorage } from 'primereact/hooks';

interface GenConfSelectProps {
    brandId: string;
    modelId: string;
}

const GenConfSelectWidget: React.FC<GenConfSelectProps> = ({ brandId, modelId }) => {
    const router = useRouter()
    const { brand } = useModels(brandId, true);
    const { model } = useModelInfo(modelId);
    const [newLotData, setNewLotData] = useLocalStorage<any>({}, 'lot-create');
    return (
        <div className="flex flex-col gap-4 mt-2">
            <LotProgress value={30} />
            <div className='flex flex-col gap-2'>
                <p className="text-xl font-semibold">Создание лота. Выберите поколение и тип кузова</p>
                <p className="">Дилер предложит вам именно такой автомобиль</p>
            </div>

            <LotCard brand={brand?.name || ''} brand_logo={brand?.logo || ''} model={model?.name || ''} />
            <div className='flex flex-row gap-4 my-2'>
                <UiButton severity='secondary' outlined onClick={() => router.push(`/lot-create/${brandId}`)}>Назад</UiButton>
                <GenConfsSearchWidget brandId={brandId} modelId={modelId} onGenConfSelected={(generationId_configurationId) => setNewLotData({...newLotData, generationId_configurationId})} />
            </div>
        </div>
    )
}

export default GenConfSelectWidget