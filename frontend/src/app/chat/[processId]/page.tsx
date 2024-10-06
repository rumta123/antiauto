import { ChatDetailsWidget } from "@/widgets/chat/chat-details"


const ChatDetailsPage = ({ params }: { params: { processId: string } }) => {
    return (
        <ChatDetailsWidget processId={params.processId} />
    )
}
export default ChatDetailsPage
