"use client";

import { ModelsWidget } from "@/widgets/catalog/models";


export default function CatalogModel({ params }: { params: { brandId: string } }) {
    return (
        <>
            <ModelsWidget markId={params.brandId}/>
        </>
    )
}