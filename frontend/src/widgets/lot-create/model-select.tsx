"use client"
import { LotCard } from '@/features/lot-create/ui/lot-card';
import { LotProgress } from '@/features/lot-create/ui/lot-progress';
import React, { useEffect, useState } from 'react';
import ModelSearchWidget from '../../features/lot-create/ui/model-search';
import { useModels } from '@/entities/catalog/use-models';
import { useLocalStorage } from 'primereact/hooks';

interface ModelSelectProps {
    brandId: string;
}

const ModelSelectWidget: React.FC<ModelSelectProps> = ({ brandId }) => {
    const { brand } = useModels(brandId, true);
    const [newLotData, setNewLotData] = useLocalStorage<any>({ brandId: brandId }, 'lot-create');

    useEffect(() => (
        setNewLotData({brandId})
    ),[brandId])
    return (
        <div className="flex flex-col gap-4 mt-2">
            <LotProgress value={20} />
            <div className='flex flex-col gap-2'>
                <p className="text-xl font-semibold">Создание лота. Выберите модель</p>
                <p className="">Дилер предложит вам именно такой автомобиль</p>
            </div>
            <LotCard brand={brand?.name || ''} brand_logo={brand?.logo || ''} />
            <div className='my-2'>
                <ModelSearchWidget brandId={brandId} onModelSelected={(modelId) => {
                    setNewLotData({ brandId, modelId })
                }} />
            </div>
        </div>
    )
}

export default ModelSelectWidget