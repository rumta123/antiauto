import { OfferDto } from "@/shared/api/generated";
import { UiSelect } from "@/shared/ui";
import { useEffect, useState } from "react";

interface FilterSortOffersProps {
    offers: OfferDto[] | [];
    setFilteredAndSortedOffers: (offers: OfferDto[]) => void;
}
export function FilterSortOffers({ offers, setFilteredAndSortedOffers}: FilterSortOffersProps) {
    const [sortOption, setSortOption] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    useEffect(() => {
        let offersCopy = [...(offers || [])];

        // Применяем фильтрацию
        if (filterOption === 'fullMatch') {
            offersCopy = offersCopy.filter(offer =>
                offer.options.filter(opt => opt.accordance_type === "unsatisfied").length === 0
            );
        }

        // Применяем сортировку
        if (sortOption === 'date') {
            offersCopy.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } else if (sortOption === 'priceAsc') {
            offersCopy.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'priceDesc') {
            offersCopy.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'fullMatch') {
            offersCopy.sort((a, b) => {
                const aFullMatch = a.options.filter(opt => opt.accordance_type === "unsatisfied").length === 0 ? 0 : 1;
                const bFullMatch = b.options.filter(opt => opt.accordance_type === "unsatisfied").length === 0 ? 0 : 1;
                return aFullMatch - bFullMatch;
            });
        }
        setFilteredAndSortedOffers(offersCopy);
    }, [offers, sortOption, filterOption]);

    return <>
        <div className="flex flex-row gap-2 items-center">

            <UiSelect
                className="p-inputtext-sm min-w-64"
                value={filterOption}
                options={[
                    { label: 'Все', value: 'all' },
                    { label: 'Только 100% совпадение', value: 'fullMatch' },
                ]}
                optionLabel="label"
                onChange={(value) => setFilterOption(value)}
                placeholder="Фильтрация"
                uiSize="small"
            />

            <UiSelect
                className="p-inputtext-sm min-w-64"
                value={sortOption}
                optionLabel="label"
                options={[
                    { label: 'По дате', value: 'date' },
                    { label: 'Цена по возрастанию', value: 'priceAsc' },
                    { label: 'Цена по убыванию', value: 'priceDesc' },
                    { label: 'Сначала с полным соответствием', value: 'fullMatch' },
                ]}
                onChange={(value) => setSortOption(value)}
                placeholder="Сортировка"
                uiSize="small"
            />
        </div>
    </>
}