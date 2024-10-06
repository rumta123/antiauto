import { ConfirmDialog, ConfirmDialogProps } from "primereact/confirmdialog";

interface UUiConfirmDialogProps extends ConfirmDialogProps {

}
export function UiConfirmDialog({ ...rest }: UUiConfirmDialogProps) {
    return <ConfirmDialog
        pt={{

        }}
        acceptLabel="Подтвердить"
        rejectLabel="Отменить"
        rejectClassName="!text-brand-700 bg-transparent border border-brand-700  hover:bg-brand-300/20"
        acceptClassName=" bg-brand-700 border border-brand-700  hover:bg-brand-900"
        {...rest}
    />
}