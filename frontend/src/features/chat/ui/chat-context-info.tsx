import { useBrandModelGenConf } from "@/entities/catalog/use-brand-model-gen-conf";
import { useLotById } from "@/entities/lots/use-lots";
import { useOffer } from "@/entities/offers/use-offer";
import { useNoun } from "@/shared/hooks/use-noun";

interface ChatContextProps {
    offer_id?: string;
    lot_id?: string;
    dealers_car_id?: string;
    user_id?: string;
}
export function ChatContextInfo(params: ChatContextProps) {
    const { data: offerData } = useOffer(params.offer_id)
    const { catalogData } = useBrandModelGenConf(offerData?.car.engine_hash)
    const { lot } = useLotById(params.lot_id)

    const waitingNoun = offerData && useNoun(offerData.waiting, 'день', 'дня', 'дней')
    return (
        <div className="bg-white rounded-lg shadow-md py-4">
            <div className="flex flex-col p-4 gap-2">
                {params.offer_id && offerData && <>
                    <p className="text-lg text-brand-900 font-semibold">Предложение</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-xs text-slate-400">{new Date(offerData?.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{offerData?.car.year} г</p>
                        <p className="text-xs text-slate-400">{offerData.car.city}{offerData.distance > 0 ? ', ' + offerData.distance + ' км' : ''}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <p className="text-xs text-slate-400">Цена</p>
                        <p className="text-xs text-slate-500">{offerData?.price} {offerData?.priceValidTill ? 'до ' + offerData?.priceValidTill : ''}</p>

                        <p className="text-xs text-slate-400">Срок действия</p>
                        <p className="text-xs text-slate-500">{offerData?.priceValidTill ? 'до ' + offerData?.priceValidTill : '--'}</p>

                        <p className="text-xs text-slate-400">Пробег</p>
                        <p className="text-xs text-slate-500">{offerData?.car.mileage} км</p>
                        <p className="text-xs text-slate-400">Ожидание</p>
                        <p className="text-xs text-slate-500">{offerData?.waiting} {waitingNoun}</p>
                        <p className="text-xs text-slate-400">Условия</p>
                        <p className="text-xs text-slate-500">{[
                            offerData.isCreditAvailable && 'Кредит',
                            offerData.isInsuranceAvailable && 'Страховка',
                            offerData.isTradeinAvailable && 'Трейд-ин'
                        ].filter(Boolean).join(', ')}</p>
                    </div>
                </>}
                {params.lot_id && lot && <>
                    <p className="text-lg text-brand-900 font-semibold pt-4">Аукцион №{lot.lot_id}</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-xs text-slate-400">{new Date(lot?.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{lot.city}{lot.max_distance > 0 ? ', ' + lot.max_distance + ' км' : ''}</p>
                    </div>

                    <p className="text-xs text-slate-700">{lot.brand} {lot.model} {lot.configuration}</p>
                    <div className="flex shrink overflow-hidden">
                        <p className="text-xs text-slate-400 whitespace-nowrap min-w-1">{lot.complectation}</p>
                    </div>


                    <div className="grid grid-cols-2 gap-1">
                        <p className="text-xs text-slate-400">Минимальная цена</p>
                        <p className="text-xs text-slate-500">{lot.offers_min_price.toLocaleString()} &#8381;</p>

                        <p className="text-xs text-slate-400">Всего предложений</p>
                        <p className="text-xs text-slate-500">{lot?.offers_count}</p>

                        <p className="text-xs text-slate-400">Со 100% соответствием</p>
                        <p className="text-xs text-slate-500">{lot?.offers_fit_options}</p>

                    </div>
                </>}
            </div>
        </div>
    )
}

