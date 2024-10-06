import UiButton from "@/shared/ui/UiButton"
import { ChevronLeft } from "@gravity-ui/icons"
import { useRouter } from "next/navigation"

interface BackBtnProps {
    path?: string
    back?: boolean
}
export function BackBtn({ path,back }: BackBtnProps) {
    const router = useRouter()

    return <UiButton severity="secondary" size="small" outlined onClick={() => {
        back && router.back()
        path && router.push(path)
    }}><ChevronLeft /></UiButton>

}