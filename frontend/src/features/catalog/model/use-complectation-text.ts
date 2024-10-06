import { useComplectationByEngineHash } from "@/entities/catalog/use-detailed-complectation"

export function useComplectationText(engine_hash: string) {
    const { complectation } = useComplectationByEngineHash(engine_hash)
    const complectationText = complectation ? [
        [
            complectation?.volumeLitres?.toFixed(1),
            (complectation?.horsePower ? `${complectation?.horsePower} л.с.` : ''),
            complectation?.engineType
        ].join(' '),
        complectation?.transmission,
        complectation?.drive,
        `расход ${complectation?.consumptionMixed} л.`,
        `разгон до 100 - ${complectation?.timeTo100} с`
    ].join(', ')
        : '';
    return { complectationText }
}
