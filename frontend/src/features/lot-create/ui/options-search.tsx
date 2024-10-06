"use client"

import { ComplectationWithOptionsDto, OptionsAttrMapCategoryDictionaryDto } from "@/shared/api/generated";
import UiButton from "@/shared/ui/UiButton";
import UiCheckbox from "@/shared/ui/UiCheckbox";
import UiChip from "@/shared/ui/UiChip";
import UiDialog from "@/shared/ui/UiDialog";
import UiTooltipIcon from "@/shared/ui/UiTooltip";
import { useEffect, useState } from "react";

interface OptionsSearchProps {
    options: OptionsAttrMapCategoryDictionaryDto;
    required?: boolean;
    additional?: boolean;
    initialSelectedOptions?: { [key: string]: OptionsAttrMapDto };
    blockedOptions?: { [key: string]: OptionsAttrMapDto };
    onOptionsSelected?: (selectedOptions: any) => void;
    complectations?: ComplectationWithOptionsDto[]
}

interface OptionsAttrMapDto {
    id: string;
    option_id: string;
    value: string;
    value_type: string;
    option_name: string;

}

const OptionsSearchWidget: React.FC<OptionsSearchProps> = ({ options, required = false, additional = false, initialSelectedOptions, blockedOptions = {}, complectations, onOptionsSelected }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialigSelectedOptions, setDialogSelectedOptions] = useState<{ [key: string]: OptionsAttrMapDto }>({});
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: OptionsAttrMapDto }>(initialSelectedOptions || {});

    useEffect(() => {
        setSelectedOptions(initialSelectedOptions || {});
    }, [initialSelectedOptions]);

    const handleCheckboxChange = (optionKey: string, optionValue: OptionsAttrMapDto, isChecked: boolean) => {
        const updatedSelectedOptions = { ...dialigSelectedOptions };
        if (isChecked) {
            updatedSelectedOptions[optionKey] = optionValue;
        } else {
            delete updatedSelectedOptions[optionKey];
        }
        setDialogSelectedOptions(updatedSelectedOptions);
    };

    const handleDialogOpen = () => {
        setDialogSelectedOptions(selectedOptions)
        setDialogVisible(true)
    }

    const handleDialogClose = () => {
        setDialogVisible(false);
        setSelectedOptions(dialigSelectedOptions);
        if (onOptionsSelected) {
            onOptionsSelected(dialigSelectedOptions);
        }
    };
    const handleComplectationSelect = (complectationOptions: OptionsAttrMapCategoryDictionaryDto) => {
        // Явно указываем тип для updatedSelectedOptions
        const updatedSelectedOptions: Record<string, OptionsAttrMapDto> = {};

        Object.entries(complectationOptions).forEach(([groupName, optionItems]) => {
            Object.entries(optionItems).forEach(([optionKey, optionParam]) => {
                console.log(optionParam)
                const option = optionParam as OptionsAttrMapDto;
                if (option.value === '1') {
                    updatedSelectedOptions[optionKey] = option;
                }
            });
        });

        setDialogSelectedOptions(updatedSelectedOptions);
    };

    return (
        <>
            {required &&
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Добавьте важные опции авто</p>
                    <UiTooltipIcon text={`Дилер предложит вам автомобиль \nс этими характеристиками`} />
                </div>
            }
            {additional &&
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Дополнительные опции</p>
                    <UiTooltipIcon text={`Добавьте дополнительные опции вашего авто - \nэто поможет более точно подобрать подходящие аукционы `} />
                </div>
            }
            {!required && !additional &&
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">Добавьте желательные опции</p>
                    <UiTooltipIcon text={`Это поможет дилеру подобрать \nнаилучший автомобиль для вас`} />
                </div>
            }

            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row flex-wrap gap-2 items-center">
                    {Object.entries(selectedOptions).map(([key], index) => (
                        <UiChip key={index} label={key} removable onRemove={() => {
                            const updatedSelectedOptions = { ...selectedOptions };
                            delete updatedSelectedOptions[key];
                            setSelectedOptions(updatedSelectedOptions);
                        }} />
                    ))}
                    <UiButton className="" outlined size="small" severity="secondary" onClick={handleDialogOpen}>Добавить</UiButton>
                </div>
            </div>
            <UiDialog
                header={`Выбор ${required ? 'обязательных': additional ? 'дополнительных' : 'желательных'} опций`}
                visible={dialogVisible}
                style={{ width: '60vw' }}
                onHide={() => setDialogVisible(false)}
                footer={
                    <UiButton className="mt-2" onClick={handleDialogClose}>
                        Продолжить
                    </UiButton>
                }
            >
                <div className="flex flex-col">
                    <div className="flex flex-row flex-wrap gap-2">
                        <UiButton
                            className="outlined" size="small" severity="secondary"
                            onClick={() => setDialogSelectedOptions({})}>
                            Сбросить
                        </UiButton>
                        {complectations?.map((complectation, index) => (
                            <UiButton
                                key={index}
                                className="outlined" size="small" severity="secondary"
                                onClick={() => handleComplectationSelect(complectation.options)}>
                                {complectation.groupName}
                            </UiButton>
                        ))}

                    </div>
                    <div className='mt-6 grid grid-cols-3 grid-flow-row-dense gap-4'>
                        {Object.entries(options).map(([groupName, optionItems]) => (
                            <div key={groupName}>
                                <h3 className='text-lg font-semibold mb-2'>{groupName}</h3>
                                {Object.entries(optionItems).map(([optionKey, value], index) => (
                                    <div key={index} className='text-sm py-1'>
                                        <UiCheckbox
                                            text={optionKey}
                                            checkboxId={String((value as OptionsAttrMapDto).id)}
                                            checked={!!dialigSelectedOptions[optionKey]}
                                            tooltip={!!blockedOptions[optionKey] && `Опция уже выбрана как ${required ? 'желательная': additional ? 'дополнительная' : 'обязательная'}`}
                                            disabled={!!blockedOptions[optionKey]}
                                            onChange={(e) => handleCheckboxChange(optionKey, value as OptionsAttrMapDto, e.target.checked as boolean)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

            </UiDialog>
        </>
    )
}

export default OptionsSearchWidget