
import UiInput from '@/shared/ui/UiInput';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UiSelect from '@/shared/ui/UiSelect';
import { ConfigurationDto, GenerationDto, MarkDto, ModelDto, ModificationDto } from '@/shared/api/generated';

interface SearchWidgetProps {
    visibleFilters?: string;
    onSearchBrand?: (value: string) => void;
    onSearchModel?: (value: string) => void;
    onSearchGeneration?: (value: string) => void;
    onSearchConfigurations?: (value: string) => void;
    onSearchComplectations?: (value: string) => void;
    selectedBrand?: MarkDto;
    selectedModel?: ModelDto;
    selectedGeneration?: string;
    generations?: GenerationDto[];
    selectedConfiguration?: string;
    configurations?: ConfigurationDto[];
    selectedComplectation?: string;
    complectations?: ModificationDto[];
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
    visibleFilters = '',
    onSearchBrand,
    onSearchModel,
    selectedBrand,
    selectedModel,
    selectedGeneration,
    generations = [],
    selectedConfiguration,
    selectedComplectation,
    complectations = []
}) => {

    const isFilterVisible = (filterName: string) => {
        const filtersToShow = visibleFilters.split(',');
        const filtersArray = filtersToShow.filter(item => item.trim());
        return filtersArray.length === 0 || filtersArray.includes(filterName);
    };

    const router = useRouter();
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [generation, setGeneration] = useState('')
    const [configuration, setConfiguration] = useState('')
    const [complectation, setComplectation] = useState('')

    useEffect(() => {
        if (selectedBrand && !onSearchBrand) {
            setBrand(selectedBrand?.name)
        }
    }, [selectedBrand, onSearchBrand])

    useEffect(() => {
        if (selectedModel && !onSearchModel) {
            setModel(selectedModel?.name)
        }
    }, [selectedModel, onSearchModel])

    useEffect(() => {
        if (selectedGeneration && selectedModel && selectedBrand) {
            setGeneration(selectedGeneration)
        }
    }, [selectedGeneration])

    useEffect(() => {
        if (selectedConfiguration) {
            setConfiguration(selectedConfiguration)
        }
    }, [selectedConfiguration])

    useEffect(() => {
        if (selectedComplectation && selectedGeneration && selectedModel && selectedBrand) {
            setComplectation(selectedComplectation)
        }
    }, [selectedComplectation])

    const handleNavToBrands = () => {
        router.push(`/catalog`)
    }
    const handleNavToModels = () => {
        router.push(`/catalog/${selectedBrand?.id}`)
    }
    const handleNavToGenerations = () => {
        router.push(`/catalog/${selectedBrand?.id}/${selectedModel?.id}`)
    }
    const handleNavToConfigurations = () => {
        router.push(`/catalog/${selectedBrand?.id}/${selectedModel?.id}/${selectedGeneration}`)
    }
    const handleNavToComplectations = () => {
        router.push(`/catalog/${selectedBrand?.id}/${selectedModel?.id}/${generation}/${configuration}`)
    }

    return (
        <div className='pt-8 my-2 grid grid-cols-12 gap-2.5'>
            {isFilterVisible('brands') && (
                <div className={`${!isFilterVisible('models') ? 'col-span-6' : 'col-span-3'}`}>
                    <UiInput
                        placeholder="Введите или выберите"
                        label="Марка"
                        suggested={true}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            setBrand(e.currentTarget.value)
                            if (onSearchBrand) {
                                onSearchBrand(e.currentTarget.value);
                            }
                        }}
                        value={brand}
                        showClear={!onSearchBrand && !!brand}
                        onClear={() => handleNavToBrands()}
                        disabled={!onSearchBrand && !brand}
                        readOnly={!onSearchBrand && !!brand}
                    />
                </div>
            )}

            {isFilterVisible('models') && (
                <div className='col-span-4'>
                    <UiInput
                        placeholder={(!onSearchModel && !model) ? '' : "Введите или выберите"}
                        label="Модель"
                        suggested={true}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            setModel(e.currentTarget.value);
                            if (onSearchModel) {
                                onSearchModel(e.currentTarget.value);
                            }
                        }}
                        value={model}
                        showClear={!onSearchModel && !!model}
                        onClear={() => handleNavToModels()}
                        disabled={!onSearchModel && !model}
                        readOnly={!onSearchModel && !!model}
                    />
                </div>
            )}

            {isFilterVisible('generations') && (
                <div className='col-span-5'>
                    <UiSelect
                        placeholder="Выберите поколение"
                        label="Поколение и кузов"
                        suggested={true}
                        onChange={async (value: string) => {
                            const genId = value.split("_")[0];
                            const confId = value.split("_")[1];
                            await setGeneration(genId);
                            await setConfiguration(confId);
                            router.push(`/catalog/${selectedBrand?.id}/${selectedModel?.id}/${genId}/${confId}`)
                        }}
                        value={`${generation}_${configuration}`}
                        showClear={!!selectedBrand && !!selectedModel && !!generation}
                        onClear={() => handleNavToGenerations()}
                        disabled={!selectedModel && !generation}
                        readOnly={!!selectedBrand && !!selectedModel && !!generation}
                        optionLabel="label"
                        options={generations.flatMap(generation =>
                            generation.configurations.map(configuration => ({
                                value: [generation.id, configuration.id].join('_'),
                                label: [
                                    generation.yearStart,
                                    '-',
                                    generation.yearStop || 'н.в.',
                                    generation.name,
                                    ',',
                                    configuration.bodyType
                                ].join(' ')
                            }))
                        )}
                    />
                </div>
            )}

            {isFilterVisible('complectations') && (
                <div className='col-span-12'>
                    <UiSelect
                        className='col-span-12'
                        placeholder="Выберите комплектацию"
                        label="Комплектация"
                        suggested={true}
                        onChange={(value: string) => {
                            setComplectation(value);
                            router.push(`/catalog/${selectedBrand?.id}/${selectedModel?.id}/${generation}/${configuration}/${value}`)
                        }}
                        value={complectation}
                        showClear={!!selectedComplectation && !!selectedGeneration && !!selectedModel && !!selectedBrand && !!complectation}
                        onClear={() => handleNavToComplectations()}
                        disabled={!selectedConfiguration || !selectedGeneration || !selectedModel || !selectedBrand}
                        // readOnly={!!selectedConfiguration && !!selectedGeneration && !!selectedModel && !!selectedBrand && !!complectation}
                        options={complectations?.map((compl) => ({
                            value: compl.id,
                            label: [
                                compl.groupName,
                                `${compl.engineType} ${compl.volumeLitres?compl.volumeLitres?.toFixed(1):''}, ${compl.horsePower} л.с.`,
                                compl.transmission,
                                compl.drive
                            ].filter(part => part && part.trim().length > 0).join(" / ")
                        }))}
                    />
                </div>
            )}

        </div >
    );
};
