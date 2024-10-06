import { CarDetailsCard } from "./car-details-card";

interface CarsListProps {
    carItems?: any[]
}

export function CarsList({ carItems = [] }: CarsListProps) {
    return <>
        <div className="flex flex-col gap-4">
            {carItems.length ?
                carItems.map((car, index) => (
                    <CarDetailsCard
                        key={index}
                        carData={car}
                        headerLink={`/cars/${car.id}`}
                        showActions={true} />
                ))
                :
                <div className="py-10">
                    <p>Автомобили не найдены</p>
                </div>
            }
        </div>
    </>
}