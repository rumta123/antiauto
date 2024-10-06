import { UiButton, UiDialog, UiInput, UiSelect, UiSpinner, UiTabMenu } from "@/shared/ui";
import { useEffect, useState } from "react";
import { CarsTable } from "./cars-table";
import { useDealersCars } from "@/entities/dealers-cars/use-dealers-cars";
import { BrandSelector } from "@/features/catalog/ui/brand-selector";
import { ModelSelector } from "@/features/catalog/ui/model-selector";
import { useGenerations } from "@/entities/catalog/use-generations";
import { GenerationsConfigurationsList } from "@/features/catalog/ui/gen-conf-list";
import { DealersCarDto, GenerationDto } from "@/shared/api/generated";


interface SelectCarDialogProps {
    onSelected: (data: any) => void
}
export function SelectCarDialog({ onSelected }: SelectCarDialogProps) {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [viewState, setViewState] = useState<'catalog' | 'cars'>('catalog')
    const { cars, isLoading, isError, error } = useDealersCars({ only_filled: true })
    const [selectedCar, setSelectedCar] = useState<DealersCarDto | null>(null)
    const [selectedCatalogData, setSelectedCatalogData] = useState<{ brand?: any, model?: any, generation?: any, configuration?: any } | null>(null)

    const [searchBrand, setSearchBrand] = useState('');
    const [searchModel, setSearchModel] = useState('');
    const { generations = [] } = useGenerations(selectedCatalogData?.brand?.id, selectedCatalogData?.model?.id);
    const [genList, setGenList] = useState<any[]>([])

    useEffect(() => {
        if (selectedCatalogData?.brand?.id && selectedCatalogData?.model?.id) {
            const flatgen = generations.flatMap(generation =>
                generation.configurations.map(configuration => ({
                    value: [generation.id, configuration.id].join('_'),
                    label: [
                        generation.yearStart, '-', generation.yearStop || 'н.в.', generation.name, ',', configuration.bodyType, configuration.notice
                    ].join(' ')
                }))
            )
            setGenList(flatgen)
        }
    }, [generations, selectedCatalogData?.brand?.id, selectedCatalogData?.model?.id])


    const tabItems = [
        { id: 'catalog', label: 'Из каталога', command: () => setViewState('catalog') },
        { id: 'cars', label: 'Из базы автомобилей', command: () => setViewState('cars') },
    ]
    const getButtonLabel = () => {
        if (viewState === 'catalog' && selectedCatalogData) {
            const genConfText = genList.find(gc => gc.value === [selectedCatalogData.generation?.id, selectedCatalogData.configuration?.id].join('_'))?.label || ''
            return `Фильтр по каталогу: ${selectedCatalogData.brand?.name} ${selectedCatalogData.model?.name || ''} ${genConfText}`
        } else if (viewState === 'cars' && !!selectedCar) {
            return `Автомобиль из базы ${selectedCar.brand} ${selectedCar.model}`
        } else {
            return `Фильтрация по автомобилю`
        }
    }
    const getButtonTooltip = () => {
        if (viewState === 'catalog' && selectedCatalogData) {
            const genConfText = genList.find(gc => gc.value === [selectedCatalogData.generation?.id, selectedCatalogData.configuration?.id].join('_'))?.label || ''
            return `Фильтр по каталогу: ${selectedCatalogData.brand?.name} ${selectedCatalogData.model?.name || ''} ${genConfText}`
        } else if (viewState === 'cars' && !!selectedCar) {
            return `Фильтр по автомобилю из базы №${selectedCar.sequence} ${selectedCar.brand} ${selectedCar.model} ${selectedCar.configuration} VIN ${selectedCar.vin}`
        } else {
            return ``
        }
    }
    return (
        <>
            <UiButton className="min-w-72 !text-start" outlined size="small" onClick={() => setDialogVisible(true)} label={getButtonLabel()}
                tooltipOptions={{ position: 'bottom' }}
                tooltip={getButtonTooltip()}
            />
            
            <UiDialog header='Фильтрация по автомобилю' closable={false} visible={dialogVisible}
                pt={{
                    root: { className: 'w-[80vw]' },
                    content: { className: 'h-96' }
                }}
                footer={<div className="flex flex-row gap-2 justify-self-start pt-4">
                    <UiButton severity="secondary" outlined onClick={() => {
                        setSelectedCar(null);
                        setSelectedCatalogData(null)
                        if (viewState === 'cars') {
                            onSelected({ type: 'car', selectedCar: undefined, selectedCatalogData: undefined })
                        } else {
                            onSelected({ type: 'catalog', selectedCar: undefined, selectedCatalogData: undefined })
                        }
                        setDialogVisible(false)
                    }}>Сбросить</UiButton>
                    <UiButton
                        className="justify-self-start"
                        onClick={() => {
                            if (viewState === 'cars' && !!selectedCar) {
                                onSelected({ type: 'car', selectedCar, selectedCatalogData: undefined })
                            } else if (viewState === 'catalog' && !!selectedCatalogData) {
                                onSelected({ type: 'catalog', selectedCar: undefined, selectedCatalogData })
                            }
                            setDialogVisible(false)
                        }}
                    >Продолжить</UiButton>
                </div>} onHide={() => setDialogVisible(false)}>
                <UiTabMenu model={tabItems} activeIndex={tabItems.findIndex(item => item.id === viewState)} />
                {viewState === 'catalog' && (
                    <div className="pt-4 flex flex-col gap-2">
                        <div className="grid grid-cols-12 gap-2">
                            <UiInput className="col-span-3" placeholder="Введите или выберите" label="Марка" suggested={true}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => { setSearchBrand(e.currentTarget.value); }}
                                value={selectedCatalogData?.brand.name || ''}
                                showClear={!!selectedCatalogData?.brand} readOnly={!!selectedCatalogData?.brand}
                                onClear={() => { setSelectedCatalogData({ ...selectedCatalogData, brand: { name: '' }, model: { name: '' } }); setSelectedCatalogData(null) }}
                            />
                            <UiInput className="col-span-3" placeholder={(!selectedCatalogData?.model) ? '' : "Введите или выберите"} label="Модель" suggested={true}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => { setSearchModel(e.currentTarget.value); }}
                                value={selectedCatalogData?.model?.name || ''}
                                showClear={!!selectedCatalogData?.model} readOnly={!!selectedCatalogData?.model}
                                onClear={() => { setSelectedCatalogData({ ...selectedCatalogData, model: { name: '' } }); setSelectedCatalogData({ ...selectedCatalogData, model: null, generation: undefined, configuration: undefined }); setSearchModel('') }}
                                disabled={!selectedCatalogData?.brand}
                            />
                            <UiSelect className="col-span-6" placeholder="Выберите поколение" label="Поколение и кузов" suggested={true}
                                onChange={async (value: string) => {
                                    const [genId, confId] = value.split("_");
                                    setSelectedCatalogData({ ...selectedCatalogData, generation: { id: genId }, configuration: { id: confId } })
                                }}
                                value={`${selectedCatalogData?.generation?.id}_${selectedCatalogData?.configuration?.id}` || ''}
                                showClear={!!selectedCatalogData?.brand && !!selectedCatalogData?.model && !!selectedCatalogData.generation}
                                onClear={() => { setSelectedCatalogData({ ...selectedCatalogData, generation: undefined, configuration: undefined }) }}
                                disabled={!selectedCatalogData?.model}
                                readOnly={!!selectedCatalogData?.brand && !!selectedCatalogData?.model && !!selectedCatalogData?.generation}
                                optionLabel="label"
                                options={genList}
                            />
                        </div>
                        {!selectedCatalogData?.brand?.id && <BrandSelector searchBrand={searchBrand}
                            onSelectBrand={(brand) => {
                                setSelectedCatalogData({ ...selectedCatalogData, brand });
                            }} />}
                        {selectedCatalogData?.brand?.id && !selectedCatalogData?.model?.id && <ModelSelector searchModel={searchModel}
                            brandId={selectedCatalogData?.brand?.id}
                            onSelectModel={(model) => { setSelectedCatalogData({ ...selectedCatalogData, model }); }}
                        />}
                        {selectedCatalogData?.brand?.id && selectedCatalogData?.model?.id && !selectedCatalogData?.generation?.id && <GenerationsConfigurationsList
                            generations={generations}
                            onSelect={(generation, configuration) => {
                                setSelectedCatalogData({ ...selectedCatalogData, generation: { id: generation.id }, configuration: { id: configuration.id } })
                            }} />}
                    </div>
                )}
                {viewState === 'cars' && (
                    isLoading ?
                        <UiSpinner />
                        :
                        isError ?
                            <div>Error: {error?.message}</div>
                            :
                            <CarsTable carItems={cars} selectable selectedCar={selectedCar} setSelectedCar={setSelectedCar} />
                )}

            </UiDialog>
        </>
    )
}