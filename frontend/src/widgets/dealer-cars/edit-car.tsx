"use client"

import { UiSpinner } from "@/shared/ui"
import { usePatchInfoDealersCarById } from "@/entities/dealers-cars/use-patch-dealers-cars"
import { PatchCar } from "@/features/dealer-cars/ui/patch-car"

interface EditCarProps {
    car_id: string
}
export function EditCar({ car_id }: EditCarProps) {
    const { car, isLoading, isError, error } = usePatchInfoDealersCarById(car_id)
    
    return <>
        {isLoading ?
            <UiSpinner />
            :
            isError ?
                <div>Error: {error?.message}</div>
                :
                car && <PatchCar initialCarData={car} />
            }
    </>
}