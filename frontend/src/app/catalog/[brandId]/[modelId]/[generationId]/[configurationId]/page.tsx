// "use client";
import { ComplectationsList } from "@/features/catalog/ui/complectations-list";
import { ComplectationsWidget } from "@/widgets/catalog/complectations";

export default function CatalogComplectation({ params }: { params: { brandId: string, modelId: string, generationId: string, configurationId: string } }) {
    console.log(params)
    return (
        <>
            {/* <ComplectationsList brandId={params.brandId} modelId={params.modelId} generationId={params.generationId} configurationId={params.configurationId} /> */}
            <ComplectationsWidget brandId={params.brandId} modelId={params.modelId} generationId={params.generationId} configurationId={params.configurationId} />
        </>
    )
}