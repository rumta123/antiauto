import { useState } from "react";
import { SearchWidget } from "./search-widget";
import { useBrands } from "@/entities/catalog/use-brands";
import { useRouter } from "next/navigation";
import { MarkDto } from "@/shared/api/generated";
import { UiSpinner } from "@/shared/ui"
import { BrandsList } from "@/features/catalog/ui/brands-list";

export function BrandsWidget() {
    const [searchTerm, setSearchTerm] = useState('');
    const { marks, isLoading, isError, error } = useBrands();
    const router = useRouter();

    const filteredMarks = marks?.filter(mark =>
        mark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mark.cyrillicName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    type GroupedMarks = Record<string, MarkDto[]>;

    // Группировка отфильтрованных marks по groupSymbol
    const groupedMarks = filteredMarks.reduce((groups: GroupedMarks, mark) => {
        (groups[mark.groupSymbol] = groups[mark.groupSymbol] || []).push(mark);
        return groups;
    }, {});

    function navToModels(mark: MarkDto) {
        router.push(`/catalog/${mark.id}`)
    }
    
    return (
        <>
            <SearchWidget onSearchBrand={setSearchTerm} />
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <BrandsList groupedMarks={groupedMarks} onSelect={navToModels} />
            }
        </>
    )
}