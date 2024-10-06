import { LotDto } from "@/shared/api/generated";
import UiButton from "@/shared/ui/UiButton";
import UiCard from "@/shared/ui/UiCard"
import UiDialog from "@/shared/ui/UiDialog";
import UiImage from "@/shared/ui/UiImage";
import { UILink } from "@/shared/ui/UiLink";
import { useRouter } from "next/navigation";

import { Chip } from "primereact/chip";
import { ReactNode, useState } from "react";
import { useStatus } from "../model/use-status";
import clsx from "clsx";
import { useNoun } from "@/shared/hooks/use-noun";
import { Calendar, Car, MapPin } from "@gravity-ui/icons";
import { useSessionQuery } from "@/entities/session";
import { useOffers } from "@/entities/offers/use-offers";
import { useOffersCreateTemplates } from "@/entities/offers/use-offers-create";
import { useOptionsDictionary } from "@/entities/catalog/use-options";
import { OptionsList } from "@/features/catalog/ui/options-list";


interface LotsListProps {
    carConfigurationText: string;
    carComplectationText: string;
    optionsStrict: any[];
    optionsWish: any[];
    configurationPhoto: string;
    isConfigurationPhotoPreview?: boolean;
    offersCount?: number;
    offersFitOptionsCount?: number;
    offersMinPrice?: number;
    lotId?: number;
    lotCreatedAt?: string;
    lotCityName?: string;
    lotCityMaxDistance?: number;
    titleLink?: string
    lot?: LotDto
}

function mapOptions(dict: any[], optionsAttrMap: any[]): Record<string, Record<string, any>> {
    const detailedOptions: Record<string, Record<string, any>> = {};
    for (const category of dict) {
        const optionsForCategory: Record<string, any> = {};
        for (const option of category.options) {
            const oam = optionsAttrMap.find(opt => (opt.option_name === option.value))
            if (oam) {
                optionsForCategory[option.value] = oam;
            }
        }
        if (Object.keys(optionsForCategory).length > 0) {
            detailedOptions[category.name] = optionsForCategory;
        }
    }
    return detailedOptions;
}

