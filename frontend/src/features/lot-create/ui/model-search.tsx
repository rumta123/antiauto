"use client"
import { useModels } from "@/entities/catalog/use-models";
import { ModelsList } from "@/features/catalog/ui/models-list";
import UiButton from "@/shared/ui/UiButton";
import UiDialog from "@/shared/ui/UiDialog";
import UiInput from "@/shared/ui/UiInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModelSearchProps {
    brandId: string;
    onModelSelected: (modelId: string) => void;
}

const ModelSearchWidget: React.FC<ModelSearchProps> = ({ brandId, onModelSelected }) => {
    const [modelsDialogVisible, setModelsDialogVisible] = useState(Boolean);
    const { models, isLoading, isError, error } = useModels(brandId);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredModels = models?.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.cyrillicName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    const SearchInput = () => (
        <UiInput
            placeholder="Введите или выберите"
            label="Модель"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setSearchTerm(e.currentTarget.value);
            }}
        />
    )
    return (
        <>
            <UiButton className="" onClick={() => setModelsDialogVisible(true)}>Выбрать модель</UiButton>
            <UiDialog header={SearchInput} style={{ width: '60vw' }} visible={modelsDialogVisible} onHide={() => setModelsDialogVisible(false)}>
                <ModelsList models={filteredModels}
                    onSelect={(model) => {
                        onModelSelected(model.id)
                        router.push(`/lot-create/${brandId}/${model.id}`)
                    }}
                />
            </UiDialog>
        </>
    )
}

export default ModelSearchWidget