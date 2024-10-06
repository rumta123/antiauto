import { DealersCarDto } from "@/shared/api/generated";
import { useNoun } from "@/shared/hooks/use-noun";
import { Ban, Ellipsis, SealCheck, TrashBin } from "@gravity-ui/icons";
import clsx from "clsx";
import { ReactNode, useRef, useState } from "react";
import { useStatus } from "../model/use-status";
import { OverlayPanel } from "primereact/overlaypanel";
import { CarDeleteConfirm } from "./car-delete-confirm";
import { CarDetailsMappedOptions } from "@/widgets/dealer-cars/car-details-mapped-options";
import { UiButton, UiCard, UiDialog, UiImage, UiOverlayPanel } from "@/shared/ui";
import { UILink } from "@/shared/ui/UiLink";
import UiChip from "@/shared/ui/UiChip";

interface CarDetailsCardProps {
    headerLink?: string;
    carData: DealersCarDto
    showActions: boolean;
}

export function CarDetailsCard({ carData, headerLink, showActions = true }: CarDetailsCardProps) {
    const op = useRef<OverlayPanel>(null);
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogText, setDialogText] = useState<string | ReactNode>('')
    const [dialogTitle, setDialogTitle] = useState('')

    const configText = `${carData.brand || ''} ${carData.model || ''} ${carData.configuration || ''}`
    const isDraft = carData.is_filled === false ? <span className="text-slate-400 font-semibold">Черновик</span> : <></>;

    const { cardClassName, titleClassName, badge } = useStatus({ car: carData })
    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false)

    const optionsNoun = useNoun(carData.options?.length - 1, 'опция', 'опции', 'опций')
    return (
        <>
            <UiDialog header={dialogTitle} visible={dialogVisible} style={{ width: '60vw' }} onHide={() => setDialogVisible(false)}>
                <div className="m-0">
                    {dialogText}
                </div>
            </UiDialog>

            <UiCard key={carData?.id} className={clsx(
                cardClassName,
                "bg-white shadow-md ",
                carData.status === "selected" && 'border-2 border-orange-300',
                carData.status === "deal" && 'bg-orange-50 border-2 border-orange-300',
                carData.status === "sold" && 'bg-slate-50',
            )}>
                <div className="grid grid-cols-12 gap-4 min-h-32">
                    <div className="col-span-9 grid-cols-subgrid grid  gap-4 divide-x divide-slate-400">
                        <div className="col-span-6 flex flex-col gap-2">
                            {headerLink ?
                                <div className="flex flex-row gap-2 items-center">
                                    {carData.is_verified && <div className="text-green-600"><SealCheck /></div>}
                                    <UILink href={headerLink} className="!text-lg text-slate-700 font-semibold">{isDraft} <span className="text-slate-400">№{carData.sequence}</span> {configText}</UILink>
                                </div>
                                :
                                <div className="flex flex-row gap-2 items-center">
                                    {carData.is_verified && <div className="text-green-600"><SealCheck /></div>}
                                    <p className="text-lg text-slate-700 font-semibold">{isDraft} <span className="text-slate-400">№{carData.sequence}</span> {configText}</p>
                                </div>
                            }
                            <div>
                                <div className="flex flex-row gap-1 items-center">
                                    <div className="flex shrink overflow-hidden">
                                        <p className="text-xs text-slate-700 whitespace-nowrap min-w-1">{carData.complectation}</p>
                                    </div>
                                    {carData.complectation.length > 65 &&
                                        <UiButton className="shrink-0" severity="secondary" text size="small" onClick={() => {
                                            setDialogText(carData.complectation)
                                            setDialogTitle("Комплектация")
                                            setDialogVisible(true)
                                        }}>...</UiButton>
                                    }
                                </div>

                                <div className="flex flex-row gap-1 items-center">
                                    <UiChip
                                        unstyled
                                        className={`min-w-1`}
                                        // label={carData.options?.map(opt => opt.option_name).join(', ')}
                                        label={carData.options[0]?.option_name}
                                        pt={{
                                            root: { className: 'bg-transparent p-0' },
                                            label: { className: 'text-xs text-slate-700 whitespace-nowrap overflow-hidden mt-0 mb-0' }
                                        }}
                                    />
                                    {carData.options?.length > 1 && <>
                                        <span className="text-xs text-slate-700">и ещё</span>
                                        <UiButton className="shrink-0 !px-1 -ml-1 underline underline-offset-2 decoration-dotted" severity="secondary" text size="small" onClick={() => {
                                            setDialogText(
                                                <CarDetailsMappedOptions carId={carData.id} showAsBlock={false} />
                                            )
                                            setDialogTitle("Опции")
                                            setDialogVisible(true)
                                        }}>
                                            {carData.options?.length - 1} {optionsNoun}
                                        </UiButton>
                                    </>}
                                    {/* {carData.options?.length > 2 &&
                                        <UiButton className="shrink-0" severity="secondary" text size="small" onClick={() => {
                                            setDialogText(carData.options?.map(opt => opt.option_name).join(', '))
                                            setDialogTitle("Опции")
                                            setDialogVisible(true)
                                        }}>...</UiButton>
                                    } */}
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 items-center">{badge}</div>

                        </div>
                        <div className="col-span-3 flex flex-col px-8 justify-around text-slate-400">
                            <div className="flex flex-row gap-2 items-end ">
                                {carData.vin ? <>
                                    <p className="leading-4 text-base font-semibold">VIN</p>
                                    <p className="leading-3 text-xs">{carData.vin}</p>
                                </>
                                    :
                                    <p className="leading-3 text-xs">VIN не указан</p>
                                }
                            </div>
                            <div className="flex flex-row gap-2 items-end">
                                {carData.mileage ? <>
                                    <p className="leading-4 text-base font-semibold">{carData.mileage?.toLocaleString()} км</p>
                                    <p className="leading-3 text-xs">{carData.isMileageAbroad && '(без пробега по РФ)'}</p>
                                </>
                                    :
                                    <p className="leading-3 text-xs">Пробег не указан</p>
                                }
                            </div>
                            <div className="flex flex-row gap-2 items-end">
                                {carData.year ? <>
                                    <p className="leading-4 text-base font-semibold">{carData.year}</p>
                                    <p className="leading-3 text-xs">год</p>
                                </>
                                    :
                                    <p className="leading-3 text-xs">Год не указан</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 -my-4 -mr-4 relative">
                        <UiImage className="h-full" imgClassName={`rounded-l-none shadow-none ${carData.status === 'sold' && 'grayscale'} `} />
                        {showActions && <>
                            <UiButton className="!absolute top-4 right-4" severity="secondary" outlined size="small" onClick={(e) => op.current?.toggle(e)}><Ellipsis /></UiButton>
                            <UiOverlayPanel ref={op}>
                                <div className="flex flex-col items-start">
                                    <UiButton text onClick={() => setVisibleConfirmDelete(true)} ><TrashBin className="mr-1" />Удалить</UiButton>
                                    <CarDeleteConfirm
                                        car={carData}
                                        visibleConfirmDelete={visibleConfirmDelete}
                                        setVisibleConfirmDelete={setVisibleConfirmDelete}
                                        onSuccess={(data) => { }}
                                    />
                                </div>
                            </UiOverlayPanel>
                        </>}
                    </div>
                </div>
            </UiCard>

        </>
    )
}
