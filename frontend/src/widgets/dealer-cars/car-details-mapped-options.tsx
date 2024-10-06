import { useDealersCarsMappedOptions } from "@/entities/dealers-cars";
import { OptionsList } from "@/features/catalog/ui/options-list";

interface CarDetailsOptionsProps {
    carId: string;
    title?: string;
    showAsBlock?: boolean;
}

export function CarDetailsMappedOptions({ carId, title, showAsBlock }: CarDetailsOptionsProps) {
    const { options } = useDealersCarsMappedOptions(carId)
    return (<>
        {options && <OptionsList optionsDict={options} title={title} showAsBlock={showAsBlock} />}
    </>)
}