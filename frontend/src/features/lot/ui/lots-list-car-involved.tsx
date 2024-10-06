import { DealersCarDto } from "@/shared/api/generated";
import { UiSpinner } from "@/shared/ui"
import { LotsList } from "./lots-list";
import { useLotsByCarId } from "@/entities/lots/use-lots";


interface LotsListCarInvolvedProps {
    car: DealersCarDto
}
export function LotsListCarInvolved({ car }: LotsListCarInvolvedProps) {
    const { lots, isLoading, isError, error } = useLotsByCarId(car.id, { part: 'involved' })
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