
import { EditCar } from "@/widgets/dealer-cars/edit-car";

export default function CarEditPage({ params }: { params: { carId: string } }) {

    return <EditCar car_id={params.carId} />
}