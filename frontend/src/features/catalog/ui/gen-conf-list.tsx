import React, { useState } from 'react';
import UiCard from '@/shared/ui/UiCard';
import { Picture } from '@gravity-ui/icons';
import { ConfigurationDto, GenerationDto } from '@/shared/api/generated';
import { UiImage } from '@/shared/ui';

interface GenerationsListProps {
    onSelect: (generation: GenerationDto, configuration: ConfigurationDto) => void;
    generations?: GenerationDto[]
}

export function GenerationsConfigurationsList({ onSelect, generations }: GenerationsListProps) {

    return (
        <div className='flex flex-col gap-y-2 gap-x-8 mt-4 relative'>
            {generations && generations.map(generation => (
                <div className='flex flex-col py-2' key={generation.id}>
                    <div className='py-3'>
                        <p><span className="text-xl ">{generation.yearStart} - {generation.yearStop ? generation.yearStop : 'н.в.'} {generation.name}</span> </p>
                    </div>
                    <div className='col-span-4 grid grid-cols-4 gap-4 gap-x-8'>
                        {generation.configurations.map(configuration => (
                            <UiCard className='-mx-4' key={configuration.id} onClick={() => {
                                onSelect(generation, configuration)
                            }}>
                                <UiImage imgBase64={configuration.photo} className='w-full h-40' />
                                
                                <p className='pt-2'>{`${configuration.bodyType.slice(0, 1).toUpperCase()}${configuration.bodyType.slice(1)} ${configuration.notice}`}</p>
                            </UiCard>

                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}