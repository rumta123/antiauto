"use client"
import { useDealersCars } from "@/entities/dealers-cars/use-dealers-cars";
import { CarsList } from "@/features/dealer-cars/ui/cars-list";
import { CarsTable } from "@/features/dealer-cars/ui/cars-table";
import { DealersCarDto } from "@/shared/api/generated";
import { useNoun } from "@/shared/hooks/use-noun";
import UiButton from "@/shared/ui/UiButton";
import UiInput from "@/shared/ui/UiInput";
import UiSelect from "@/shared/ui/UiSelect";
import { UiSpinner } from "@/shared/ui"
import { Magnifier, ListUl, Dots9 } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CarsListWidget() {
    const router = useRouter()
    const [listView, setListView] = useState('list')
    const [searchQuery, setSearchQuery] = useState('');
    const sortOptions = [
        { label: 'Номер по убыванию', value: 'sequence_desc' },
        { label: 'Номер по возрастанию', value: 'sequence_asc' },
        { label: 'Год по убыванию', value: 'year_desc' },
        { label: 'Год по возрастанию', value: 'year_asc' },
        { label: 'Пробег по убыванию', value: 'mileage_desc' },
        { label: 'Пробег по возрастанию', value: 'mileage_asc' },

    ];
    // const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
    const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0].value);

// console.log(selectedSortOption)
    const { cars, isLoading, isError, error } = useDealersCars()
    const [filteredAndSortedCars, setFilteredAndSortedCars] = useState<DealersCarDto[]>([]);

    const filterCars = (cars: DealersCarDto[], query: string) => {
        return cars?.filter(car =>
            car.brand?.toLowerCase().includes(query.toLowerCase()) ||
            car.model?.toLowerCase().includes(query.toLowerCase()) ||
            car.vin?.toLowerCase().includes(query.toLowerCase()) ||
            car.year?.toString().includes(query)
        );
    };
    const sortCars = (cars: DealersCarDto[], option: string) => {
        return [...cars].sort((a, b) => {
            switch (option) {
                case 'sequence_desc':
                    return b.sequence - a.sequence; 
                case 'year_asc':
                    return a.year - b.year;
                case 'year_desc':
                    return b.year - a.year;
                case 'mileage_asc':
                    return a.mileage - b.mileage;
                case 'mileage_desc':
                    return b.mileage - a.mileage;
                case 'sequence_asc':
                    return a.sequence - b.sequence;
                default:
                    return 0;
            }
        });
    };

    useEffect(() => {
        let result = cars || [];
        if (searchQuery) {
            result = filterCars(result, searchQuery);
        }
        if (selectedSortOption) {
            result = sortCars(result, selectedSortOption);
        }
        setFilteredAndSortedCars(result);
    }, [cars, searchQuery, selectedSortOption]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-4xl text-brand-900 font-black">База моих автомобилей</p>
                    <p className="text-slate-400 text-sm">{`${cars?.length || 0} ${useNoun(cars?.length || 0, 'автомобиль', 'автомобиля', 'автомобилей')}, ${cars?.filter(car => car.lots?.length).length || 0} ${useNoun(cars?.filter(car => car.lots?.length).length || 0, 'выставлен', 'выставлено', 'выставлено')}`}</p>
                </div>
                <div><UiButton onClick={() => router.push(`/cars/add/`)} size="small">Добавить автомобиль</UiButton></div>
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                    {/* <UiButton outlined size="small">Все</UiButton> */}

                    <UiInput className="p-inputtext-sm min-w-72" placeholder="Поиск (можно по VIN)" iconBefore={<Magnifier />} uiSize="small" onChange={(e) => setSearchQuery(e.currentTarget.value)} />

                    <UiSelect className="p-inputtext-sm" options={sortOptions} placeholder="Сортировка" uiSize="small" value={selectedSortOption} onChange={(value) => setSelectedSortOption(value)} />

                </div>

                <div className="flex flex-row gap-2 items-center">
                    <UiButton text severity="secondary" className={`!w-12 !h-12 ${listView === 'list' ? 'text-slate-900' : '!text-slate-300'}`} onClick={() => setListView('list')} tooltip='Карточки' tooltipOptions={{ position: 'top', showDelay: 300 }}><Dots9 /></UiButton>
                    <UiButton text severity="secondary" className={`!w-12 !h-12 ${listView === 'table' ? 'text-slate-900' : '!text-slate-300'}`} onClick={() => setListView('table')} tooltip='Список' tooltipOptions={{ position: 'top', showDelay: 300 }}><ListUl /></UiButton>
                </div>
            </div>
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <>
                        {listView === 'list' && <CarsList carItems={filteredAndSortedCars} />}
                        {listView === 'table' && <CarsTable carItems={filteredAndSortedCars} />}
                    </>
            }
        </div>
    )
}