import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { UiDialog, UiInput, UiButton, UiInputMask } from "@/shared/ui";
import { PatchAccountDto, SignUpSubAccountBodyDto, SubAccountDto } from '@/shared/api/generated';
import { usePatchAccount } from '@/entities/account/use-patch-account';
import { useQueryClient } from '@tanstack/react-query';

interface SubAccountEditFormDialogProps {
    isOpen: boolean;
    onClose: () => void;

    initialData?: SubAccountDto;
}

export function SubAccountEditFormDialog({ isOpen, onClose, initialData }: SubAccountEditFormDialogProps) {
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset, formState: { errors } } = useForm<PatchAccountDto>({
        defaultValues: {
            id: '',
            name: '',
            phone: '',
            address: '',
            comment: ''
        }
    });

    const { updateAccount, isPending, isError, error } = usePatchAccount(() => {
        queryClient.invalidateQueries({ queryKey: ['sub-accounts'] });
        onClose()
    });
    const trimPhone = (phone?: string) => phone?.replace(/[\s\(\)-]/g, '') || '';

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = (data: PatchAccountDto) => {
        data.phone = trimPhone(data.phone)
        updateAccount(data);
    };
    return (
        <UiDialog header="Редактировать суб-аккаунт" onHide={onClose} visible={isOpen}>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
                    <UiInput label="Название" {...field} value={field.value || ''} />
                )} />
                <UiInput label="E-mail" type="email" value={initialData?.email} disabled={true} />
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
                    <UiButton type="submit" loading={isPending}>Сохранить изменения</UiButton>
                    <UiButton outlined onClick={onClose}>Отмена</UiButton>
                </div>
                {isError && <div className="text-red-500">Ошибка: {error?.message}</div>}
            </form>
        </UiDialog>
    );
}
