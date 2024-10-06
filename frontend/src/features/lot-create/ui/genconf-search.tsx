"use client"
import { useGenerations } from "@/entities/catalog/use-generations";
import { GenerationsConfigurationsList } from "@/features/catalog/ui/gen-conf-list";
import UiButton from "@/shared/ui/UiButton";
import UiDialog from "@/shared/ui/UiDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GenConfsSearchProps {
    brandId: string;
    modelId: string;
    onGenConfSelected: (generationId_configurationId: string) => void;
}

const GenConfsSearchWidget: React.FC<GenConfsSearchProps> = ({ brandId, modelId,onGenConfSelected }) => {
    const [dialogVisible, setDialogVisible] = useState(Boolean);
    const { generations, isLoading, isError, error } = useGenerations(brandId, modelId);

    const router = useRouter();
    
    return (
        <>
            <UiButton className="" onClick={() => setDialogVisible(true)}>Выбрать поколение и тип кузова</UiButton>
            <UiDialog header="Выберите поколение и тип кузова" style={{ width: '60vw' }} visible={dialogVisible} onHide={() => setDialogVisible(false)}>

                <GenerationsConfigurationsList
                    generations={generations!}
                    onSelect={(generation, configuration) => {
                        onGenConfSelected(`${generation.id}_${configuration.id}`)
                        router.push(`/lot-create/${brandId}/${modelId}/${generation.id}_${configuration.id}`)
                    }}
                />
            </UiDialog>
        </>
    )
}

export default GenConfsSearchWidget