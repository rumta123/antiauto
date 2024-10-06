// LotPlacementWidget.jsx

import React, { useState, useEffect } from 'react';
import UiButton from "@/shared/ui/UiButton";
import { useLotCreate } from "@/entities/lots/use-lot-create";
import { LotIdDto } from '@/shared/api/generated';
import { useRouter } from 'next/navigation';

interface LotSendProps {
    newLotData: any,
    clearNewLotData: () => void;
    handleBack: () => void;
}

interface LotOptionType {
    id: string;
    option_id: string;
    value: string;
    value_type: string;
    option_name: string;
    strict?: boolean;
}

const LotSendForm = ({ newLotData, clearNewLotData, handleBack }: LotSendProps) => {
    const [createdLot, setCreatedLot] = useState<LotIdDto>();
    const { createLot, isPending: isLotCreatePending, isError: isLotCreateError, error: lotCreateError, isSuccess: isLotCreateSuccess } = useLotCreate(setCreatedLot)
    const router = useRouter();

    const handleLotCreate = async () => {
        if (!newLotData || !newLotData.generationId_configurationId) return;
        const [letGenId, lotConfId] = newLotData?.generationId_configurationId?.split("_");
        const requiredOptionsWithKeys = newLotData.requiredOptions ? Object.entries(newLotData.requiredOptions as Record<string, LotOptionType>).map(([key, option]): LotOptionType => ({
            ...option,
            strict: true,
            option_name: key // Использование ключа как optionName
        })) : [];
        const electiveOptionsWithKeys = newLotData.electiveOptions ? Object.entries(newLotData.electiveOptions as Record<string, LotOptionType>).map(([key, option]): LotOptionType => ({
            ...option,
            option_name: key // Использование ключа как optionName
        })) : [];
        const combinedOptions: LotOptionType[] = [
            ...requiredOptionsWithKeys,
            ...electiveOptionsWithKeys
        ];

        await createLot({
            city_id: String(newLotData.city.id),
            max_distance: newLotData.distance,
            mark_id: newLotData.brandId,
            model_id: newLotData.modelId,
            generation_id: letGenId,
            configuration_id: lotConfId,
            engine_hash: newLotData.engine_hash,
            options: combinedOptions.map(option => ({
                id: option.id,
                optionId: option.option_id,
                value: option.value,
                valueType: option.value_type,
                strict: option.strict || false,
                optionName: option.option_name
            })),
        })
        clearNewLotData(); // Очистка данных лота после успешного создания
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            {!isLotCreateSuccess ?
                <>
                    <div className='flex flex-row gap-4 my-2'>
                        <UiButton severity='secondary' outlined onClick={handleBack}>
                            Назад
                        </UiButton>
                        <UiButton onClick={handleLotCreate} disabled={isLotCreatePending}>
                            Разместить лот
                        </UiButton>
                    </div>
                    {isLotCreatePending && <p>Создание лота...</p>}
                    {isLotCreateError && <p className="text-red-500">Ошибка создания лота: {lotCreateError?.message}</p>}
                </>
                :
                <>
                    <div className='flex flex-col gap-2'>
                        <p className="text-xl font-semibold">Готово!</p>
                        <p>Смс-подтверждение придет на ваш номер телефона.<br />Оповещения о предложениях дилеров можете настроить в профиле</p>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <UiButton onClick={() => {
                            router.push(`/auctions/${createdLot?.lot_uuid}`)
                        }}>
                            Посмотреть мой аукцион
                        </UiButton>
                    </div>
                </>
            }
        </div>
    );
};

export default LotSendForm;
