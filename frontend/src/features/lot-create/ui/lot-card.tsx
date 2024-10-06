"use client"
import UiCityTag from "@/shared/ui/UiCityTag";
import UiImage from "@/shared/ui/UiImage";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { useNoun } from "@/shared/hooks/use-noun"

interface LotCardProps {
    brand: string;
    brand_logo?: string;
    model?: string;
    generation_configuration?: string;
    complectation?: string;
    options?: any;
    additionalOptions?: any;
    city?: string;
}
export function LotCard({ brand, brand_logo, model, generation_configuration, complectation, options, additionalOptions, city }: LotCardProps) {
    const optionsCount = options ? Object.keys(options).length - 1 : 0;
    const additionalOptionsCount = additionalOptions ? Object.keys(additionalOptions).length - 1 : 0;
    const optionsNoun = useNoun(optionsCount, 'опция', 'опции', 'опций');
    const additionalOptionsNoun = useNoun(additionalOptionsCount, 'опция', 'опции', 'опций');

    return (
        <div className="rounded-lg flex flex-row bg-seabrand-50 shadow-sm ">
            <div className="w-full flex flex-row  items-center">
                <div className="grow ">
                    <div className="flex flex-col grow px-6 py-4">
                        <div className="flex flex-row gap-x-4 items-center text-xl font-bold pb-2">
                            <p className="text-nowrap">{brand}</p>
                            {model?.length ?
                                <p className="text-nowrap">{model}</p>
                                :
                                <Skeleton className="mt-2 bg-seabrand-200" width="10rem" />
                            }
                            {generation_configuration?.length ?
                                <p className="text-nowrap">{generation_configuration}</p>
                                :
                                <Skeleton className="mt-2 bg-seabrand-200" width="16rem" />
                            }
                        </div>
                        {complectation?.length ?
                            <div className="text-sm">{complectation}</div>
                            :
                            <div className="flex flex-col ">
                                <Skeleton className="mt-2 bg-seabrand-200" width="100%" height="0.7rem" />
                                <Skeleton className="mt-2 bg-seabrand-200" width="100%" height="0.7rem" />
                            </div>
                        }

                        {options && Object.keys(options)?.length ?
                            <div className="flex flex-row items-center overflow-hidden ">
                                <span className="text-sm  text-ellipsis  overflow-hidden">Обязательно: {Object.keys(options)[0]}
                                    {Object.keys(options).length > 1 &&
                                        <span> и ещё <>
                                            <Tooltip target=".options-tooltip-target" />
                                            <span
                                                data-pr-tooltip={ Object.keys(options).splice(1).join(', ')}
                                                data-pr-position="right"
                                                data-pr-at="right+5 top"
                                                data-pr-my="left center-2"
                                                    className="options-tooltip-target underline underline-offset-2 decoration-dotted">{Object.keys(options).length - 1} {optionsNoun}</span>
                                            </>
                                        </span>
                                    }
                                </span>

                            </div>
                            :
                            <Skeleton className="mt-2 bg-seabrand-200" width="100%" height="0.7rem" />
                        }
                        {!!additionalOptions && !!Object.keys(additionalOptions)?.length &&
                            <div className="flex flex-row items-center overflow-hidden ">
                                <span className="text-sm  text-ellipsis  overflow-hidden">Желательно: {Object.keys(additionalOptions)[0]}
                                    {Object.keys(additionalOptions).length > 1 &&
                                        <span> и ещё <>
                                            <Tooltip target=".options-tooltip-target" />
                                            <span
                                                data-pr-tooltip={ Object.keys(additionalOptions).splice(1).join(', ')}
                                                data-pr-position="right"
                                                data-pr-at="right+5 top"
                                                data-pr-my="left center-2"
                                                    className="options-tooltip-target underline underline-offset-2 decoration-dotted">{Object.keys(additionalOptions).length - 1} {additionalOptionsNoun}</span>
                                            </>
                                        </span>
                                    }
                                </span>

                            </div>
                        }

                        {!!city?.length ?
                            <div><UiCityTag text={city} /></div>
                            :
                            <Skeleton className="mt-2 bg-seabrand-200" width="12rem" />
                        }
                    </div>
                </div>
                <div className="shrink-0 flex items-center">
                    <UiImage className=" py-6 pr-6  !w-40" imgBase64={brand_logo} />
                </div>

            </div>
        </div>
    )
}