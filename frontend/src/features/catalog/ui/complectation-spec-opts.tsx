import { useDetailedComplectation } from "@/entities/catalog/use-detailed-complectation";
import { useOptionsByEngineHash } from "@/entities/catalog/use-options";
import OptionsSearchWidget from "@/features/lot-create/ui/options-search";
import { useEffect } from "react";
import { CarSpecification } from "./car-specification";
import { OptionsList } from "./options-list";

interface ComplectationSpecOptsProps {
    brandId: string;
    modelId: string;
    generationId: string;
    configurationId: string;
    complectationId: string;
    engineHash: string;
    selectedPossibleOptions?:  { [key: string]: any }
    setSelectedPossibleOptions?: (selectedOptions: any) => void
    setSelectedDefaultOptions?: (selectedOptions: any) => void
}

interface OptionsAttrMapDto {
    id: string;
    option_id: string;
    value: string;
    value_type: string;
    option_name: string;

}

export function ComplectationSpecOpts({ brandId, modelId, generationId, configurationId, complectationId, engineHash, selectedPossibleOptions, setSelectedPossibleOptions, setSelectedDefaultOptions }: ComplectationSpecOptsProps) {
    const { detailedComplectation, isLoading, isError, error } = useDetailedComplectation(brandId, modelId, generationId, configurationId, complectationId);
    const { options: defaultOptions, isLoading: isOptionsLoading, isError: isOptionsError, error: optionsError } = useOptionsByEngineHash(engineHash, { complectationId: complectationId, part: 'default' })
    const { options: possibleOptions, isLoading: isPossibleOptionsLoading, isError: isPossibleOptionsError, error: possibleOptionsError } = useOptionsByEngineHash(engineHash, { complectationId: complectationId, part: 'paid' })

    useEffect(() => {
        if (setSelectedDefaultOptions && defaultOptions) {
            const updatedDefaultOptions: Record<string, OptionsAttrMapDto> = {};
            Object.entries(defaultOptions).forEach(([groupName, optionItems]) => {
                Object.entries(optionItems).forEach(([optionKey, optionParam]) => {
                    const option = optionParam as OptionsAttrMapDto;
                    updatedDefaultOptions[optionKey] = option;
                });
            });
            setSelectedDefaultOptions(updatedDefaultOptions);
        }
    }, [defaultOptions, setSelectedDefaultOptions]);

    const handlePossibleOptionsSelected = (selectedOptions: any) => {
        setSelectedPossibleOptions && setSelectedPossibleOptions(selectedOptions);
    };
    return (
        <div className='flex flex-col gap-y-2 gap-x-8 mt-4'>
            <CarSpecification detailedComplectation={detailedComplectation} />

            {defaultOptions && !!Object.entries(defaultOptions).length &&
                <OptionsList optionsDict={defaultOptions}>
                    <div className="flex flex-row gap-2 mt-6">
                        <OptionsSearchWidget options={possibleOptions ? possibleOptions : {}} initialSelectedOptions={selectedPossibleOptions} onOptionsSelected={handlePossibleOptionsSelected} additional />
                    </div>
                </OptionsList>
            }
        </div>
    )
}