export function LotInfo({ carConfigurationText, carComplectationText, optionsStrict, optionsWish, configurationPhoto, isConfigurationPhotoPreview, lotId, lotCreatedAt, lotCityName, lotCityMaxDistance, offersCount = 0, offersFitOptionsCount = 0, offersMinPrice = 0, titleLink, lot }: LotsListProps) {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogText, setDialogText] = useState<string | ReactNode>('')
    const [dialogTitle, setDialogTitle] = useState('');
    const { data: sessionData } = useSessionQuery()
    const router = useRouter()
    const { badge, cardClassName, titleClassName } = useStatus({ lot })
    const { offers, isLoadingOffers } = useOffers({ lot_id: lot?.lot_uuid || '' })
    const { offersTemplates, isLoadingOffersTemplates } = useOffersCreateTemplates({ lot_id: lot?.lot_uuid })
    const { optionsDictionary, isLoading, isError, error } = useOptionsDictionary()

    const optionsNoun = useNoun(optionsStrict?.length - 1, 'опция', 'опции', 'опций');
    const ownOffersNoun = useNoun(offers?.filter(o => o.is_own).length || 0, 'моё', 'моих', 'моих');
    const offersNoun = useNoun(offersCount, 'предложение', 'предложения', 'предложений');
    const fittableNoun = useNoun(offersTemplates?.length || 0, 'подходящий', 'подходящих', 'подходящих');

    return (<>
        <UiDialog header={dialogTitle} visible={dialogVisible} style={{ width: '40vw' }} onHide={() => setDialogVisible(false)}>
            <div className="m-0">
                {dialogText}
            </div>
        </UiDialog>
        <div className="flex flex-col gap-4">

            <UiCard className={clsx("bg-seabrand-50 shadow-md", cardClassName)} >
                <div className="grid grid-cols-12 gap-4 ">
                    <div className="col-span-9 grid-cols-subgrid grid  gap-4 divide-x divide-seabrand-400">
                        <div className="col-span-6 flex flex-col gap-1 pr-8">
                            <div className="flex flex-row gap-4 items-center">
                                {titleLink ?
                                    lotId && <UILink className={clsx(titleClassName, "text-xl text-slate-900 font-semibold")} href={titleLink}>{`Аукцион №${lotId}`}</UILink>
                                    :
                                    lotId && <p className="text-xl text-slate-900  font-semibold">{`Аукцион №${lotId}`}</p>
                                }
                                {lotCreatedAt && <div className="flex flex-row items-center gap-1 text-slate-400"><Calendar /><span className="text-xs">{new Date(lotCreatedAt).toLocaleString()}</span></div>}
                                {lotCityName && <div className="flex flex-row items-center gap-1 text-slate-400"><MapPin /><p className="text-xs">{lotCityName}{lotCityMaxDistance && `, до ${lotCityMaxDistance} км`}</p></div>}
                            </div>
                            <p className={clsx(titleClassName, "text-base text-slate-700 font-semibold")}>{carConfigurationText}</p>
                            <div className="flex flex-row gap-1 items-center">
                                <div className="flex shrink overflow-hidden">
                                    <p className="text-sm text-slate-700 whitespace-nowrap min-w-1">{carComplectationText}</p>
                                </div>
                                {carComplectationText.length > 65 &&
                                    <UiButton className="shrink-0 -my-2" severity="secondary" text size="small" onClick={() => {
                                        setDialogText(carComplectationText)
                                        setDialogTitle("Комплектация")
                                        setDialogVisible(true)
                                    }}>...</UiButton>
                                }
                            </div>
                            <div className="flex flex-row gap-1 items-center text-sm">
                                <span>Обязательно:</span>
                                {!optionsStrict.length ? <p>Не указано</p>
                                    :
                                    <>
                                        <Chip
                                            unstyled
                                            label={optionsStrict[0]?.option_name}
                                            pt={{
                                                root: { className: 'bg-transparent p-0' },
                                                label: { className: 'text-sm text-slate-700 whitespace-nowrap overflow-hidden mt-0 mb-0' }
                                            }}
                                        />
                                        {optionsStrict.length > 1 && optionsDictionary && <>
                                            <span className="text-sm text-slate-700">и ещё</span>
                                            <UiButton className="shrink-0 !p-2 -ml-1 -my-2 !text-sm underline underline-offset-2 decoration-dotted" severity="secondary" text size="small" onClick={() => {
                                                //setDialogText(optionsStrict.map(opt => opt.option_name).join(', '))
                                                setDialogText(<OptionsList
                                                    showAsBlock={false}
                                                    optionsDict={mapOptions(optionsDictionary, optionsStrict)}
                                                />)
                                                setDialogTitle("Обязательные опции")
                                                setDialogVisible(true)
                                            }}>
                                                {optionsStrict?.length - 1} {optionsNoun}
                                            </UiButton>
                                        </>
                                        }
                                    </>
                                }
                            </div>
                            <div className="flex flex-row gap-1 items-center text-sm">
                                <span>Желательно:</span>
                                {!optionsWish.length ? <p>Не указано</p>
                                    :
                                    <>
                                        <Chip
                                            unstyled
                                            label={optionsWish[0]?.option_name}
                                            pt={{
                                                root: { className: 'bg-transparent p-0' },
                                                label: { className: 'text-sm text-slate-700 whitespace-nowrap overflow-hidden mt-0 mb-0' }
                                            }}
                                        />
                                        {optionsWish.length > 1 && optionsDictionary && <>
                                            <span className="text-sm text-slate-700">и ещё</span>
                                            <UiButton className="shrink-0 !p-2 -ml-1 -my-2 !text-sm underline underline-offset-2 decoration-dotted" severity="secondary" text size="small" onClick={() => {
                                                // setDialogText(optionsWish.map(opt => opt.option_name).join(', '))
                                                setDialogText(<OptionsList
                                                    showAsBlock={false}
                                                    optionsDict={mapOptions(optionsDictionary, optionsWish)}
                                                />)
                                                setDialogTitle("Желательные опции")
                                                setDialogVisible(true)
                                            }}>
                                                {optionsWish?.length - 1} {optionsNoun}
                                            </UiButton>
                                        </>
                                        }
                                    </>
                                }
                            </div>
                            <div className="flex flex-row gap-4 items-center text-xs">
                                {badge}
                            </div>
                        </div>
                        <div className="col-span-3 flex flex-col gap-2 px-8 py-4">
                            <div className="flex flex-row  items-center gap-4">
                                <p className="text-sm text-slate-400 "><span className="text-xl font-semibold">{offersCount}</span> {offersNoun}</p>
                                {sessionData?.type === 'seller' && <>
                                    <p className="text-slate-400 text-xl">/</p>
                                    <p className="text-seabrand-600"><span className="text-xl font-semibold">{offers?.filter(o => o.is_own).length || 0}</span> {ownOffersNoun}</p>
                                </>}
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm text-slate-400 ">{offersFitOptionsCount} со 100% соответствием</p>
                            </div>
                            {offersCount > 0 &&
                                < div className="flex flex-row gap-2 items-baseline">
                                    <p className="text-sm text-slate-400 ">от</p>
                                    <p className="text-xl text-slate-700 font-semibold">{offersMinPrice.toLocaleString()} &#8381;</p>
                                </div>
                            }

                            {sessionData?.type === 'seller' && <>
                                <div className={clsx(
                                    `flex flex-row items-center text-xs gap-1`,
                                    offersTemplates?.length === 0 ? 'text-slate-400' : 'text-green-600 '
                                )}>
                                    <Car />
                                    <p className="">{offers && offers?.filter(o => o.is_own).length > 0 ? 'Ещё ' : ''}{offersTemplates?.length || 0} {fittableNoun}</p>
                                </div>
                            </>}
                        </div>
                    </div>
                    <div className="col-span-3 -my-4 -mr-4">
                        <UiImage className="h-full max-h-48" {...(isConfigurationPhotoPreview ? { preview: true } : {})} imgClassName="shadow-none !rounded-l-none" imgBase64={configurationPhoto} />
                    </div>
                </div>
            </UiCard >
        </div >
    </>)
}