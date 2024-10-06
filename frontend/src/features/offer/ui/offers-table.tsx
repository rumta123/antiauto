import { LotDto, OfferDto } from "@/shared/api/generated"

interface OffersTableProps {
    items?: OfferDto[];
    lotData?: LotDto
}
export function OffersTable({items}:OffersTableProps) {
    return <>
        таблица
    </>
}