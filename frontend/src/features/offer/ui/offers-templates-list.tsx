'use client'
import { useOffersCreateTemplates } from "@/entities/offers/use-offers-create";

import { LotDto, OfferDto, PatchDealersCarDto } from "@/shared/api/generated";
import UiButton from "@/shared/ui/UiButton";
import UiCard from "@/shared/ui/UiCard";
import UiDialog from "@/shared/ui/UiDialog";
import UiImage from "@/shared/ui/UiImage";
import { UiSpinner } from "@/shared/ui"
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { OfferTemplate } from "./offer-template";
import { useRouter } from "next/navigation";
import { useDealersCarCreate } from "@/entities/dealers-cars/use-dealers-cars-create";
import Link from "next/link";

interface OffersTemplatesListProps {
    lot: LotDto
}

export function OffersTemplatesList({ lot }: OffersTemplatesListProps) {
    const router = useRouter()

    const { offersTemplates, isLoadingOffersTemplates, isErrorOffersTemplates, errorOffersTemplates } = useOffersCreateTemplates({ lot_id: lot?.lot_uuid })
    // const [carData, setCarData] = useState<PatchDealersCarDto>();
    // const handleCarCreate = (data: PatchDealersCarDto) => {
    //     router.push(`/cars/add/${data.id}`)
    // }
    // const { createCar, isPending: isCarCreatePending, isError: isCarCreateError, error: errorCarCreate, isSuccess: isCarCreateSuccess } = useDealersCarCreate(handleCarCreate)
    return <>
        <div className="flex flex-col gap-4">
            {isLoadingOffersTemplates ?
                <UiSpinner />
                :
                isErrorOffersTemplates ?
                    <div>Error: {errorOffersTemplates?.message}</div>
                    :
                    offersTemplates && offersTemplates.map((template, index) => (
                        <OfferTemplate key={index} offerTemplate={template} lot={lot} />
                    ))
            }
            <UiCard className="bg-slate-50 shadow-md">
                <div className="grid grid-cols-12 gap-4 min-h-32">
                    <div className="col-span-9 grid-cols-subgrid grid  gap-4 divide-x divide-slate-400">
                        <div className="col-span-3 flex flex-col gap-2 pr-4">
                            <div className="flex flex-row gap-2 items-center">
                                <p className="text-xl text-slate-700 font-semibold">Автомобиля ещё нет в базе</p>
                            </div>
                            <div>
                                <Link href={`/cars/add/${lot?.engine_hash}`} target="_blank">
                                    <UiButton severity="secondary" outlined >Добавить новый авто</UiButton>
                                </Link>
                            </div>
                        </div>
                        <div className="col-span-6 flex flex-col px-6 justify-around">
                        </div>
                    </div>
                    <div className="col-span-3 -my-4 -mr-4 relative">
                        <UiImage className="h-full" imgClassName={`rounded-l-none shadow-none  `} />
                    </div>

                </div>
            </UiCard>
        </div >
    </>
}