import { useDetailedComplectation } from "@/entities/catalog/use-detailed-complectation";
// import { useDealersCarsMappedOptions } from "@/entities/dealers-cars/use-dealers-cars-options";
import { CarSpecification } from "@/features/catalog/ui/car-specification";
// import { OptionsList } from "@/features/catalog/ui/options-list";
import { DealersCarDto } from "@/shared/api/generated";
import { CarDetailsMappedOptions } from "./car-details-mapped-options";

interface CarDetailsTabDetailsProps {
    car: DealersCarDto
}
export function CarDetailsTabDetails({ car }: CarDetailsTabDetailsProps) {
    const { detailedComplectation } = useDetailedComplectation(car.brand_id, car.model_id, car.generation_id, car.configuration_id, car.complectation_id);
    // const { options } = useDealersCarsMappedOptions(car.id)

    return (<>
        <CarSpecification detailedComplectation={detailedComplectation} />
        {/* {options && <OptionsList optionsDict={options} title="Опции" />} */}
        <CarDetailsMappedOptions carId={car.id} title="Опции" />
    </>)
}