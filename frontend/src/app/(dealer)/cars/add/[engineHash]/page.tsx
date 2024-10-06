import { AddCar } from "@/widgets/dealer-cars/add-car";

export default function CarAddIdPage({ params }: { params: { engineHash: string } }) {
    return <AddCar engine_hash={params.engineHash} />
}