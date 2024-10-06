"use client";
import { GenerationsConfigurationsList } from "@/features/catalog/ui/gen-conf-list";
import { GenConfsWidget } from "@/widgets/catalog/genconf";


export default function CatalogConfiguration({ params }: { params: { brandId: string, modelId: string, generationId: string } }) {
    return (
        <>
            <GenConfsWidget brandId={params.brandId} modelId={params.modelId} generationId={params.generationId} />
        </>
    )
}