import OptionsSelectWidget from "@/widgets/lot-create/options-select";

export default function LotCreateOptions({ params }: { params: { brandId: string, modelId: string, generationId_configurationId: string, engine_hash:string } }) {
    

    return (
        <OptionsSelectWidget brandId={params.brandId} modelId={params.modelId} generationId_configurationId={params.generationId_configurationId} engine_hash={params.engine_hash} />
    )
}