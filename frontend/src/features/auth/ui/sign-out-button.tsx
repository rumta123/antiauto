"use client"
import { UILink } from "@/shared/ui/UiLink";
import { useSignOut } from "../model/use-sign-out";

export function SignOutButton() {
    const { isPending, signOut } = useSignOut()

    return (
        // <UiButton
        //     // variant="outlined"
        //     className="bg-red-500"
        //     disabled={isPending}
        //     type="submit"
        //     onClick={()=>signOut({})}
        // >
        //     Выход
        // </UiButton>
        <UILink  onClick={()=>signOut({})}>
            Выход
        </UILink>
    )
}