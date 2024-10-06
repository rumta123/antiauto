import { useProcesses } from "@/entities/process/use-processes"
import { useSessionQuery } from "@/entities/session";
import { ChatListItem } from "@/features/chat";
import { ProcessesControllerGetConversationsParams } from "@/shared/api/generated";
import { UiInput, UiSelect, UiSpinner } from "@/shared/ui"
import { Magnifier } from "@gravity-ui/icons"
import { useState } from "react";

export function ChatsListWidget() {

    

    const filterTypeOptions = [
        { label: 'Все', value: '' },
        { label: 'Без контекста', value: 'chat' },
        { label: 'Регистрация дилеров', value: 'dealer_registration' },
        { label: 'Модерация предложений', value: 'offer_moderation' },
        { label: 'Модерация отзывов', value: 'feedback_moderation' }

    ];
    const [selectedFilterType, setSelectedFilterType] = useState(filterTypeOptions[0].value);
    const [searchQuery, setSearchQuery] = useState('');

    const [filter, setFilter] = useState<ProcessesControllerGetConversationsParams>({
        process_type: filterTypeOptions[0].value,
        skip: 0,
        take: 100
    })

    const { chats, isLoading, isError, error } = useProcesses(filter)

    const { data: sessionData } = useSessionQuery()
    return <>
        <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
                <h1 className='text-4xl text-brand-900 font-black leading-9'>Список чатов</h1>
            </div>

            {(sessionData?.type === 'root' || sessionData?.type === 'service_desk' )&&
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">

                        <UiSelect className="p-inputtext-sm" options={filterTypeOptions} placeholder="Сортировка" uiSize="small" value={selectedFilterType} onChange={(value) => {
                            setSelectedFilterType(value)
                            setFilter({ ...filter, process_type: value })
                        }} />
                        <UiInput className="p-inputtext-sm min-w-72" placeholder="Поиск по номеру (акциона, лота, автомобиля)" iconBefore={<Magnifier />} uiSize="small" onChange={(e) => setSearchQuery(e.currentTarget.value)} />

                    </div>

                </div>
            }

            {isLoading ?
                <UiSpinner />
                :
                isError ?
                    <div>Error: {error?.message}</div>
                    :
                    <>
                        {chats && chats.map(chat =>
                            // <div key={chat.id}>{chat.id}</div>
                            <ChatListItem chat={chat} />
                        )}
                    </>
            }
        </div>
    </>
}