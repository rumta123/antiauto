import GenConfSelectWidget from "@/widgets/lot-create/genconf-select";



export default function LotCreateGenConf({ params }: { params: { brandId: string, modelId: string } }) {
    
    return (
        <GenConfSelectWidget brandId={params.brandId} modelId={params.modelId} />
    )
}