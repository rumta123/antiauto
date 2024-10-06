import { LotDto, OfferDto } from "@/shared/api/generated";
import { useNoun } from "@/shared/hooks/use-noun";
import UiCard from "@/shared/ui/UiCard";

import { Skeleton } from "primereact/skeleton";
import { AccordanceOptions } from "./accordance-options";
import clsx from "clsx";
import { Box, CircleCheck, CircleXmark, ClockArrowRotateLeft, Ellipsis, MapPin, PencilToLine, Sliders, SlidersVertical, Star, TrashBin } from "@gravity-ui/icons";
import UiImage from "@/shared/ui/UiImage";

import UiButton from "@/shared/ui/UiButton";
import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import UiOverlayPanel from "@/shared/ui/UiOverlayPanel";

import moment from 'moment'
import 'moment/locale/ru';
import { OfferDeleteConfirm } from "./offer-delete-confirm";
import { OfferSelectConfirm } from "./offer-select-confirm";
import { Tooltip } from "primereact/tooltip";
moment.locale('ru')

interface OffersListProps {
    items?: OfferDto[];
    lotData?: LotDto
}

function OfferItem({ offer, lotData }: { offer: OfferDto, lotData?: LotDto }) {
    const op = useRef<OverlayPanel>(null);
    const offerStatusClassName = (offer: OfferDto) => {
        return clsx(
            { "text-seabrand-600": offer.is_own && (offer.status.name === "moderation" || offer.status.name === "published") },
            { "text-orange-400": offer.status.name === "selected_by_buyer" || offer.status.name === "selected_by_seller" }
        )
    }

    const offerStatusBorderClassName = (offer: OfferDto) => {
        return clsx(
            { "border-l-seabrand-600 border-l-4": offer.is_own && (offer.status.name === "moderation" || offer.status.name === "published") },
            { "border-l-gray-400 border-l-4 bg-slate-100": offer.status.name === "moderation" },
            { "border-l-orange-400 border-l-4": offer.status.name === "selected_by_buyer" || offer.status.name === "selected_by_seller" }

        )
    }
    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false)
    const [visibleConfirmSelect, setVisibleConfirmSelect] = useState(false)
    const [visibleRejectSelect, setVisibleRejectSelect] = useState(false)

    const optionsNoun = useNoun(offer.waiting, 'день', 'дня', 'дней')
    return (
        <UiCard key={offer.id} className={clsx("bg-white shadow-md", offerStatusBorderClassName(offer))}>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-9 grid-cols-subgrid grid  gap-4 divide-x divide-slate-400">
                    <div className="col-span-3 flex flex-col gap-2">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <p className={clsx(
                                    " text-xl font-semibold",
                                    offerStatusClassName(offer)
                                )}>{offer.is_own ? 'Мой оффер' : 'Оффер'} №{offer.sequence}</p>
                                <p className={clsx(offerStatusClassName(offer), 'text-xxs')}>{new Date(offer.created_at).toLocaleString()}</p>
                            </div>

                            <div className={clsx('flex flex-row items-center gap-1', offerStatusClassName(offer))}>
                                <div className="flex flex-col gap-1 items-center">
                                    <p className="text-xxs">Дилер</p>
                                    <p><span className="text-lg font-semibold">{offer.dealer_rating}</span>/5</p>
                                </div>
                                <Star width="1.625rem" height="1.625rem" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-slate-900 text-2xl font-bold">{offer.price.toLocaleString()} &#8381;</p>
                            {offer.priceValidTill && <>

                                <Tooltip target=".priceValidTill-tooltip-target" />
                                <div className="priceValidTill-tooltip-target flex flex-row gap-1 items-center text-green-600" data-pr-tooltip="Срок действия предложения">
                                    <ClockArrowRotateLeft />
                                    <p>{moment.locale('ru') && moment.relativeTimeThreshold('h', 24) && moment.relativeTimeThreshold('d', 26) && moment(offer.priceValidTill).fromNow(true)}</p>
                                </div>
                            </>
                            }
                        </div>
                        <div className="flex flex-row gap-2 items-center text-slate-600 text-xxs">
                            <div className={`flex flex-row gap-2 items-center ${offer.distance > (lotData?.max_distance||0) && 'text-red-600'}`}>
                                <MapPin />
                                <p className=" ">{offer.car.city}{offer.distance > 0 ? ', '+ offer.distance + ' км' : ''}</p>
                            </div>
                            {!!offer.waiting &&
                                <>
                                    <Box className="ml-2" />
                                    <p className="">{`${offer.waiting} ${optionsNoun}`}</p>
                                </>}
                        </div>
                        <div className="flex flex-row gap-2 items-center text-slate-600 text-xxs">
                            {(offer.isCreditAvailable || offer.isInsuranceAvailable || offer.isTradeinAvailable) &&
                                <>
                                    <Sliders />
                                    {[
                                        offer.isCreditAvailable && 'Кредит',
                                        offer.isInsuranceAvailable && 'Страховка',
                                        offer.isTradeinAvailable && 'Трейд-ин'
                                    ].filter(Boolean).join(', ')}
                                </>}
                        </div>
                    </div>

                    <div className="col-span-6 pl-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-4 text-slate-400">
                                <p className="text-xxs"><span className="text-base font-semibold">{offer.car.year}</span> год</p>
                                <p className="text-xxs"><span className="text-base font-semibold">{offer.car.mileage?.toLocaleString()} км</span> {offer.car.isMileageAbroad && '(без пробега по РФ)'}</p>
                                {offer.car.vin && <p className="text-base"><span className="text-base font-semibold">VIN</span> {offer.car.vin}</p>}
                            </div>
                            <AccordanceOptions options={offer.options} />
                        </div>
                    </div>
                </div>

                <div className="col-span-3 -my-4 -mr-4 relative">
                    <UiImage className="h-full" imgClassName="shadow-none rounded-l-none" imgBase64={offer.car.photo} />

                    <UiButton className="!absolute top-4 right-4 z-50" outlined size="small" severity="secondary" onClick={(e) => op.current?.toggle(e)}><Ellipsis /></UiButton>
                    <UiOverlayPanel ref={op}>
                        <div className="flex flex-col items-start">
                            <UiButton text><SlidersVertical className="mr-1" />В сравнение</UiButton>
                            {lotData?.is_own && <>
                                {offer.status.name !== 'selected_by_buyer' && <>
                                    <UiButton text disabled={offer.status.name !== 'published' || lotData.status.name !== 'published' ? true : false} onClick={() => setVisibleConfirmSelect(true)}><CircleCheck className="mr-1" />Выбрать</UiButton>
                                    <OfferSelectConfirm
                                        offer={offer}
                                        visibleConfirmSelect={visibleConfirmSelect}
                                        setVisibleConfirmSelect={setVisibleConfirmSelect}
                                        onSuccess={(data) => { }}
                                        successMsg='Предложение выбрано'
                                        title="Выбор предложения"
                                        message={`Вы уверены что хотите выбрать предложение №${offer.sequence}?`}
                                    />
                                </>}
                                {offer.status.name === 'selected_by_buyer' && <UiButton text onClick={() => setVisibleConfirmSelect(true)}><CircleXmark className="mr-1" />Отменить выбор</UiButton>}
                            </>}
                            {offer.is_own && <>
                                <UiButton text disabled={offer.status.name !== 'published' ? true : false}><PencilToLine className="mr-1" />Редактировать</UiButton>
                                <UiButton text onClick={() => setVisibleConfirmDelete(true)}><TrashBin className="mr-1" />Удалить</UiButton>
                                <OfferDeleteConfirm
                                    offer={offer}
                                    visibleConfirmDelete={visibleConfirmDelete}
                                    setVisibleConfirmDelete={setVisibleConfirmDelete}
                                    onSuccess={(data) => { }}
                                />
                            </>}
                        </div>
                    </UiOverlayPanel>

                    {offer.status.isVisibleForBuyer === false && offer.status.name === "moderation" && <>
                        <div className="!absolute bg-white rounded-lg shadow-md p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <p className="text-nowrap text-xs">На модерации</p>
                        </div>
                    </>}
                    {offer.status.name === "selected_by_buyer" && <>
                        <div className="!absolute bg-white rounded-lg shadow-md p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <p className="text-nowrap text-xs">Автомобиль выбран покупателем</p>
                            {offer.is_own && <div className="flex flex-row gap-2 mt-2">
                                <UiButton size="small" severity="warning" onClick={() => setVisibleConfirmSelect(true)}>Подтвердить</UiButton>
                                <OfferSelectConfirm
                                    offer={offer}
                                    visibleConfirmSelect={visibleConfirmSelect}
                                    setVisibleConfirmSelect={setVisibleConfirmSelect}
                                    onSuccess={(data) => { }}
                                    successMsg='Предложение подтверждено'
                                    title="Подтверждение предложения"
                                    message={`Вы уверены что хотите подтвердить предложение №${offer.sequence}?`}
                                />
                                <UiButton outlined size="small" severity="warning">Отказать</UiButton>
                                <OfferSelectConfirm
                                    offer={offer}
                                    visibleConfirmSelect={visibleRejectSelect}
                                    setVisibleConfirmSelect={setVisibleRejectSelect}
                                    onSuccess={(data) => { }}
                                    successMsg='Предложение отклонено'
                                    title="Отклонение предложения"
                                    message={`Вы уверены что хотите отклонить предложение №${offer.sequence}?`}
                                />
                            </div>}
                        </div>
                    </>}
                    {offer.status.name === "selected_by_seller" && <>
                        <div className="!absolute bg-white rounded-lg shadow-md p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <p className="text-nowrap text-xs">Предложение подтверждено продавцом</p>
                        </div>
                    </>}
                </div>
            </div>
        </UiCard>
    );
}

export function OffersList({ items = [], lotData }: OffersListProps) {


    return <>
        <div className="flex flex-col gap-4">
            {items.length ?
                items.map(offer => {
                    return <OfferItem offer={offer} lotData={lotData} key={offer.id} />
                })
                :
                <Skeleton className="mt-2 bg-seabrand-200" width="100%" height="10rem" />
            }
        </div>
    </>
}