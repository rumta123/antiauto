// PhoneVerificationWidget.jsx

import React, { useState } from 'react';
import UiInputMask from "@/shared/ui/UiInputMask";
import UiInput from "@/shared/ui/UiInput";
import UiButton from "@/shared/ui/UiButton";
import { UILink } from '@/shared/ui/UiLink';
import { useUpdateAccountPhone, useUpdateAccountPhoneVerifyCode } from '@/entities/account/use-patch-account-phone';
interface PhoneVerificationProps {
    onVerified: () => void,
    onCancel: () => void,

}
const PhoneVerificationWidget = ({ onVerified, onCancel, }: PhoneVerificationProps) => {
    const [phone, setPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);

    const { updatePhone, isPending: isPhonePending, isError: isPhoneError, error: phoneError } = useUpdateAccountPhone();
    const { updatePhoneCode, isPending: isPhoneCodePending, isError: isPhoneCodeError, error: phoneCodeError } = useUpdateAccountPhoneVerifyCode();

    const handleSubmitPhoneChange = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (phoneCode.length) {
            updatePhoneCode({ phone: trimPhone(phone), code: phoneCode }); // верификация введённого кода
        } else {
            updatePhone(trimPhone(phone)); // Вызов функции обновления с новым номером телефона
            setShowCodeInput(true);
        }
    };

    const trimPhone = (phone: string) => phone.replace(/[\s\(\)-]/g, '');

    return (
        <form className="flex flex-col gap-4">
            <p className="text-xl font-semibold">Нам понадобится ваш телефон,<br />чтобы выбранный вами дилер смог с вами связаться</p>
            <UiInputMask
                label="Телефон"
                value={phone}
                onChange={(e) => {
                    e.target.value && setPhone(e.target.value);
                    setPhoneCode('');
                }}
                disabled={isPhonePending || isPhoneCodePending}
                mask="+7 (999) 999-9999"
                placeholder="+7 (999) 999-9999"
            />
            {showCodeInput &&
                <>
                    <UiInput
                        keyfilter="int"
                        label="Код"
                        value={phoneCode}
                        disabled={isPhoneCodePending}
                        onChange={(e) => setPhoneCode(e.currentTarget.value)}
                    />
                    <UILink onClick={handleSubmitPhoneChange}>Отправить код ещё раз</UILink>
                </>
            }
            {isPhoneError && <p>Произошла ошибка: {phoneError?.message}</p>}
            {isPhoneCodeError && <p>Произошла ошибка: {phoneCodeError?.message}</p>}
            {(isPhonePending || isPhoneCodePending) && <p>Обновление...</p>}

            <div className='flex flex-row gap-4'>
                <UiButton severity='secondary' outlined onClick={onCancel}>
                    Назад
                </UiButton>
                <UiButton onClick={handleSubmitPhoneChange}>
                    Продолжить
                </UiButton>
            </div>
        </form>
    );
};

export default PhoneVerificationWidget;
