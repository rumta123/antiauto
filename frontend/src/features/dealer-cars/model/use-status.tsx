import { useLotsByCarId } from "@/entities/lots/use-lots";
import { useOffersMostImportantStatus } from "@/entities/offers/use-offers-status";
import { OffersDeleteByCarConfirm } from "@/features/offer/ui/offers-delete-by-car-confirm";
import { DealersCarDto, LotDto } from "@/shared/api/generated";
import { useNoun } from "@/shared/hooks/use-noun";
import { UiButton } from "@/shared/ui";
import UiChip from "@/shared/ui/UiChip";
import { UiTag } from "@/shared/ui/UiTag";
import { Bulb, CircleCheck, TagRuble } from "@gravity-ui/icons";
import clsx from "clsx";
import { useState } from "react";

interface useStatusProps {
    car?: DealersCarDto
}
export function useStatus({ car }: useStatusProps) {
    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false)
    let cardClassName = ""
    let titleClassName = ""
    let badge = null
    // const { lots, isLoading, isError, error } = useLotsByCarId(car?.id||'', { part: 'involved' })
    const { lots: fittableLots, isLoading, isError, error } = useLotsByCarId(car?.id || '', { part: 'fittable' })
    const { status } = useOffersMostImportantStatus(car?.id || '')

    const auctionNoun = useNoun(car?.lots?.length || 0, 'аукционе', 'аукционах', 'аукционах');
    const fittableNoun = useNoun(fittableLots?.length || 0, 'подходящий', 'подходящих', 'подходящих');


    if (car) {



        cardClassName = clsx(
            { "border-l-seabrand-600 border-l-4": car.lots.length > 0 },

            { "!border-l-orange-400 border-l-4": status?.name === 'selected_by_buyer' || status?.name === 'selected_by_seller' || status?.name === 'contacts_sended' },
        )
        badge = (<>
            {car.lots.length > 0 && <>
                <div>
                    <UiButton size="small" onClick={() => setVisibleConfirmDelete(true)}>Снять с торгов</UiButton>
                    <OffersDeleteByCarConfirm
                        car={car}
                        visibleConfirmDelete={visibleConfirmDelete}
                        setVisibleConfirmDelete={setVisibleConfirmDelete}
                        onSuccess={(data) => { }}
                    />
                </div>
                <div className="flex flex-row items-center gap-1 text-seabrand-700">
                    <TagRuble /><p className="text-xs "> Выставлен на {car.lots?.length} {auctionNoun}</p>
                </div>
            </>}
            {fittableLots && <>
                <div className="flex flex-row items-center gap-1 text-green-600">
                    <Bulb /><p className="text-xs "> Есть {!!car.lots?.length && 'ещё '}{fittableLots.length} {fittableNoun}</p>
                </div>
            </>}
            {status?.name === 'selected_by_buyer' && <>
                <div className="flex flex-row items-center gap-1 text-orange-400">
                    <CircleCheck /><p className="text-xs ">Выбран покупателем</p>
                </div>
            </>}
            {status?.name === 'selected_by_seller' && <>
                <div className="flex flex-row items-center gap-1 text-orange-400">
                    <CircleCheck /><p className="text-xs ">Подтверждён продавцом</p>
                </div>
            </>}
            {status?.name === 'contacts_sended' && <>
                <div className="flex flex-row items-center gap-1 text-orange-400">
                    <CircleCheck /><p className="text-xs ">Контакты отправлены</p>
                </div>
            </>}
        </>);
    }

    return {
        cardClassName,
        titleClassName,
        badge
    }
}