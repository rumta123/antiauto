"use client"
import { useComplectations } from "@/entities/catalog/use-complectations";
import { ComplectationsList } from "@/features/catalog/ui/complectations-list";
import UiButton from "@/shared/ui/UiButton";
import UiDialog from "@/shared/ui/UiDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ComplectationSearchProps {
    brandId: string;
    modelId: string;
    generationId: string;
    configurationId: string;
    onComplectationSelected: (complectationId: string) => void;
}

const ComplectationSearchWidget: React.FC<ComplectationSearchProps> = ({ brandId, modelId, generationId, configurationId, onComplectationSelected }) => {
    const [dialogVisible, setDialogVisible] = useState(Boolean);
    const { complectations, isLoading, isError, error } = useComplectations(brandId, modelId, generationId, configurationId,{groupByEngine:true});

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <UiButton className="" onClick={() => setDialogVisible(true)}>Выбрать модификацию</UiButton>
            <UiDialog header="Выберите модификацию" style={{ width: '60vw' }} visible={dialogVisible} onHide={() => setDialogVisible(false)}>

                <ComplectationsList complectations={complectations!} hideGroupName={true} onSelect={(complectation) => {
                    onComplectationSelected(complectation.engineHash)
                    router.push(`/lot-create/${brandId}/${modelId}/${generationId}_${configurationId}/${complectation.engineHash}`)
                }}/>
            </UiDialog>
        </>
    )
}

export default ComplectationSearchWidget