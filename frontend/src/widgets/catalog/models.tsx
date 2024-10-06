import { UiSpinner } from "@/shared/ui"
import { SearchWidget } from "./search-widget";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBrands } from "@/entities/catalog/use-brands";
import { useModels } from "@/entities/catalog/use-models";
import { ModelsList } from "@/features/catalog/ui/models-list";
import { ModelDto } from "@/shared/api/generated";

interface ModelsWidgetProps {
    markId: string;
}

export function ModelsWidget({ markId }: ModelsWidgetProps) {
    const { models, isLoading, isError, error } = useModels(markId);
    const { marks } = useBrands();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const selectedBrand = marks?.find(mark=> mark.id === markId)

    const filteredModels = models?.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.cyrillicName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    function navToModelDetails(model: ModelDto) {
        router.push(`/catalog/${markId}/${model.id}`);
    }

    return (
        <>
            <SearchWidget  onSearchModel={setSearchTerm} selectedBrand={selectedBrand} />
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <ModelsList models={filteredModels} onSelect={navToModelDetails} />
            }
        </>
    )
}