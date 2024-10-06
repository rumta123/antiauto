import { DealersCarDto } from "@/shared/api/generated";
import { UiSpinner } from "@/shared/ui"
import { LotsList } from "./lots-list";
import { useLotsByCarId } from "@/entities/lots/use-lots";


interface LotsListFittableForCarProps {
    car: DealersCarDto
}
export function LotsListFittableForCar({ car }: LotsListFittableForCarProps) {
    const { lots, isLoading, isError, error } = useLotsByCarId(car.id, { part: 'fittable' })
    return (
        <>
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <LotsList lots={lots} />
            }
        </>
    )
}