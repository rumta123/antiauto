import { LotDto, OfferCreateDto } from "@/shared/api/generated";
import UiCard from "@/shared/ui/UiCard";
import UiChip from "@/shared/ui/UiChip";
import { OfferFillConditions } from "./offer-fill-conditions";
import { Ban, PencilToLine, SealCheck, SlidersVertical } from "@gravity-ui/icons";
import { AccordanceOptions } from "./accordance-options";
import UiImage from "@/shared/ui/UiImage";
import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import UiButton from "@/shared/ui/UiButton";
import UiOverlayPanel from "@/shared/ui/UiOverlayPanel";
import UiTooltipIcon from "@/shared/ui/UiTooltip";

interface OfferTemplateProps {
    offerTemplate: OfferCreateDto,
    lot?: LotDto;
}
export function OfferTemplate({ offerTemplate, lot }: OfferTemplateProps) {

    const op = useRef<OverlayPanel>(null);
    
    return <>

        <UiCard className="bg-white shadow-md">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-9 grid-cols-subgrid grid  gap-4 divide-x divide-slate-400">

                    <div className="col-span-3 flex flex-col gap-2">
                        <p className="text-xl font-semibold">Автомобиль #{offerTemplate.dealers_car.sequence}</p>

                        {offerTemplate.dealers_car.is_verified ?
                            <div className="flex flex-row gap-2 items-center text-green-600"><SealCheck />Авто верифицирован<UiTooltipIcon text={`Покупатель сразу увидит ваше предложение`} /></div>
                            :
                            <div className="flex flex-row gap-2 items-center text-red-600"><Ban />Авто не верифицирован<UiTooltipIcon text={`Необходима верификация автомобиля, \nкоторая осуществляется при его первичном\nпредложении в каком-либо аукционе.`} /></div>
                        }
                        <div><OfferFillConditions offerTemplate={offerTemplate} lot={lot} /></div>
                    </div>

                    <div className="col-span-6 pl-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-4 text-slate-400">
                                <p className="text-xxs"><span className="text-base font-semibold">{offerTemplate.dealers_car?.year}</span> год</p>
                                <p className="text-xxs"><span className="text-base font-semibold">{offerTemplate.dealers_car?.mileage?.toLocaleString()} км</span> {offerTemplate.dealers_car?.isMileageAbroad && '(без пробега по РФ)'}</p>
                                {offerTemplate.dealers_car.vin && <p className="text-base"><span className="text-base font-semibold">VIN</span> {offerTemplate.dealers_car?.vin}</p>}
                            </div>
                            <AccordanceOptions options={offerTemplate.options} />
                        </div>
                    </div>
                </div>

                <div className="col-span-3 -my-4 -mr-4 relative">
                    <UiImage className="h-full" imgClassName="shadow-none rounded-l-none" imgBase64={offerTemplate.dealers_car?.photo} />

                    <UiButton className="!absolute top-4 right-4 z-50" outlined size="small" severity="secondary" onClick={(e) => op.current?.toggle(e)}>...</UiButton>
                    <UiOverlayPanel ref={op}>
                        <div className="flex flex-col items-start">
                            <UiButton icon={<SlidersVertical />} text>В сравнение</UiButton>
                            <UiButton icon={<PencilToLine />} text>Редактировать</UiButton>

                        </div>
                    </UiOverlayPanel>


                </div>
            </div>
        </UiCard>
    </>
}