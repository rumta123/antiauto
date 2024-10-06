import { useState } from "react";
import { useBrands } from "@/entities/catalog/use-brands";
import { BrandsList } from "@/features/catalog/ui/brands-list";
import { UiSpinner } from "@/shared/ui"
import { MarkDto } from "@/shared/api/generated";

interface BrandSelectorProps {
    onSelectBrand: (brand: MarkDto) => void; // Функция для обработки выбора бренда
    searchBrand: string;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({ onSelectBrand, searchBrand }) => {
    const { marks, isLoading, isError, error } = useBrands();

    const filteredMarks = marks?.filter(mark =>
        mark.name.toLowerCase().includes(searchBrand.toLowerCase()) ||
        mark.cyrillicName?.toLowerCase().includes(searchBrand.toLowerCase())
    ) || [];
    type GroupedMarks = Record<string, MarkDto[]>;
    const groupedMarks = filteredMarks.reduce((groups: GroupedMarks, mark) => {
        (groups[mark.groupSymbol] = groups[mark.groupSymbol] || []).push(mark);
        return groups;
    }, {});

    return (
        <div>
            {isLoading ? <UiSpinner /> : isError ? <div>Error: {error?.message}</div> :
                <BrandsList 
                    groupedMarks={groupedMarks} 
                    onSelect={onSelectBrand} 
                    
                />
            }
        </div>
    );
};
