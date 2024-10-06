import { LotDto } from "@/shared/api/generated"
import UiCard from "@/shared/ui/UiCard"
import { useRouter } from "next/navigation";
import { LotInfo } from "./lot-info";

interface LotsListProps {
    lots?: LotDto[]
}

export function LotsList({ lots }: LotsListProps) {

    return (
        <div className="flex flex-col gap-4">
            {lots && lots.length > 0 ?
                lots.map((lot, index) => (
                    <UiCard className="bg-seabrand-50 !p-0" key={index} /* onClick={() => router.push(`/auctions/${lot.lot_uuid}`)} */>
                        <LotInfo
                            titleLink={`/auctions/${lot.lot_uuid}`}
                            carConfigurationText={`${lot.brand} ${lot.model} ${lot.configuration}`}
                            carComplectationText={lot.complectation}
                            optionsStrict={lot.options?.filter(opt => opt.strict === true)}
                            optionsWish={lot.options?.filter(opt => opt.strict === false)}
                            configurationPhoto={lot.configuration_photo}
                            isConfigurationPhotoPreview={false}
                            offersCount={lot.offers_count}
                            offersFitOptionsCount={lot.offers_fit_options}
                            offersMinPrice={lot.offers_min_price}
                            lotId={lot.lot_id}
                            lotCreatedAt={lot.created_at}
                            lotCityName={lot.city}
                            lotCityMaxDistance={lot.max_distance}
                            lot={lot}
                        />
                    </UiCard>
                ))
                :
                <div className="flex flex-row items-center justify-start min-h-10"><p className="font-slate-900 text-xl font-semibold">Аукционы не найдены</p></div>
            }
        </div>
    )
}