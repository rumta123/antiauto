import ComplectationSelectWidget from "@/widgets/lot-create/complectation-select";

export default function LotCreateComplectation({ params }: { params: { brandId: string, modelId: string, generationId_configurationId: string } }) {
    
    const [generationId, configurationId] = params.generationId_configurationId.split("_")
    return (
        <ComplectationSelectWidget brandId={params.brandId} modelId={params.modelId} generationId={generationId} configurationId={configurationId} />
    )
}