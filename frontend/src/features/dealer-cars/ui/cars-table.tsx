import { useNoun } from "@/shared/hooks/use-noun";
import UiButton from "@/shared/ui/UiButton";
import UiDialog from "@/shared/ui/UiDialog";
import { UILink } from "@/shared/ui/UiLink";
import { Clock, Ellipsis } from "@gravity-ui/icons";
import clsx from "clsx";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

interface CarsTableProps {
    carItems?: any[];
    selectable?: boolean;
    selectedCar?: any;
    setSelectedCar?: (car: any) => void
}

const StatusCell = ({ car, selectable }: { car: any, selectable: boolean | undefined }) => {
    const auctionNoun = useNoun(car.lots?.length, 'аукционе', 'аукционах', 'аукционах');

    return (
        <div className="flex flex-col gap-2">
            {car.status === 'deal' && <UILink className="text-sm text-orange-400">Выход на сделку</UILink>}
            {car.status !== 'deal' && car.status !== 'sold' && car.lots?.length > 0 &&
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm text-slate-400">Выставлен на {car.lots?.length} {auctionNoun}</p>
                    {!selectable && <div><UiButton size="small">Снять с торгов</UiButton></div>}
                </div>
            }
            {car.status === 'selected' && <div className="flex flex-row gap-2 items-center"><Clock /> Выбран покупателем</div>}
            {car.status === 'sold' && <p className="col-span-2 text-sm text-slate-400">Сделка была совершена и автомобиль в архиве</p>}
        </div>
    );
};

export function CarsTable({ carItems = [], selectable, selectedCar, setSelectedCar }: CarsTableProps) {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogText, setDialogText] = useState('')

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
            className: 'text-slate-900 text-base'
        },
        bodyRow: {
            className: 'bg-transparent hover:bg-white/70 hover:shadow-md border-b  border-gray-200'
        },
        radioButton: ({ context }: { context: any }) => ({
            className: clsx(
                'flex justify-center items-center',
                'border-2 w-6 h-6 text-gray-700 rounded-full transition duration-200 ease-in-out',
                context.checked ? 'border-brand-700 bg-brand-700 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900',
                {
                    'hover:border-brand-900 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                    'cursor-default opacity-60': context.disabled
                }
            )
        })
    }
    // const statusBodyTemplate = (car: any) => {
    //     return <div className="flex flex-col gap-2">
    //         {car.status === 'deal' && <UILink className="text-sm text-orange-400">Выход на сделку</UILink>}
    //         {car.status !== 'deal' && car.status !== 'sold' && (car.lots?.length
    //             ? <div className="flex flex-row gap-2 items-center">
    //                 <p className="text-sm text-slate-400">Выставлен на {car.lots?.length} {useNoun(car.lots?.length, 'аукционе', 'аукционах', 'аукционах')}</p>
    //                 {!selectable && <div><UiButton size="small">Снять с торгов</UiButton></div>}
    //             </div>
    //             : <p className="text-sm text-slate-400">Не принимает участие в аукционах</p>
    //         )}
    //         {car.status === 'selected' &&
    //             <div className="flex flex-row gap-2 items-center">
    //                 <span className="text-sm text-orange-400 flex flex-row gap-1 items-center"><Clock /> Выбран покупателем</span>
    //                 {/* <div><UiButton size="small">Подтвердить предложение</UiButton></div> */}
    //             </div>
    //         }
    //         {car.status === 'sold' && <p className="col-span-2 text-sm text-slate-400">Сделка была совершена и автомобиль в архиве</p>}
    //     </div>
    // }

    const configutarionBodyTemplate = (car: any) => {
        const configText = `${car.brand || ''} ${car.model || ''} ${car.configuration || ''}`
        if (selectable) {
            return <p className="text-sm text-slate-700 font-semibold">{configText}</p>
        } else {
            const isDraft = car.is_filled === false ? <span className="text-slate-400 font-semibold">Черновик</span> : <></>;
            return <UILink href={`/cars/${car.id}`} className="!text-sm text-slate-700 font-semibold">{isDraft} {configText}</UILink>
        }
    }

    const rowClass = (car: any) => {
        return {
            '!border-2 !border-orange-300': car.status === "selected",
            '!bg-orange-50 !border-2 !border-orange-300': car.status === "deal",
            '!bg-slate-50': car.status === "sold"
        }
    }
    return <>
        <UiDialog header="Опции" visible={dialogVisible} style={{ width: '40vw' }} onHide={() => setDialogVisible(false)}>
            <p className="m-0">
                {dialogText}
            </p>
        </UiDialog>
        <DataTable
            className='font-sans my-2 bg-white'
            value={carItems}
            selectionMode={selectable ? "radiobutton" : "single"}
            pt={pt}
            dataKey="id"
            rowClassName={rowClass}
            emptyMessage="Автомобили не найдены"
            sortField="sequence"
            selection={selectedCar}
            onSelectionChange={(e: any) => {
                setSelectedCar && setSelectedCar(e.value)
            }}
            metaKeySelection={false}
        >
            {selectable && <Column selectionMode="single" header=" " headerStyle={{ width: '3rem' }} ></Column>}
            <Column body={configutarionBodyTemplate} sortable header="Описание автомобиля" pt={pt}></Column>
            {/* <Column body={statusBodyTemplate} header="Статус" pt={pt}></Column> */}
            <Column body={(car) => <StatusCell car={car} selectable={selectable} />} header="Статус" />
            {/* <Column body={optionsBodyTemplate} header="Опции" pt={pt}></Column> */}
            <Column body={(car: any) => {
                return <div className="flex flex-col">
                    <p className="text-base">{car.sequence}</p>
                    <p className="text-xxs text-slate-400">{car.vin}</p>
                </div>
            }} header="№, VIN" pt={pt}></Column>
            <Column field="city" header="Город" pt={pt}></Column>
            <Column body={(car: any) => (
                <div className="flex flex-col">
                    <p className="text-base">{car.mileage}</p>
                    {car.isMileageAbroad && <p className="text-xxs text-slate-400">Без пробега по РФ</p>}
                </div>
            )} field="mileage" header="Пробег" sortable pt={pt}></Column>
            <Column field="year" header="Год" sortable pt={pt}></Column>
        </DataTable>
    </>
}