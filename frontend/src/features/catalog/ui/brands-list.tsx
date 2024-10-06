import React, { useState } from 'react';
import UiCard from '@/shared/ui/UiCard';
import { MarkDto } from '@/shared/api/generated';
import { Picture } from '@gravity-ui/icons';
import Image from 'next/image';
import { UiImage } from '@/shared/ui';

interface BrandsListProps {
    groupedMarks: Record<string, MarkDto[]>
    onSelect: (brand: MarkDto) => void;
}

export function BrandsList({ groupedMarks, onSelect }: BrandsListProps) {

    const [blocked, setBlocked] = useState(false);
    const sortedGroupKeys = Object.keys(groupedMarks).sort();

    return (<>
        <div className='mt-8'>
            {sortedGroupKeys.map(groupSymbol => (
                <div key={groupSymbol}>
                    <h2 className="text-2xl font-bold text-brand-900 m-4">{groupSymbol}</h2>
                    <div className='grid grid-cols-4 gap-y-1 gap-x-8 mb-10'>
                        {groupedMarks[groupSymbol].map(mark => (
                            <UiCard
                                className='px-4 py-2 flex flex-row'
                                key={mark.id}
                                onClick={() => {
                                    setBlocked(true);
                                    onSelect(mark);
                                }}>
                                <div className='pr-4'>
                                    <UiImage className="!w-[2rem] !h-[2rem]" imgBase64={mark.logo} />
                                </div>
                                <h2 className={`text-xl ${mark.popular && 'font-semibold'}`}>{mark.name}</h2>
                            </UiCard>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </>);
}
