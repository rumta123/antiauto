"use client"


import { CarDetailsCard } from "@/features/dealer-cars/ui/car-details-card";
import { LotsListCarInvolved } from "@/features/lot/ui/lots-list-car-involved";
import { LotsListFittableForCar } from "@/features/lot/ui/lots-list-fittable-for-car";
import { BackBtn } from "@/features/navigation";
import { UiButton, UiSpinner } from "@/shared/ui"
import UiTabMenu from "@/shared/ui/UiTabMenu";
import { PencilToSquare, TrashBin } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CarDetailsTabDetails } from "./car-details-tab-details";
import { useDealersCarById, useDeleteDealersCar } from "@/entities/dealers-cars";
import { CarDeleteConfirm } from "@/features/dealer-cars/ui/car-delete-confirm";

interface CarDetailsProps {
    car_id: string;
}

const CarDetailsWidget: React.FC<CarDetailsProps> = ({ car_id }) => {
    const { car, isLoading, isError, error } = useDealersCarById(car_id)
    const [viewState, setViewState] = useState<'details' | 'lots' | 'fittableLots'>('details');
    const router = useRouter()

    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false)

    return (
        <>
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <>
                        {car &&
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row items-center gap-4">
                                            <BackBtn path='/cars' />
                                            <p className="text-4xl text-brand-900 font-black">Автомобиль №{car.sequence}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-4">
                                            <UiButton text
                                                tooltip={car.lots?.length > 0 ? `Автомобиль участвует в аукционе, \nчтобы отредактировать параметры автомобиля нужно сначала снять все предложения` : ''}
                                                tooltipOptions={{ position: 'top', showOnDisabled: true }}
                                                disabled={car.lots.length > 0}
                                                onClick={() => { router.push(`/cars/edit/${car_id}`) }}
                                            ><PencilToSquare className="mr-1" />Редактировать</UiButton>
                                            <UiButton text onClick={()=>setVisibleConfirmDelete(true)}><TrashBin className="mr-1" /> Удалить</UiButton>
                                            <CarDeleteConfirm
                                                car={car}
                                                visibleConfirmDelete={visibleConfirmDelete}
                                                setVisibleConfirmDelete={setVisibleConfirmDelete}
                                                onSuccess={(data) => { router.push('/cars') }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <CarDetailsCard carData={car} showActions={false} />

                                <UiTabMenu model={[
                                    { label: 'Полное описание автомобиля', command: () => setViewState('details') },
                                    { label: 'Подходящие аукционы', command: () => setViewState('fittableLots') },
                                    { label: 'Принимает участие', command: () => setViewState('lots') },
                                ]} />

                                {viewState === 'details' && <CarDetailsTabDetails car={car} />}
                                {viewState === 'lots' && <LotsListCarInvolved car={car} />}
                                {viewState === 'fittableLots' && <LotsListFittableForCar car={car} />}
                            </div>
                        }
                    </>
            }
        </>
    )
}
export default CarDetailsWidget