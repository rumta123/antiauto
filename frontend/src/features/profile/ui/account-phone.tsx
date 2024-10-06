import { useUpdateAccountPhone, useUpdateAccountPhoneVerifyCode } from "@/entities/account/use-patch-account-phone";
import { UiButton, UiInput, UiInputMask } from "@/shared/ui";
import { ArrowUturnCcwLeft, CircleCheck, CircleXmarkFill, FloppyDisk, PencilToLine } from "@gravity-ui/icons";
import { useEffect, useState } from "react";

interface AccountPhoneProps {
    phone?: string;
    isPhoneVerified?: boolean;
}
export function AccountPhone({ phone, isPhoneVerified }: AccountPhoneProps) {
    const trimPhone = (phone?: string) => phone?.replace(/[\s\(\)-]/g, '') || '';

    const [editedPhone, setEditedPhone] = useState<string | undefined>();
    useEffect(() => {
        if (!!phone?.length) {
            setEditedPhone(phone);
        }
    }, [phone]);


    const [isEditMode, setIsEditMode] = useState(false);
    const { updatePhone, isPending: isPhonePending, isError: isPhoneError, error: phoneError } = useUpdateAccountPhone();
    const { updatePhoneCode, isPending: isPhoneCodePending, isError: isPhoneCodeError, error: phoneCodeError } = useUpdateAccountPhoneVerifyCode();

    const [phoneCode, setPhoneCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);

    const handleSubmitPhoneChange = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (phoneCode.length) {
            updatePhoneCode({ phone: trimPhone(phone), code: phoneCode }); // верификация введённого кода
        } else {
            updatePhone(trimPhone(phone)); // Вызов функции обновления с новым номером телефона
            setShowCodeInput(true);
        }
    };


    return <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
            <UiInputMask value={editedPhone}
                className="pl-4 w-80"
                onChange={(e) => {
                    e.target.value && setEditedPhone(e.target.value)
                }}
                readOnly={!isEditMode}
                mask="+7 (999) 999-9999"
                placeholder="+7 (999) 999-9999"
            />
            {!isEditMode ?
                <UiButton text onClick={() => setIsEditMode(true)}><PencilToLine /></UiButton>
                :
                <>
                    <UiButton text onClick={() => {
                        setEditedPhone(phone)
                        setIsEditMode(false)
                    }}><ArrowUturnCcwLeft /></UiButton>
                    <UiButton text onClick={() => {
                        updatePhone(trimPhone(editedPhone));
                        setIsEditMode(false);
                    }}><FloppyDisk /></UiButton>
                </>
            }
            {!isEditMode && !isPhoneVerified && !isPhoneError && !!phone?.length &&
                <>
                    <UiInput
                        keyfilter="int"
                        label="Код"
                        value={phoneCode}
                        disabled={isPhoneCodePending}
                        onChange={(e) => setPhoneCode(e.currentTarget.value)}
                    />
                    <UiButton text onClick={() => {
                        if (phoneCode.length) {
                            updatePhoneCode({ phone: trimPhone(phone), code: phoneCode }); // верификация введённого кода
                            setPhoneCode('');
                        }
                    }}><FloppyDisk /></UiButton>

                    <UiButton text severity="secondary" onClick={handleSubmitPhoneChange}>Отправить код ещё раз</UiButton>
                </>
            }

        </div>
        <div>
            {isPhoneError && <p>Произошла ошибка: {phoneError?.message}</p>}
            {isPhoneCodeError && <p>Произошла ошибка: {phoneCodeError?.message}</p>}
        </div>

    </div>
}