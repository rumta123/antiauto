import React from 'react';
import UiCard from '@/shared/ui/UiCard';
import UiButton from '@/shared/ui/UiButton';
import { CircleInfo, Magnifier, Picture } from '@gravity-ui/icons';
import { Image } from 'primereact/image';
import { useRouter } from 'next/navigation';

interface LotCreationWidgetProps {
    markId: string;
    modelId: string;
    generationId: string;
    configurationId: string;
    confPhoto?: string | null;
    complectationId?: string;
}

export const LotCreationWidget: React.FC<LotCreationWidgetProps> = ({
    markId,
    modelId,
    generationId,
    configurationId,
    confPhoto,
    complectationId
}) => {
    const router = useRouter()
    const handleCreateLot = () => {
        router.push(`/lot-create/${markId}/${modelId}/${generationId}_${configurationId}/${complectationId || ''}`);
    };

    return (
        <div className='grid grid-cols-12 gap-2.5'>
            <UiCard className='col-span-9 border border-blue-400 bg-white shadow-md'>
                <div className='flex flex-row'>
                    <div className='pt-1'>
                        <CircleInfo className='text-blue-400' />
                    </div>
                    <div className='flex flex-col items-start ml-4'>
                        <p className='text-base font-semibold'>Вы можете создать лот на этот автомобиль</p>
                        <p className='text-sm'>Если вы хотите запустить аукцион на данный автомобиль - перейдите к выбору опций</p>
                        <UiButton className='mt-4' size='small' onClick={handleCreateLot}>Перейти к созданию лота</UiButton>
                    </div>
                </div>
            </UiCard>
            <div className='col-span-3'>
                {confPhoto?.length ?
                    <div className='flex justify-content-center max-h-32'>
                        <Image
                            src={`data:image/jpeg;base64,${confPhoto}`}
                            draggable={false}
                            alt=''
                            className=' w-full h-full flex'
                            preview
                            indicatorIcon={<><Magnifier/></>}
                        />
                    </div>
                    :
                    <div className='bg-gray-50 shadow-md rounded-lg flex h-full w-full items-center justify-center'>
                        <Picture className='place-self-center w-10 h-10 text-gray-300' />
                    </div>
                }
            </div>
        </div>
    );
};