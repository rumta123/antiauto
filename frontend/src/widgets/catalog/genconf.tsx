"use client";
import { UiSpinner } from "@/shared/ui";
import { SearchWidget } from "./search-widget";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBrands } from "@/entities/catalog/use-brands";
import { useModels } from "@/entities/catalog/use-models";
import { useGenerations } from "@/entities/catalog/use-generations";
import { useConfigurations } from "@/entities/catalog/use-configurations";
import { GenerationsConfigurationsList } from "@/features/catalog/ui/gen-conf-list";
import { ConfigurationDto, GenerationDto } from "@/shared/api/generated";

interface GenConfsWidgetProps {
    brandId: string;
    modelId: string;
    generationId?: string;
}

export function GenConfsWidget({ brandId, modelId, generationId }: GenConfsWidgetProps) {
    const { generations, isLoading: isLoadingGenerations, isError: isErrorGenerations, error: generationsError } = useGenerations(brandId, modelId);
    const { configurations, isLoading: isLoadingConfigurations, isError: isErrorConfigurations, error: errorConfigurations } = useConfigurations(brandId, modelId, generationId || '');

    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { marks } = useBrands();
    const selectedBrand = marks?.find(mark => mark.id === brandId);
    const { models } = useModels(brandId);
    const selectedModel = models?.find(model => model.id === modelId);

    function navToModifications(generation: GenerationDto, configuration: ConfigurationDto) {
        router.push(`/catalog/${brandId}/${modelId}/${generation.id}/${configuration.id}`);
    }

    return (
        <>
            <SearchWidget
                onSearchGeneration={setSearchTerm}
                selectedBrand={selectedBrand}
                selectedModel={selectedModel}
                generations={generations}
                configurations={configurations} />
            {isLoadingGenerations || isLoadingConfigurations ?
                <UiSpinner />
                :
                isErrorGenerations || isErrorConfigurations ?
                    <div>Error: {generationsError?.message || errorConfigurations?.message}</div>
                    :
                    <GenerationsConfigurationsList generations={generations!} onSelect={navToModifications} />
            }
        </>
    );
}
