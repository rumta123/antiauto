import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity, Index } from "typeorm";

@Entity('offers_statuses')
export class OffersStatuses extends BaseAppEntity {
    @Index()
    @Column({
        type: "enum",
        enum: ["draft", "published", "moderation", "completed", "selected_by_buyer", "selected_by_seller", "contacts_sended", "finished"],
        default: "draft"
    })
    name: string

    @Column({
        type: "enum",
        name: 'name_cyrillic',
        nullable:true,
        enum: ["черновик", "опубликован", "на модерации",  "выбран покупателем", "выбран продавцом", "контакт отправлен", "завершён"],
    })
    nameCyrillic: string

    @Index()
    @Column({name:'is_last'})
    isLast: boolean;

    @Column({name:'is_visible_for_buyer'})
    isVisibleForBuyer: boolean;
}