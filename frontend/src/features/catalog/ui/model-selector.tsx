import { UiSpinner } from "@/shared/ui"
import { useModels } from "@/entities/catalog/use-models";
import { ModelsList } from "@/features/catalog/ui/models-list";
import { ModelDto } from "@/shared/api/generated";

interface ModelSelectorProps {
    brandId: string;
    onSelectModel: (model: ModelDto) => void; 
    searchModel: string;
}

export function ModelSelector({ brandId, onSelectModel, searchModel }: ModelSelectorProps) {
    const { models, isLoading, isError, error } = useModels(brandId);

    const filteredModels = models?.filter(model =>
        model.name.toLowerCase().includes(searchModel.toLowerCase()) ||
        model.cyrillicName?.toLowerCase().includes(searchModel.toLowerCase())
    ) || [];

    return (
        <>

            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <ModelsList models={filteredModels} onSelect={onSelectModel} />
            }
        </>
    )
}