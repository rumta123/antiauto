"use client"
import { UiSpinner } from "@/shared/ui"
import { SearchWidget } from "./search-widget";
import { useRouter } from "next/navigation";
import { useBrands } from "@/entities/catalog/use-brands";
import { useModels } from "@/entities/catalog/use-models";
import { useGenerations } from "@/entities/catalog/use-generations";
import { useConfigurations } from "@/entities/catalog/use-configurations";
import { useComplectations } from "@/entities/catalog/use-complectations";
import { ComplectationsList } from "@/features/catalog/ui/complectations-list";
import { LotCreationWidget } from "@/features/catalog/ui/lot-creation-widget";
import { ModificationDto } from "@/shared/api/generated";

interface ComplectationsWidgetProps {
    brandId: string;
    modelId: string;
    generationId: string;
    configurationId: string;
}

export function ComplectationsWidget({ brandId, modelId, generationId, configurationId }: ComplectationsWidgetProps) {
    const { complectations, isLoading, isError, error } = useComplectations(brandId, modelId, generationId, configurationId);
    const { generations } = useGenerations(brandId, modelId);
    const { configurations } = useConfigurations(brandId, modelId, generationId)

    const { marks } = useBrands();
    const selectedBrand = marks?.find(brand => brand.id === brandId)
    const { models } = useModels(brandId);
    const selectedModel = models?.find(model => model.id === modelId)

    const router = useRouter();

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

    function navToSpecifications(complectation: ModificationDto) {
        router.push(`/catalog/${brandId}/${modelId}/${generationId}/${configurationId}/${complectation.id}`);
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
                complectations={complectations}
            />
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <div className='flex flex-col gap-y-2 gap-x-8 mt-4'>
                        <LotCreationWidget
                            markId={brandId}
                            modelId={modelId}
                            generationId={generationId}
                            configurationId={configurationId}
                            confPhoto={confPhoto}
                        />
                        <ComplectationsList complectations={complectations!} onSelect={navToSpecifications} />
                    </div>
            }
        </>
    )
}