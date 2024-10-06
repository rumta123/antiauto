import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { UiDialog, UiInput, UiButton, UiInputMask } from "@/shared/ui";
import { SignUpSubAccountBodyDto, SubAccountDto } from '@/shared/api/generated';
import { useSignUpSubaccount } from '@/features/auth/model/use-sign-up-subaccount';

interface SubAccountAddFormDialogProps {
    isOpen: boolean;
    onClose: () => void;

}

export function SubAccountAddFormDialog({ isOpen, onClose }: SubAccountAddFormDialogProps) {

    const { handleSubmit, control, isPending, error } = useSignUpSubaccount(onClose);

    return (
        <UiDialog header="Добавить суб-аккаунт" onHide={onClose} visible={isOpen}>
            <form className="flex flex-col gap-4 my-1" onSubmit={handleSubmit}>
                <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
                    <UiInput label="Название" {...field} value={field.value || ''} />
                )} />
                <Controller name="email" control={control} rules={{ required: true }} render={({ field }) => (
                    <UiInput label="E-mail" type="email" {...field} />
                )} />
                <Controller name="password" control={control} rules={{ required: true }} render={({ field }) => (
                    <UiInput label="Пароль" type="password" {...field} />
                )} />
                <Controller name="phone" control={control} rules={{ required: true }} render={({ field }) => (
                    <UiInputMask

                        label="Телефон"
                        mask="+7 (999) 999-9999"
                        placeholder="+7 (999) 999-9999"
                        {...field}
                    />
                )} />
                <Controller name="address" control={control} render={({ field }) => (
                    <UiInput label="Адрес" {...field}
                        value={field.value || ''} />
                )} />
                <Controller name="comment" control={control} render={({ field }) => (
                    <UiInput label="Комментарий" {...field} />
                )} />
                <div className="flex flex-row gap-2">
                    <UiButton type="submit" loading={isPending}>Создать</UiButton>
                    <UiButton outlined onClick={onClose}>Отмена</UiButton>
                </div>
            </form>
        </UiDialog>
    );
}
