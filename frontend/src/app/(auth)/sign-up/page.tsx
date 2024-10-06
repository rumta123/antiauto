"use client"
import { SignUpForm } from "@/features/auth";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter()
    return (
        <>
            <SignUpForm onSuccessCallback={()=>router.push('/')} />
        </>
    )

}  