"use client"
import { SignInForm } from "@/features/auth";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const router = useRouter();
    return (
        <>
            <h1 className="text-2xl mb-6">Вход</h1>
            <SignInForm onSuccessCallback={()=>router.push('/')} />
        </>
    )

}  