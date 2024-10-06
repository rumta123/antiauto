'use client'
import React, { useState } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ModificationDto } from '@/shared/api/generated';
import { FilterMatchMode } from 'primereact/api';
import { UiButton } from '@/shared/ui';


interface ComplectationsListProps {
    complectations?: ModificationDto[];
    onSelect: (complectation: ModificationDto) => void;
    hideGroupName?: boolean;
    engine_hash?: string
}

export function ComplectationsList({ complectations, onSelect, hideGroupName, engine_hash }: ComplectationsListProps) {
    const formatComplectations = complectations?.map(complectation => {
        return {
            ...complectation,
            drive: complectation.drive || '–',
            consumptionMixed: complectation.consumptionMixed || '–',
            timeTo100: complectation.timeTo100 || '–',
            engineCombined: [
                complectation.volumeLitres?.toFixed(1),
                complectation.horsePower ? `${complectation.horsePower} л.с.` : '',
                complectation.engineType
            ].join(" ")
        };
    })
    const [blocked, setBlocked] = useState(false);
    const pt = {
        table: {
            className: 'my-2'
        },
        headerCell: {
            className: 'bg-transparent  border-b border-gray-200'
        },
        headerTitle: {
            className: 'text-brand-900 font-sans ',
        },
        bodyCell: {
            className: 'text-gray-900'
        },
        bodyRow: {
            className: 'bg-transparent hover:bg-white/70 hover:shadow-md border-b border-gray-200'
        }
    }
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        engineHash: { value: engine_hash, matchMode: FilterMatchMode.EQUALS }
    })
    const [filtered, setFiltered] = useState<Boolean>(engine_hash?.length ? true : false)


    return (
        <>
            <div className='w-full mt-8 relative overflow-x-auto rounded-lg'>
                {/* <UiBlockUI blocked={blocked}> */}
                <DataTable
                    className='font-sans my-2'
                    value={formatComplectations}
                    selectionMode="single"
                    pt={pt}
                    filters={filters}
                    dataKey="id"
                    onRowSelect={(event) => {
                        setBlocked(true)
                        onSelect(event.data)
                    }}
                    metaKeySelection={false}
                >
                    {!hideGroupName && <Column field="groupName" header="Название" pt={pt}></Column>}
                    <Column field="engineCombined" header="Двигатель" pt={pt}></Column>
                    <Column field="transmission" header="Коробка" pt={pt}></Column>
                    <Column field="drive" header="Привод" pt={pt}></Column>
                    <Column field="consumptionMixed" header="Расход, л" pt={pt}></Column>
                    <Column field="timeTo100" header="Разгон до 100, с" pt={pt}></Column>
                </DataTable>
                {engine_hash && filtered && <>
                    <div className='flex flex-row gap-4 items-center'>
                        <p className='italic text-slate-400'>Показаны только подходящие к аукциону</p>
                        <UiButton size='small' severity='secondary' onClick={() => {
                            setFiltered(false);
                            setFilters({
                                engineHash: { value: undefined, matchMode: FilterMatchMode.EQUALS }
                            })
                        }}>Показать все</UiButton>
                    </div>
                </>}
                {/* </UiBlockUI> */}
            </div>
        </>
    );
}