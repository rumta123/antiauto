import { citiesControllerGetCities, CityDto, ConfigurationDto, GenerationDto, ModificationDto, PatchDealersCarDto } from "@/shared/api/generated";
import { UiAutoComplete, UiCard, UiInput, UiInputNumber, UiSelect } from "@/shared/ui";
import UiCheckbox from "@/shared/ui/UiCheckbox";
import { useEffect, useState } from "react";

interface ExtendedPatchCarData extends PatchDealersCarDto {
    brand_name?: string;
    model_name?: string;
    generation?: GenerationDto;
    configuration?: ConfigurationDto;
    complectation?: ModificationDto;
}
interface PatchCarProps {
    setSearchBrand: (value: string) => void;
    setSearchModel: (value: string) => void;

    carData: ExtendedPatchCarData;
    setCarData: (carData: ExtendedPatchCarData) => void;
    generations?: GenerationDto[];
    complectations?: ModificationDto[];
    setEngineHash?: (value: string) => void;
    setComplectationId?: (value: string) => void;

}
export function PatchCarForm({
    carData, setCarData,
    setSearchBrand,
    setSearchModel,
    generations,
    complectations,
    setEngineHash,
    setComplectationId
}: PatchCarProps) {

    const [cityQuery, setCityQuery] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<CityDto[]>([]);
    const [genYears, setGenYears] = useState<any[]>([])
    useEffect(() => { if (carData?.city_name) { setCityQuery(carData.city_name) } }, [carData?.city_name])
    useEffect(() => {
        if (!!carData.generation_id && carData.generation) {
            let years = []
            const gen = carData.generation
            const yearStart = !!gen?.yearStart ? gen?.yearStart : new Date().getFullYear()
            const yearStop = !!gen?.yearStop ? gen?.yearStop : new Date().getFullYear()
            for (let year = yearStart; year <= yearStop; year++) {
                years.push({ value: year, label: `${year}` });
            }
            setGenYears(years)
        }
    }, [carData.generation_id, carData.generation])
    const fetchCities = async (query: string) => {
        try {
            const response = await citiesControllerGetCities({ name: query });
            setCitySuggestions(response);
        } catch (error) {
            console.error("Ошибка при получении городов:", error);
        }
    };
    return (<>
        <UiCard className="p-6 bg-seabrand-50">
            <div className="grid grid-cols-12 gap-4">
                <UiInput className="col-span-4"
                    placeholder="Введите или выберите"
                    label="Марка"
                    suggested={true}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setCarData({ ...carData, brand_name: e.currentTarget.value })
                        setSearchBrand(e.currentTarget.value)
                    }}
                    value={carData?.brand_name || ''}
                    showClear={!!carData?.brand_id}
                    onClear={() => {
                        setSearchBrand(''); setSearchModel('');
                        setCarData({ ...carData, brand_id: '', brand_name: '', model_id: '', model_name: '', generation_id: '', configuration_id: '', complectation_id: '', engine_hash: '', year: 0 })
                    }}
                    readOnly={!!carData?.brand_id}
                />
                <UiInput className="col-span-4" placeholder={(!carData?.brand_id) ? '' : "Введите или выберите"} label="Модель" suggested={true}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => { setCarData({ ...carData, model_name: e.currentTarget.value }); setSearchModel(e.currentTarget.value); }}
                    value={carData?.model_name || ''}
                    showClear={!!carData?.model_id}
                    onClear={() => {
                        setSearchModel('');
                        setCarData({ ...carData, model_id: '', generation_id: '', configuration_id: '', complectation_id: '', engine_hash: '', year: 0 })
                    }}
                    disabled={!carData?.brand_id}
                    readOnly={!!carData?.model_id}
                />
                <UiSelect className="col-span-4" placeholder="Выберите поколение" label="Поколение и кузов" suggested={true}
                    onChange={(value: string) => {
                        const [genId, confId] = value.split("_");
                        setCarData({ ...carData, generation_id: genId, configuration_id: confId, year: 0 })

                    }}
                    value={`${carData?.generation_id}_${carData?.configuration_id}`}
                    showClear={!!carData?.generation_id}
                    onClear={() => { setCarData({ ...carData, generation_id: '', configuration_id: '', complectation_id: '', engine_hash: '', year: 0 }) }}
                    disabled={!carData?.model_id}
                    readOnly={!!carData?.generation_id}
                    optionLabel="label"
                    options={generations?.flatMap(generation =>
                        generation.configurations.map(configuration => ({
                            value: [generation.id, configuration.id].join('_'),
                            label: [generation.yearStart, '-', generation.yearStop || 'н.в.', generation.name, ',', configuration.bodyType, configuration.notice].join(' ')
                        }))
                    ) || []}
                />
                <UiSelect className="col-span-12" placeholder="Выберите комплектацию" label="Комплектация" suggested={true}
                    onChange={(complId: string) => {
                        const complectation = complectations?.find(compl => compl.id === complId)
                        if (!!setEngineHash) { setEngineHash(complectation?.engineHash || ''); }
                        if (!!setComplectationId) { setComplectationId(complId); }

                        setCarData({ ...carData, engine_hash: complectation!.engineHash, complectation, complectation_id: complId })
                    }}
                    value={carData?.complectation_id}
                    showClear={!!carData?.complectation_id}
                    onClear={() => { setCarData({ ...carData, complectation_id: '', engine_hash: '', year: 0 }) }}
                    disabled={!carData?.configuration_id || !carData?.generation_id || !carData?.model_id || !carData?.brand_id}
                    readOnly={!!carData?.complectation_id}
                    options={complectations?.map((compl) => ({
                        value: compl.id,
                        label: [
                            compl.groupName, `${compl.engineType} ${compl.volumeLitres ? compl.volumeLitres?.toFixed(1) : ''}, ${compl.horsePower} л.с.`,
                            compl.transmission, compl.drive
                        ].filter(part => part && part.trim().length > 0).join(" / ")
                    })) || []}
                />
                <div className="col-span-12 grid grid-cols-5 gap-4">
                    <UiInput label="VIN" keyfilter="alphanum" value={carData.vin || ''} disabled={!carData?.complectation_id} onChange={(e) => setCarData({ ...carData, vin: e.currentTarget.value })} />
                    <UiSelect label="Год" placeholder="Выберите год" value={carData.year || undefined} disabled={!carData?.complectation_id}
                        options={genYears} onChange={(value) => {
                            setCarData({ ...carData, year: value })
                        }}
                    />
                    {/* <UiInputNumber label="Год" value={carData.year} disabled={!carData?.complectation_id} onValueChange={(e) => setCarData({ ...carData, year: e.value || 0 })} min={0} max={new Date().getFullYear()} locale="ru-RU" useGrouping={false} /> */}
                    <UiInputNumber label="Пробег" value={carData.mileage} disabled={!carData?.complectation_id} onChange={(e) => setCarData({ ...carData, mileage: e.value || 0 })} min={0} max={1000000} locale="ru-RU" />
                    <UiAutoComplete
                        label="Город"
                        placeholder="Начните вводить"
                        disabled={!carData?.complectation_id}
                        value={cityQuery}
                        suggestions={citySuggestions}
                        field="name"
                        completeMethod={(e) => {
                            setCityQuery(e.query);
                            fetchCities(e.query)
                        }}
                        onSelect={(e) => {
                            setCarData({ ...carData, city_id: e.value.id })
                            setCityQuery(e.value.name);
                        }}
                    />
                    <UiCheckbox text="Без пробега по РФ" id="isMileageAbroadCheckBox" disabled={!carData?.complectation_id} checked={carData.isMileageAbroad} onChange={(e) => setCarData({ ...carData, isMileageAbroad: e.checked || false })} />
                </div>
            </div>
        </UiCard>
    </>)
}