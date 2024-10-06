
import { useOffer } from "@/entities/offers/use-offer";
import { useSessionQuery } from "@/entities/session";
import { ProcessDto } from "@/shared/api/generated";
import { UiCard, UiImage } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { useBrandModelGenConf } from "@/entities/catalog/use-brand-model-gen-conf";

export function ChatListItem({ chat }: { chat: ProcessDto }) {
    const { data: sessionData } = useSessionQuery();
    const { data: offerData } = useOffer(chat.offer_id)
    const { catalogData } = useBrandModelGenConf(offerData?.car.engine_hash)
    const router = useRouter()
    return (<>
        <UiCard className="bg-slate-100 shadow-md" onClick={() => router.push(`/chat/${chat.id}`)}>
            <div className="grid grid-cols-12 gap-4 ">
                <div className="col-span-9 grid-cols-subgrid grid  gap-4 divide-x divide-seabrand-400">
                    <div className="col-span-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-base text-slate-900 font-semibold">{chat.lastMessageDate?.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">{chat.lastMessage?.author_name}</p>
                            </div>
                            <div className={`flex flex-row gap-2 ${chat.lastMessage?.author_id !== sessionData?.id && 'flex-row-reverse'}`}>
                                <Avatar label={chat.lastMessage?.author_name.slice(0, 1).toUpperCase()} shape="circle" />
                                <p className="text-base text-slate-900 font-semibold bg-white py-2 px-4 rounded-md">{chat.lastMessage?.message}</p>
                            </div>

                        </div>
                    </div>
                    <div className="col-span-3">
                        <div className="flex flex-col p-4 gap-1">
                            {!chat.lot_id && !chat.offer_id && !chat.dealers_car_id && <p className="text-sm text-slate-500 font-semibold">Без темы</p>}
                            {chat.process_type === 'offer_moderation' && <>
                                <p className="text-sm text-slate-500 font-semibold">Предложениe</p>
                                {catalogData?.brand && <p className="text-sm text-slate-500 ">{`${catalogData.brand.name} ${catalogData.model.name} ${catalogData.configuration.bodyType} ${catalogData.configuration.notice}`}</p>}
                                <p className="text-sm text-slate-500 ">{offerData?.car.year} </p>
                            </>}
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <UiImage className="-my-4 -mr-4 " imgClassName="rounded-l-none shadow-none " />
                </div>
            </div>
        </UiCard>
    </>)
}

