import { useDetailedComplectationByEngineHash } from "@/entities/catalog/use-detailed-complectation";
import { useLotOptionsDictByLotId } from "@/entities/lots/use-lots";
import { CarSpecification } from "@/features/catalog/ui/car-specification";
import { OptionsList } from "@/features/catalog/ui/options-list";
import UiCard from "@/shared/ui/UiCard";

interface LotDetailsTabDetailsProps {
    engineHash: string;
    lotId: string;
    carConfiguration: string;
    carComplectation: string;
}
export function LotDetailsTabDetails({ engineHash, lotId, carConfiguration, carComplectation }: LotDetailsTabDetailsProps) {
    const { detailedComplectation, isLoading, isError, error } = useDetailedComplectationByEngineHash(engineHash);
    const { options: strictOptions } = useLotOptionsDictByLotId(lotId, { strict: true })
    const { options: additionalOptions } = useLotOptionsDictByLotId(lotId, { strict: false })

    return <div className="flex flex-col gap-4">
        <UiCard className="bg-white shadow-md rounded-lg text-slate-900 p-6">
            <p className="text-xl font-semibold">{carConfiguration}</p>
            <p>{carComplectation}</p>
        </UiCard>
        <CarSpecification detailedComplectation={detailedComplectation} />
        {strictOptions && !!Object.keys(strictOptions).length && <OptionsList optionsDict={strictOptions} title="Обязательные опции" />}
        {additionalOptions && !!Object.keys(additionalOptions).length && <OptionsList optionsDict={additionalOptions} title="Желательные опции" />}
    </div>
}