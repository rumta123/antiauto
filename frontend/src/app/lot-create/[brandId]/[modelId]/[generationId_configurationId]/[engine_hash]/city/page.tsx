import CitySelectWidget from "@/widgets/lot-create/city-select";


export default function LotCreateCity({ params }: { params: { brandId: string, modelId: string, generationId_configurationId: string, engine_hash:string } }) {
    return (
        <CitySelectWidget brandId={params.brandId} modelId={params.modelId} generationId_configurationId={params.generationId_configurationId} engine_hash={params.engine_hash} />
    )
}