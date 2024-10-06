'use client';
import React from 'react';
import { useComplectations } from "@/entities/catalog/use-complectations";
import { SearchWidget } from '@/widgets/catalog/search-widget';
import { useGenerations } from '@/entities/catalog/use-generations';
import { useDetailedComplectation } from '@/entities/catalog/use-detailed-complectation';
import { useConfigurations } from '@/entities/catalog/use-configurations';
import { UiSpinner } from "@/shared/ui"
import { LotCreationWidget } from './lot-creation-widget';
import { useBrands } from '@/entities/catalog/use-brands';
import { useModels } from '@/entities/catalog/use-models';
import { CarSpecification } from './car-specification';
import { OptionsList } from './options-list';

interface ComplectationsListProps {
    markId: string;
    modelId: string;
    generationId: string;
    configurationId: string;
    complectationId: string;
}

export function DetailedComplectation({ markId, modelId, generationId, configurationId, complectationId }: ComplectationsListProps) {
    const { detailedComplectation, isLoading, isError, error } = useDetailedComplectation(markId, modelId, generationId, configurationId, complectationId);
    const { generations } = useGenerations(markId, modelId);
    const { configurations } = useConfigurations(markId, modelId, generationId);
    const complectations = useComplectations(markId, modelId, generationId, configurationId);
    const { marks } = useBrands();
    const selectedBrand = marks?.find(mark => mark.id === markId)
    const { models } = useModels(markId);
    const selectedModel = models?.find(model => model.id === modelId)
    const confPhoto = (() => {
        const generation = generations?.find(gen => gen.id === generationId);
        if (generation) {
            const configuration = generation.configurations.find(conf => conf.id === configurationId);
            if (configuration) {
                return configuration.photo;
            }
        }
        return null;
    })()

    if (isError) {
        return <div>Error: {error?.message}</div>;
    }

    return (
        <>
            <SearchWidget
                selectedBrand={selectedBrand}
                selectedModel={selectedModel}
                generations={generations}
                selectedGeneration={generationId}
                selectedConfiguration={configurationId}
                configurations={configurations}
                complectations={complectations.complectations}
                selectedComplectation={complectationId}
            />
            {(isLoading ?
                <UiSpinner />
                :
                <div className='flex flex-col gap-y-2 gap-x-8 mt-4'>
                    <LotCreationWidget
                        markId={markId}
                        modelId={modelId}
                        generationId={generationId}
                        configurationId={configurationId}
                        confPhoto={confPhoto}
                        complectationId={complectationId}
                    />
                    <CarSpecification detailedComplectation={detailedComplectation} />
                    
                    {detailedComplectation && !!Object.entries(detailedComplectation.options).length &&
                        <OptionsList optionsDict={detailedComplectation.options} />
                    }
                </div>
            )}

        </>
    );
}