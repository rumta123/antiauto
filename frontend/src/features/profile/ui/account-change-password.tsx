
import { useState } from "react";
import { UiDialog, UiInput, UiButton } from "@/shared/ui";
import { useChangePassword } from "@/features/auth/model/use-change-password";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string; // Добавляем это поле для проверки подтверждения пароля
}

export function AccountChangePassword() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
    const newPassword = watch("newPassword");
    const { changePassword, isPending, error } = useChangePassword();

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);



    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            // Обрабатываем случай, когда новый пароль и его подтверждение не совпадают
            return;
        }
        changePassword({ password: data.currentPassword, newPassword: data.newPassword });
        handleCloseDialog();
    };

    return (<>
        <div><UiButton className="-ml-4" text onClick={handleOpenDialog} severity="secondary">Изменить пароль</UiButton></div>
        <UiDialog visible={isDialogOpen} onHide={handleCloseDialog} style={{ width: '40vw' }} header="Изменение пароля">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <UiInput className="pl-4" type="password" placeholder="Текущий пароль" {...register("currentPassword", { required: true })} />
                <UiInput className="pl-4" type="password" placeholder="Новый пароль" {...register("newPassword", { required: true })} />
                <UiInput className="pl-4" type="password" placeholder="Подтвердите новый пароль" {...register("confirmNewPassword", {
                    validate: value => value === newPassword || "Новый пароль и подтверждение не совпадают"
                })} />

                {errors.confirmNewPassword && <div className="text-red-500">{errors.confirmNewPassword.message}</div>}
                <div><UiButton type="submit" loading={isPending}>Сохранить изменения</UiButton></div>
                {error && <div className="text-red-500">{error.message}</div>}
            </form>
        </UiDialog>
    </>);
    // </>
}


