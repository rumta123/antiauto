import { LotDto } from "@/shared/api/generated";
import UiChip from "@/shared/ui/UiChip";
import { UiTag } from "@/shared/ui/UiTag";
import { CircleCheck } from "@gravity-ui/icons";

interface useStatusProps {
    lot?: LotDto
}
export function useStatus({ lot }: useStatusProps) {
    let cardClassName = ""
    let titleClassName = ""
    let badge = null
    if (lot) {


        if (lot.own_offers_count > 0) {
            cardClassName = "border-l-seabrand-600 border-l-4"
            badge = (
                <UiTag value="Участвую" />
            );
        }
        if (lot.status.name === 'selected_by_buyer' || lot.status.name === 'selected_by_seller') {
            cardClassName = "border-l-orange-400 border-l-4";
            badge = (
                <div className="text-orange-400 flex flex-row gap-1 items-center">
                    <CircleCheck />
                    <p>
                        {lot.status.name === 'selected_by_buyer' && `Выбран покупателем`}
                        {lot.status.name === 'selected_by_seller' && `Подтверждено продавцом`}
                    </p>
                </div>
            )
        }
    }

    return {
        cardClassName,
        titleClassName,
        badge
    }
}