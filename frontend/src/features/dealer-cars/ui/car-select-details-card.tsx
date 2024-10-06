import { DealersCarDto, OfferCreateDto } from "@/shared/api/generated";
import { useNoun } from "@/shared/hooks/use-noun";
import UiButton from "@/shared/ui/UiButton";
import UiCard from "@/shared/ui/UiCard";
import UiCheckbox from "@/shared/ui/UiCheckbox";
import UiDialog from "@/shared/ui/UiDialog";
import UiImage from "@/shared/ui/UiImage";
import UiInputNumber from "@/shared/ui/UiInputNumber";
import { UILink } from "@/shared/ui/UiLink";
import UiSlider from "@/shared/ui/UiSlider";
import clsx from "clsx";
import { Chip } from "primereact/chip";
import { useState } from "react";

interface CarSelectDetailsCardProps {
    statusContent?: React.ReactNode;
    carData: DealersCarDto
    selectedCar?: DealersCarDto;
    setSelectedCar: (carData?: DealersCarDto) => void;
    offerData: OfferCreateDto;
    setOfferData?: (offerData: OfferCreateDto) => void;
}

export function CarSelectDetailsCard({ carData, statusContent, selectedCar, setSelectedCar, offerData, setOfferData }: CarSelectDetailsCardProps) {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogText, setDialogText] = useState('')
    const [dialogTitle, setDialogTitle] = useState('')

    const [waitingTimeDialogValue, setWaitingTimeDialogValue] = useState<number | [number, number]>(0)
    const [waitingDialogVisible, setWaitingDialogVisible] = useState(false)

    const waitingTimeDialogValueNoun = useNoun(Number(waitingTimeDialogValue), 'день', 'дня', 'дней')

    const offerDataWaitingNoun = useNoun(Number(offerData.waiting), 'день', 'дня', 'дней')

    const configText = `${carData.brand} ${carData.model} ${carData.configuration}`
    return (
        <>
            <UiDialog header={dialogTitle} visible={dialogVisible} style={{ width: '60vw' }} onHide={() => setDialogVisible(false)}>
                <p className="m-0">
                    {dialogText}
                </p>
            </UiDialog>

            <UiDialog header='Введите срок ожидания'
                visible={waitingDialogVisible}
                style={{ width: '30vw' }}
                footer={<UiButton
                    className="justify-self-start"
                    onClick={() => {
                        setOfferData && setOfferData({ ...offerData, waiting: Number(waitingTimeDialogValue) });
                        setWaitingDialogVisible(false)
                    }}
                >Сохранить</UiButton>}
                onHide={() => setWaitingDialogVisible(false)}>
                <div className="flex flex-col  gap-4">

                    <p className="w-9/12">Время ожидания {waitingTimeDialogValue} {waitingTimeDialogValueNoun}</p>
                    <div className="w-9/12 flex flex-col ">
                        <UiSlider
                            value={waitingTimeDialogValue}
                            onChange={(e) => setWaitingTimeDialogValue(e.value)}
                            step={1}
                            min={0}
                            max={30}
                        />
                        <div className="flex flex-row content-between justify-between mt-1 ">
                            <span className="text-sm">0</span>
                            <span className="text-sm">30</span>
                        </div>
                    </div>
                </div>
            </UiDialog>

            <UiCard key={carData?.id} className={clsx(
                "bg-seabrand-50 p-6",
                carData.status === "selected" && 'border-2 border-orange-300',
                carData.status === "deal" && 'bg-orange-50 border-2 border-orange-300',
                carData.status === "sold" && 'bg-slate-50',
            )}>
                <div className="grid grid-cols-12 divide-x-2 gap-6 divide-seabrand-400">
                    <div className="col-span-9 grid-cols-subgrid divide-y-2 gap-6 divide-seabrand-400  grid grid-cols-12">
                        <div className="col-span-9 divide-x-2 grid gap-6 grid-cols-12 divide-seabrand-400 ">

                            <div className="col-span-7 flex flex-col gap-1">
                                <div className="flex flex-row gap-2 items-center">
                                    <UiCheckbox
                                        checkboxId={String(carData?.id)}
                                        checked={selectedCar?.id === carData?.id}
                                        text={configText}
                                        labelClassName="text-xl text-slate-700 font-semibold overflow-hidden whitespace-nowrap"
                                        tooltip={configText}
                                        onChange={(e) => {
                                            setSelectedCar(carData)
                                            setOfferData && setOfferData({ ...offerData, dealers_car_id: carData.id })
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="flex flex-row gap-1">
                                        <Chip
                                            unstyled
                                            className={`min-w-1`}
                                            label={carData.complectation}
                                            pt={{
                                                root: { className: 'bg-transparent p-0' },
                                                label: { className: 'text-md text-slate-700 whitespace-nowrap overflow-hidden mt-0 mb-0' }
                                            }}
                                        />
                                        {carData.complectation?.length > 45 &&
                                            <UiButton severity="secondary" text className="!px-2 !py-1 shrink-0" onClick={() => {
                                                setDialogText(carData.complectation)
                                                setDialogTitle('Комплектация')
                                                setDialogVisible(true)
                                            }}>...</UiButton>
                                        }
                                    </div>

                                    <div className="flex flex-row gap-1">
                                        <Chip
                                            unstyled
                                            className={`options-${carData.id}-tooltip min-w-1`}
                                            label={carData.options?.join(', ')}
                                            pt={{
                                                root: { className: 'bg-transparent p-0' },
                                                label: { className: 'text-md text-slate-700 whitespace-nowrap overflow-hidden mt-0 mb-0' }
                                            }}
                                        />
                                        {carData.options?.length > 2 &&
                                            <UiButton severity="secondary" text className="!px-2 !py-1 shrink-0" onClick={() => {
                                                setDialogText(carData.options?.join(', '))
                                                setDialogTitle('Опции')
                                                setDialogVisible(true)
                                            }}>...</UiButton>
                                        }
                                    </div>
                                </div>
                                {statusContent}

                            </div>
                            <div className="col-span-5 flex flex-col pl-6 justify-around">
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <p className="text-slate-700">VIN</p>
                                    <p className="text-xl text-slate-700 font-semibold">{carData.vin}</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <p className="text-slate-700" >Пробег</p>
                                    <p className="text-xl text-slate-700 font-semibold">{carData.mileage}</p>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <p className="text-slate-700">Год выпуска</p>
                                    <p className="text-xl text-slate-700 font-semibold">{carData.year}</p>
                                </div>
                            </div>
                        </div>
                        {selectedCar?.id === carData?.id &&
                            <div className="col-span-9 pt-6 divide-x-2 gap-6 divide-transparent  grid grid-cols-12">
                                <div className="col-span-7 flex flex-row gap-2 items-center">
                                    <UiInputNumber label="Цена" value={offerData.price} onChange={(e) => setOfferData && setOfferData({ ...offerData, price: e.value || 0 })} />

                                    <p>
                                        Ожидание <UILink onClick={() => setWaitingDialogVisible(true)}>{offerData.waiting} {offerDataWaitingNoun}</UILink>
                                    </p>
                                </div>
                                <div className="col-span-5 pl-6 flex flex-row gap-2">
                                    <UiCheckbox text="Кредит" checked={offerData.isCreditAvailable} onChange={(e) => { setOfferData && setOfferData({ ...offerData, isCreditAvailable: e.checked || false }) }} />
                                    <UiCheckbox text="Страховка" checked={offerData.isInsuranceAvailable} onChange={(e) => { setOfferData && setOfferData({ ...offerData, isInsuranceAvailable: e.checked || false }) }} />
                                    <UiCheckbox labelClassName="whitespace-nowrap" text="Трейд-ин" checked={offerData.isTradeinAvailable} onChange={(e) => { setOfferData && setOfferData({ ...offerData, isTradeinAvailable: e.checked || false }) }}/>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="col-span-3 -my-6 -mr-6 relative ">
                        <UiImage className="h-full" imgClassName={`rounded-l-none shadow-none ${carData.status === 'sold' && 'grayscale'} `} />
                    </div>
                </div>
            </UiCard>

        </>
    )
}
