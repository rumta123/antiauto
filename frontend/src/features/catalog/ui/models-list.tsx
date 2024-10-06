import React, { useState } from 'react';
import UiCard from '@/shared/ui/UiCard';
import UiBlockUI from '@/shared/ui/UiBlockUi';
import { ModelDto } from '@/shared/api/generated';

interface ModelsListProps {
    onSelect: (model: ModelDto) => void;
    models: ModelDto[];
}

export function ModelsList({  onSelect, models }: ModelsListProps) {
    const [blocked, setBlocked] = useState(false);

    return (
        <>
            {/* <UiBlockUI blocked={blocked} > */}
            <div className='grid grid-cols-4 gap-y-2 gap-x-8 mt-8'>
                {models?.map(model => (
                    <UiCard
                        className=''
                        key={model.id}
                        onClick={() => {
                            setBlocked(true)
                            onSelect(model)
                        }}>
                        <h2 className="text-xl">{model.name}</h2>
                    </UiCard>
                ))}
            </div>
            {/* </UiBlockUI> */}
        </>
    );
}