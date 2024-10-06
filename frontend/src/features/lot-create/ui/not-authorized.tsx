import { useUpdateSessionData } from "@/entities/session/queries";
import { SignInForm } from "@/features/auth";

interface NotAuthorizedProps {
    onSuccessCallback?: (data: any) => void;
}

export function NotAuthorizedWidget({ onSuccessCallback }: NotAuthorizedProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p className="text-xl font-semibold">Осталось только войти</p>
            <div className="max-w-96">
                <SignInForm onSuccessCallback={onSuccessCallback} isModalSignUp={true} />
            </div>
        </div>
    )
}