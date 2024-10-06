import { useOptionsDictionary } from "@/entities/catalog/use-options";
import { OptionsList } from "@/features/catalog/ui/options-list";
import { OfferOptionDto } from "@/shared/api/generated";
import UiButton from "@/shared/ui/UiButton";
import UiChip from "@/shared/ui/UiChip";
import UiDialog from "@/shared/ui/UiDialog";
import { useState } from "react";

interface AccordanceOptionsProps {
    options: OfferOptionDto[]
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

export function AccordanceOptions({ options }: AccordanceOptionsProps) {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogOptions, setDialogOptions] = useState<any[]>([])
    const handleShowOptions = (options: any[]) => {
        setDialogVisible(true);
        setDialogOptions(options)
    }
    const { optionsDictionary, isLoading, isError, error } = useOptionsDictionary()

    return <>
        <UiDialog header="Опции" visible={dialogVisible} style={{ width: '60vw' }} onHide={() => setDialogVisible(false)}>
            {!!optionsDictionary && <>
                <div className="flex flex-col gap-4 ">
                    {!!options.filter(opt => opt.accordance_type === "unsatisfied").length &&

                        <OptionsList
                            title="Отсутствуют"
                            optionsDict={mapOptions(optionsDictionary, options.filter(opt => opt.accordance_type === "unsatisfied"))}
                            showAsBlock={false}
                        />
                    }

                    {!!options.filter(opt => opt.accordance_type === "satisfied").length &&
                        <OptionsList
                            title="Совпали"
                            optionsDict={mapOptions(optionsDictionary, options.filter(opt => opt.accordance_type === "satisfied"))}
                            showAsBlock={false}
                        />
                    }

                    {!!options.filter(opt => opt.accordance_type === "additional").length &&
                        <OptionsList
                            title="Дополнительные"
                            optionsDict={mapOptions(optionsDictionary, options.filter(opt => opt.accordance_type === "additional"))}
                            showAsBlock={false}
                        />
                    }
                </div>
            </>}
        </UiDialog>
        <div className="flex flex-col gap-1">
            <div className="flex flex-row flex-wrap gap-1 overflow-hidden max-h-[5.1rem]">
                {options.map(option => (
                    <UiChip
                        key={option.combined_option_id}
                        label={option.option_name}
                        pt={{
                            label: { className: 'text-xxs' }
                        }}
                        className={` ${option.accordance_type === 'unsatisfied' ? '!bg-red-100 !text-red-900 line-through'
                            : option.accordance_type === 'satisfied' ? '!bg-green-100 !text-green-900'
                                : '!bg-blue-100 !text-blue-900'
                            }`} />
                ))}
            </div>
            {!!options.length ? 
                <div><UiButton size="small" text onClick={() => handleShowOptions(options)}>Посмотреть все</UiButton></div>
                : <p className="text-xs text-slate-400">Для данного автомобиля опции не предусмотрены производителем.</p>
            }
        </div>
    </>
}