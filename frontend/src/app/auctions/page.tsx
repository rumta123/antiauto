import LotsListWidget from "@/widgets/lots/lots-list"


const AuctionsPage = () => {
    return (
        <div className="flex flex-col gap-8">
            <p className="text-4xl text-brand-900 font-black">Мои аукционы</p>
            <LotsListWidget /> 
        </div>
    )
}
export default AuctionsPage
