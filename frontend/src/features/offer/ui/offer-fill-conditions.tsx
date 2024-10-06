import { useCities } from "@/entities/cities/use-cities";
import { useOfferCreate } from "@/entities/offers/use-offers-create";
import { CityDto, LotDto, OfferCreateDto, OfferDto } from "@/shared/api/generated";
import { UiToast } from "@/shared/ui";

import UiAutoComplete from "@/shared/ui/UiAutocomplete";
import UiButton from "@/shared/ui/UiButton";
import UiCalendar from "@/shared/ui/UiCalendar";
import UiCheckbox from "@/shared/ui/UiCheckbox";
import UiDialog from "@/shared/ui/UiDialog";
import UiInputNumber from "@/shared/ui/UiInputNumber";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

interface OfferFillConditionsProps {
    offerTemplate: OfferCreateDto;
    lot?: LotDto
}

export function OfferFillConditions({ offerTemplate, lot }: OfferFillConditionsProps) {
    const [dialogVisible, setDialogVisible] = useState(false)

    const [cityQuery, setCityQuery] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<CityDto[] | undefined>(undefined)
    const { cities, isCitiesLoading, citiesError } = useCities(cityQuery ? { name: cityQuery } : undefined);
    useEffect(() => {
        if (!isCitiesLoading && cities) {
            setCitySuggestions(cities);
        }
    }, [cities, isCitiesLoading]);

    const [offerData, setOfferData] = useState<OfferCreateDto>(offerTemplate)
    const [createdOffer, setCreatedOffer] = useState<OfferDto>()
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setOfferData(offerTemplate)
    }, [offerTemplate]);
    const { createOffer, isPending: isOfferCreatePending, isSuccess: isOfferCreateSuccess, isError: isOfferCreateError, error: offerCreateError } = useOfferCreate((data) => {
        setCreatedOffer(data)
    })

    useEffect(() => {
        if (isOfferCreateError && offerCreateError) {
            toast.current?.show({
                severity: 'error',
                summary: offerCreateError?.response?.data?.message || 'Произошла ошибка при добавлении предложения.',
                sticky: true
            })
        }
    }, [offerCreateError, isOfferCreateError])
    useEffect(() => {
       
        if (isOfferCreateSuccess) {
            toast.current?.show({
                severity: 'success',
                summary: createdOffer?.message ? String(createdOffer.message) : 'Предложение добавлено',
                sticky: true
            })
        }
    }, [createdOffer])
    return <>
        <UiButton onClick={() => setDialogVisible(true)} >Указать условия</UiButton>

        <UiToast ref={toast} appendTo={null} />

        <UiDialog header='Введите условия предложения'
            visible={dialogVisible}
            style={{ width: '60vw' }}
            footer={<UiButton
                className="justify-self-start"
                onClick={() => {
                    createOffer(offerData)
                    setDialogVisible(false)
                }}
            >Подтвердить условия</UiButton>}
            onHide={() => setDialogVisible(false)}>
            {offerData &&
                <div className="py-2 grid grid-cols-2 gap-4">
                    <UiInputNumber label="Цена" value={offerData.price} onChange={(e) => setOfferData({ ...offerData, price: e.value || 0 })} />
                    <UiCalendar
                        label="Действительна до"
                        value={offerData.priceValidTill ? new Date(offerData.priceValidTill) : null}
                        showTime
                        minDate={new Date()}
                        hourFormat="24"
                        dateFormat="dd.mm.yy"
                        onChange={(e) => setOfferData({ ...offerData, priceValidTill: e.value ? e.value.toISOString() : null })}
                    />
                    <UiInputNumber label="Время ожидания (дней)" value={offerData.waiting} onChange={(e) => setOfferData({ ...offerData, waiting: e.value || 0 })} />
                    <div className="flex flex-row gap-4">
                        <UiCheckbox labelClassName="whitespace-nowrap" text="Трейд-ин" checked={offerData.isTradeinAvailable} onChange={(e) => { setOfferData({ ...offerData, isTradeinAvailable: e.checked || false }) }} />
                        <UiCheckbox text="Кредит" checked={offerData.isCreditAvailable} onChange={(e) => { setOfferData({ ...offerData, isCreditAvailable: e.checked || false }) }} />
                        <UiCheckbox text="Страховка" checked={offerData.isInsuranceAvailable} onChange={(e) => { setOfferData({ ...offerData, isInsuranceAvailable: e.checked || false }) }} />
                    </div>
                    {/* <UiAutoComplete
                        className="w-full"
                        label="Город"
                        placeholder="Начните вводить"
                        value={cityQuery}
                        suggestions={citySuggestions}
                        field="name"
                        completeMethod={(e) => {
                            setCityQuery(e.query.trim());
                        }}
                        onSelect={(e) => {
                            setOfferData({ ...offerData, city_id: e.value.id })
                            setCityQuery(e.value.name);
                        }}
                    /> */}
                </div>
            }
        </UiDialog>
    </>
}