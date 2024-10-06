import CarDetailsWidget from "@/widgets/dealer-cars/car-details";

export default function DilersCarDetails({ params }: { params: { carId: string } }) {
    return (
        <CarDetailsWidget car_id={params.carId} />
    )
}