import LotDetailsWidget from "@/widgets/lots/lot-details"



const AuctionDetailsPage = ({ params }: { params: { lotId: string } }) => {
    return (
        <LotDetailsWidget lot_uuid={params.lotId} />
    )
}
export default AuctionDetailsPage
