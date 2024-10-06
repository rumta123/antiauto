"use client"
import { useLotById } from "@/entities/lots/use-lots"
import { LotInfo } from "@/features/lot/ui/lot-info";

import { UiButton, UiSpinner } from "@/shared/ui"
import { TrashBin } from "@gravity-ui/icons";
import { useSessionQuery } from "@/entities/session";
import { useOffers } from "@/entities/offers/use-offers";
import { useState } from "react";
import { OffersTemplatesList } from "@/features/offer";
import UiTabMenu from "@/shared/ui/UiTabMenu";
import { LotDetailsTabDetails } from "./lot-details-tab-details";
import { BackBtn } from "@/features/navigation";
import { LotDetailsTabOffers } from "./lot-details-tab-offers";
import { LotDetailsTabSellersOwnOffers } from "./lot-details-tab-sellers-own-offers";

interface LotDetailsProps {
    lot_uuid: string;
}
const LotDetailsWidget: React.FC<LotDetailsProps> = ({ lot_uuid }) => {

    const { lot, isLoading, isError, error } = useLotById(lot_uuid)
    const { data: sessionData } = useSessionQuery();
    const { offers, isLoadingOffers, isErrorOffers, errorOffers } = useOffers({ lot_id: lot_uuid })
    const [viewState, seViewState] = useState<'offers' | 'ownOffers' | 'addOffers' | 'lotDetails'>('offers');

    return <>
        <div className={`flex flex-col gap-8`}>
            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <>
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row items-center gap-4">
                                    <BackBtn back />
                                    <p className="text-4xl text-brand-900 font-black">
                                        {` ${sessionData?.type === 'customer' ? 'Мой аукцион' : 'Аукцион'} №${lot?.lot_id}`}
                                    </p>
                                </div>

                                {/* <div className="flex flex-row gap-4">
                                    <p className="text-sm text-slate-400 ">{lot?.created_at && new Date(lot?.created_at).toLocaleString()}</p>
                                    <p className="text-sm text-slate-400 ">{`${lot?.city}, до ${lot?.max_distance} км`}</p>
                                </div> */}
                            </div>
                            <div className="flex flex-row gap-4">
                                {sessionData?.type === 'customer' &&
                                    <UiButton text ><TrashBin className="mr-1" />Удалить</UiButton>
                                }
                            </div>
                        </div>
                        {lot &&
                            <LotInfo
                                carConfigurationText={`${lot.brand} ${lot.model} ${lot.configuration}`}
                                carComplectationText={lot.complectation}
                                optionsStrict={lot.options?.filter(opt => opt.strict === true)}
                                optionsWish={lot.options?.filter(opt => opt.strict === false)}
                                configurationPhoto={lot.configuration_photo}
                                isConfigurationPhotoPreview={true}
                                offersCount={offers?.length}
                                offersFitOptionsCount={offers?.filter(offer => offer.options.filter(opt => opt.accordance_type === "unsatisfied").length === 0).length}
                                offersMinPrice={offers?.length ? offers?.sort((a, b) => a.price - b.price)[0].price : 0}
                                lotCreatedAt={lot.created_at}
                                lotCityName={lot.city}
                            lotCityMaxDistance={lot.max_distance}
                            lotId={lot.lot_id}
                                lot={lot}
                            />}
                    </>
            }


            <UiTabMenu model={[
                { label: 'Предложения', command: () => seViewState('offers') },
                { label: 'Мои предложения', visible: sessionData?.type === 'seller', command: () => seViewState('ownOffers') },
                { label: 'Добавить предложение', visible: sessionData?.type === 'seller', command: () => seViewState('addOffers') },
                { label: 'Полное описание лота', command: () => seViewState('lotDetails') },
            ]} />

            {viewState === 'lotDetails' && lot && <>
                <LotDetailsTabDetails engineHash={lot.engine_hash} lotId={lot.lot_uuid} carConfiguration={`${lot.brand} ${lot.model} ${lot.configuration}`} carComplectation={lot.complectation} />
            </>}
            {viewState === 'addOffers' && lot && <>
                <OffersTemplatesList lot={lot} />
            </>}
            {viewState === 'ownOffers' && (<>
                {isLoadingOffers ?
                    <UiSpinner />
                    :
                    isErrorOffers ?
                        <div>Error: {errorOffers?.message}</div>
                        :
                        <LotDetailsTabSellersOwnOffers offers={offers?.filter(offer => offer.is_own === true)} lot={lot} />
                }
            </>)}
            {viewState === 'offers' && (
                isLoadingOffers ?
                    <UiSpinner />
                    :
                    isErrorOffers ?
                        <div>Error: {errorOffers?.message}</div>
                        :
                        <LotDetailsTabOffers offers={offers} lot={lot} />
            )}
        </div>
    </>
}

export default LotDetailsWidget