//"use client"

import ModelSelectWidget from "@/widgets/lot-create/model-select"


export default function LotCreateModel({ params }: { params: { brandId: string } }) {
    
    return (
        <ModelSelectWidget brandId={params.brandId} />
    )
}