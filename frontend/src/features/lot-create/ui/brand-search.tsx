"use client"
import { useBrands } from '@/entities/catalog/use-brands';
import { BrandsList } from '@/features/catalog/ui/brands-list';
import { MarkDto } from '@/shared/api/generated';
import UiDialog from '@/shared/ui/UiDialog';
import UiInput from '@/shared/ui/UiInput';
import { UILink } from '@/shared/ui/UiLink';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

interface BrandSearchProps {

}

const BrandSearchWidget: React.FC<BrandSearchProps> = ({ }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [brandsDialogVisible, setBrandsDialogVisible] = useState(Boolean);
    const { marks, isLoading, isError, error } = useBrands();
    const router = useRouter();

    const filteredMarks = marks?.filter(mark =>
        mark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mark.cyrillicName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    type GroupedMarks = Record<string, MarkDto[]>;

    const groupedMarks = filteredMarks.reduce((groups: GroupedMarks, mark) => {
        (groups[mark.groupSymbol] = groups[mark.groupSymbol] || []).push(mark);
        return groups;
    }, {});

    const Input = () => (
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
            <UILink className='my-2 col-span-3' onClick={() => setBrandsDialogVisible(true)}>Все марки</UILink>
            <UiDialog header={Input} style={{ width: '60vw' }} visible={brandsDialogVisible} onHide={() => setBrandsDialogVisible(false)}>
                <BrandsList
                    groupedMarks={groupedMarks}
                    onSelect={(brand) => router.push(`/lot-create/${brand?.id}`)}
                />
            </UiDialog>
        </>
    )
}

export default BrandSearchWidget