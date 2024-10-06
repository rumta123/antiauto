"use client"
import { useLots } from "@/entities/lots/use-lots"
import { LotsList } from "@/features/lot/ui/lots-list"
import { UiSpinner } from "@/shared/ui"

const LotsListWidget: React.FC = () => {
    const { lots, isLoading, isError, error } = useLots()
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

export default LotsListWidget