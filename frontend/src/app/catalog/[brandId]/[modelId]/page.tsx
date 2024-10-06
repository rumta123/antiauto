"use client";

import { GenConfsWidget } from "@/widgets/catalog/genconf";


export default function CatalogGeneration({ params }: { params: { brandId: string, modelId:string } }) {
    return (
        <>
            <GenConfsWidget brandId={params.brandId} modelId={params.modelId} />
        </>
    )
}