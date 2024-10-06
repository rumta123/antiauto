import { useBrands } from '@/entities/catalog/use-brands';
import { MarkDto } from '@/shared/api/generated';
import UiAutoComplete from '@/shared/ui/UiAutocomplete';
import UiButton from '@/shared/ui/UiButton';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function SelectBrand() {
    const { marks, isLoading, isError, error } = useBrands();
    const [selectedMark, setSelectedMark] = useState<MarkDto>();
    const [items, setItems] = useState<MarkDto[]>([]);
    const router = useRouter();

    const itemTemplate = (mark: MarkDto) => {
        return (
            <div>{mark.name}</div>
        );
    }

    function navToModels(markId: string) {
        router.push(`/lot-create/${markId}`)
    }

    return (
        <>
            <div className='w-full flex gap-4 items-center'>
                <div className='flex flex-col gap-2 grow'>
                    <UiAutoComplete
                        label='Марка'
                        placeholder="Введите или выберите"
                        value={selectedMark}
                        suggestions={items}
                        itemTemplate={itemTemplate}
                        completeMethod={(event: any) => {
                            const filteredItems = marks?.filter(item =>
                                item.name.toLowerCase().includes(event.query.toLowerCase()) ||
                                item.cyrillicName?.toLowerCase().includes(event.query.toLowerCase())
                            ) || [];

                            setItems(filteredItems);
                        }}
                        field="name"
                        onChange={(e: { value: MarkDto }) => {
                            setSelectedMark(e.value);
                        }}
                    />
                </div>
                <UiButton
                    className=''
                    onClick={() => selectedMark && navToModels(selectedMark.id)}>
                    Продолжить
                </UiButton>
            </div>
        </>
    );
}
