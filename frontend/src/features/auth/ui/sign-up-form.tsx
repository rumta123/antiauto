"use client"
import { UILink } from "@/shared/ui/UiLink";
import UiInput from "@/shared/ui/UiInput";
import UiButton from "@/shared/ui/UiButton";

import { useSignUpForm } from "../model/use-sign-up-form";
import { useVerifyEmailForm } from "../model/use-verify-email-form";
import { Controller } from "react-hook-form";
import { useSendCode } from "../model/use-send-code";

interface SignUpFormProps {
    onSuccessCallback?: (data: any) => void;
    isModal?: boolean;
}

export function SignUpForm({ onSuccessCallback, isModal }: SignUpFormProps) {
    const { handleSubmit, isPending, control, getSignUpFormValues, errorMessage, isCodeVerificationRequired } = useSignUpForm();
    const { handleSubmitVerifyEmail, register: registerVerify, isPending: isPendingVerify, control: controlVerify, error: errorMessageVerify } = useVerifyEmailForm(onSuccessCallback);
    const emailValue = getSignUpFormValues('email');
    const { sendCode, isPending: isSendingCode, error: sendCodeError } = useSendCode(emailValue);


    return (
        <>
            {!isModal &&
                <div className="mb-4">
                    <h1 className="text-2xl">Регистрация</h1>
                </div>
            }
            <form className="flex flex-col gap-2 my-2" onSubmit={handleSubmit}>
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
                            label="Придумайте пароль"
                            type="password"
                            {...field}
                            disabled={isPending || isCodeVerificationRequired}
                            value={field.value || ''}
                        />
                    )}
                />
                {!isCodeVerificationRequired &&
                    <div className="flex flex-col">
                        {!isModal && <>
                            <div><UILink className="text-left text-xs" href="/sign-in">Войти</UILink></div>
                            <div><UILink className="text-left text-xs" href="/auth/dealer">Я дилер</UILink></div>
                        </>}
                        <div><UiButton disabled={isPending} type="submit" className="mt-4">Продолжить</UiButton></div>
                        {errorMessage && <div className="text-rose-500">{String(errorMessage)}</div>}
                    </div>
                }
            </form>
            {isCodeVerificationRequired &&
                <form className="flex flex-col gap-2 mt-2" onSubmit={handleSubmitVerifyEmail}>
                    <input
                        type="hidden"
                        {...registerVerify('email')}
                        value={getSignUpFormValues('email')}
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
                    <div><UILink className="text-left text-xs" onClick={() => sendCode()}>Отправить ещё раз</UILink></div>
                    <div><UiButton disabled={isPendingVerify} type="submit" className="mt-4">Подтвердить</UiButton></div>
                    {errorMessageVerify && <div className="text-rose-500">{String(errorMessageVerify)}</div>}
                    {sendCodeError && <div className="text-rose-500">Ошибка отправки кода: {String(sendCodeError.message)}</div>}
                </form>
            }
        </>
    );
}
