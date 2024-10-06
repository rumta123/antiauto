import { Accounts } from "src/account/entities/accounts.entity";
import { BaseAppEntity } from "src/base-app.entity";
import { Offers } from "src/offers/entities/offers.entity";
import { Check, Column, Entity, ManyToOne } from "typeorm";

@Entity('feedbacks')
export class Feedbacks extends BaseAppEntity {
    @Column()
    text: string;

    @Column({
        type: "smallint",
        width: 5
    })
    @Check(`"rating" >= 1 AND "rating" <= 5`)
    rating: number;

    @ManyToOne(() => Offers, offer => offer.id)
    offer_id: Offers;

    @ManyToOne(() => Accounts, account => account.id)
    account_id: Accounts;
}

@Entity('feedbacks_statuses')
export class FeedbacksStatuses extends BaseAppEntity {
    @Column({ unique: true })
    name: string;
}

@Entity('feedbacks_statuses_map')
export class LotsStatusesMap extends BaseAppEntity {
    @ManyToOne(() => Feedbacks, feedback => feedback.id)
    feedback: Feedbacks;

    @ManyToOne(() => FeedbacksStatuses, lotsStatuses => lotsStatuses.id)
    status: FeedbacksStatuses;
}