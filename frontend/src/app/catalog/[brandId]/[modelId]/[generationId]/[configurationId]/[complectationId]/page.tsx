"use client";
import { DetailedComplectation } from "@/features/catalog/ui/detailed-complectation";

export default function CatalogDetailedComplectation({ params }: { params: { brandId: string, modelId: string, generationId: string, configurationId: string, complectationId: string } }) {
    return (
        <>
            <DetailedComplectation
                markId={params.brandId}
                modelId={params.modelId}
                generationId={params.generationId}
                configurationId={params.configurationId}
                complectationId={params.complectationId}
            />
        </>
    )
}