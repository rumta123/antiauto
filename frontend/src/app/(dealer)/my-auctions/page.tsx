import LotsListWithMyOffersWidget from "@/widgets/lots/lots-list-with-my-offers"


const MyAuctionsPage = () => {
    return (
        <div className="flex flex-col gap-8">
            <p className="text-4xl text-brand-900 font-black">Мои аукционы</p>
            <LotsListWithMyOffersWidget  /> 
        </div>
    )
}
export default MyAuctionsPage
