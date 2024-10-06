import FinishWidget from "@/widgets/lot-create/finish";

export default function LotCreateFinish({ params }: { params: { brandId: string, modelId: string, generationId_configurationId: string, engine_hash:string } }) {
    return (
        <FinishWidget brandId={params.brandId} modelId={params.modelId} generationId_configurationId={params.generationId_configurationId} engine_hash={params.engine_hash} />
    )
}