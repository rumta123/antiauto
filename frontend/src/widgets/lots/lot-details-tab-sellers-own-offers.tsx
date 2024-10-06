import { FilterSortOffers, OffersList, OffersTable } from "@/features/offer";
import { LotDto, OfferDto } from "@/shared/api/generated";
import { UiButton } from "@/shared/ui";
import { Dots9, ListUl } from "@gravity-ui/icons";
import moment from 'moment'
import 'moment/locale/ru';
import { useCallback, useState } from "react";
moment.locale('ru')

interface LotDetailsTabSellersOwnOffersProps {
    offers: OfferDto[] | undefined
    lot: LotDto | undefined
}
export function LotDetailsTabSellersOwnOffers({ offers, lot }: LotDetailsTabSellersOwnOffersProps) {
    const [listView, setListView] = useState('list');
    const [filteredAndSortedOffers, setFilteredAndSortedOffers] = useState<OfferDto[]>([]);
    const handleSetFilteredAndSortedOffers = useCallback((offers: OfferDto[]) => {
        setFilteredAndSortedOffers(offers);
    }, []);
    return (
        !offers?.length ?
            <div className="flex flex-col gap-2  min-h-[20rem] bg-[url('/07b56b49-ba41-4fa7-ad9b-9599d76446eb.png')]  bg-no-repeat bg-right-bottom">
                <p>Здесь ещё нет ваших предложений.</p>
            </div>
            :
            <>
                <div className="flex flex-row justify-between items-center">

                <FilterSortOffers offers={offers} setFilteredAndSortedOffers={handleSetFilteredAndSortedOffers} />
                    <div className="flex flex-row gap-2 items-center">
                        <UiButton text disabled>Перейти к сравнению</UiButton>
                        <div className="flex flex-row gap-2 items-center">
                            <UiButton text severity="secondary" className={`!w-12 !h-12 ${listView === 'list' ? 'text-slate-900' : '!text-slate-300'}`} onClick={() => setListView('list')} tooltip='Карточки' tooltipOptions={{ position: 'top', showDelay: 300 }}><Dots9 /></UiButton>
                            <UiButton text severity="secondary" className={`!w-12 !h-12 ${listView === 'table' ? 'text-slate-900' : '!text-slate-300'}`} onClick={() => setListView('table')} tooltip='Список' tooltipOptions={{ position: 'top', showDelay: 300 }}><ListUl /></UiButton>
                        </div>
                    </div>
                </div>
                {listView === 'list' && <OffersList items={filteredAndSortedOffers} lotData={lot}/>}
                {listView === 'table' && <OffersTable items={filteredAndSortedOffers} lotData={lot} />}
            </>
    )
}