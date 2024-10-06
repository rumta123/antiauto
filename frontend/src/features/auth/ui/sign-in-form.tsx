"use client"
import { UILink } from "@/shared/ui/UiLink";
import UiInput from "@/shared/ui/UiInput";
import UiButton from "@/shared/ui/UiButton";
import { Controller } from "react-hook-form";
import { SignUpForm } from '@/features/auth/index';

import { useSignInForm } from "../model/use-sign-in-form";
import { useSendCode } from "../model/use-send-code";
import { useVerifyEmailForm } from "../model/use-verify-email-form";
import { useState } from "react";
import UiDialog from "@/shared/ui/UiDialog";

interface SignInFormProps {
    onSuccessCallback?: (data: any) => void;
    isModalSignUp?: boolean;
}

export function SignInForm({ onSuccessCallback, isModalSignUp }: SignInFormProps) {
    const { handleSubmit, isPending, control, errorMessage, isCodeVerificationRequired, getSignInFormValues } = useSignInForm(onSuccessCallback);
    const { handleSubmitVerifyEmail, register: registerVerify, isPending: isPendingVerify, control: controlVerify, error: errorMessageVerify } = useVerifyEmailForm(onSuccessCallback);
    const emailValue = getSignInFormValues('email'); // Допустим, getSignInFormValues возвращает значения формы, аналогично SignUpForm
    const { sendCode, isPending: isSendingCode, error: sendCodeError } = useSendCode(emailValue);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    return (
        <>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <UiInput
                            label="E-mail"
                            type="email"
                            {...field}
                            disabled={isPending || isCodeVerificationRequired}
                            value={field.value || ''}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <UiInput
                            label="Пароль"
                            type="password"
                            {...field}
                            disabled={isPending || isCodeVerificationRequired}
                            value={field.value || ''}
                        />
                    )}
                />
                {!isCodeVerificationRequired &&
                    <div className="flex flex-col">
                        <div><UILink className="text-left text-xs" >TODO:Забыл пароль</UILink></div>
                        {isModalSignUp ?
                            <div><UILink className="text-left text-xs" onClick={() => setShowSignUpModal(true)}>Зарегистрироваться</UILink></div>
                            :
                            <div><UILink className="text-left text-xs" href="/sign-up">Зарегистрироваться</UILink></div>
                        }
                        <div><UiButton disabled={isPending} type="submit" className="mt-4">Войти</UiButton></div>
                    </div>
                }
                {errorMessage && <div className="text-rose-500">{String(errorMessage)}</div>}
            </form>
            {isCodeVerificationRequired &&
                <form className="flex flex-col gap-2 mt-2" onSubmit={handleSubmitVerifyEmail}>
                    <input
                        type="hidden"
                        {...registerVerify('email')}
                        value={getSignInFormValues('email')}
                    />
                    <Controller
                        name="code"
                        control={controlVerify}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <UiInput
                                label="Код из почты"
                                type="text"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />
                    <UILink className="text-left text-xs" onClick={() => sendCode()}>Отправить код ещё раз</UILink>
                    <UiButton disabled={isPendingVerify} type="submit" className="mt-4">Подтвердить</UiButton>
                    {errorMessageVerify && <div className="text-rose-500">{String(errorMessageVerify)}</div>}
                    {sendCodeError && <div className="text-rose-500">Ошибка отправки кода: {String(sendCodeError.message)}</div>}
                </form>
            }
            {isModalSignUp && showSignUpModal && (
                <UiDialog header="Регистрация" visible={showSignUpModal} onHide={() => setShowSignUpModal(false)} style={{ width: '40vw' }}>
                    <SignUpForm isModal={true} onSuccessCallback={(data) => {
                        setShowSignUpModal(false); // Закрыть модальное окно после успешной регистрации
                        onSuccessCallback?.(data); // Вызвать onSuccessCallback, если он предоставлен
                    }} />
                </UiDialog>
            )}
        </>
    );
}
