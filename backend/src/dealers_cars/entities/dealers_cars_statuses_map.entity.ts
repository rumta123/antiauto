import { BaseAppEntity } from "src/base-app.entity";
import { Entity, ManyToOne } from "typeorm";
import { DealersCars } from "./dealers_cars.entity";
import { DealersCarsStatuses } from "./dealers_cars_statuses.entity";


@Entity('dealers_cars_statuses_map')
export class DealersCarsStatusesMap extends BaseAppEntity {
    @ManyToOne(() => DealersCars, car => car.id)
    car: DealersCars;

    @ManyToOne(() => DealersCarsStatuses, carsStatuses => carsStatuses.id)
    status: DealersCarsStatuses;

}