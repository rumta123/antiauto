import { useSubAccounts } from "@/entities/account/use-sub-accounts";
import { SignUpSubAccountBodyDto, SubAccountDto } from "@/shared/api/generated";
import { UiButton, UiCard } from "@/shared/ui";
import { Ellipsis, Pencil, TrashBin } from "@gravity-ui/icons";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

import { SubAccountAddFormDialog } from "./subaccount-add-form-dialog";
import { SubAccountEditFormDialog } from "./subaccount-edit-form-dialog";

export function AccountSubAccounts() {

    const { subAccounts, isLoading, isError, error } = useSubAccounts();
    

    const toast = useRef<Toast>(null);
    const menuLeft = useRef<Menu>(null);
    const pt = {
        table: {
            className: 'my-2'
        },
        headerCell: {
            className: 'bg-transparent  border-b border-gray-200'
        },
        headerTitle: {
            className: 'text-brand-900 font-sans ',
        },
        bodyCell: {
            className: 'text-slate-900 text-base'
        },
        bodyRow: {
            className: 'bg-transparent hover:bg-white/70 hover:shadow-md border-b  border-gray-200'
        }
    }

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const handleOpenDialog = () => {
        setIsAddDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setIsAddDialogOpen(false);
    };

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentSubAccount, setCurrentSubAccount] = useState<SignUpSubAccountBodyDto | SubAccountDto | null>(null);
    const handleEdit = (subAccount: SubAccountDto) => {
        setCurrentSubAccount(subAccount);
        setIsEditDialogOpen(true);
    };
    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    return (
        <UiCard className="bg-white shadow-md flex flex-col gap-4 p-8">
            <div className="flex flex-row justify-between gap-2">
                <div className="text-xl font-semibold">Суб-аккаунты</div>
                <UiButton outlined size="small" onClick={handleOpenDialog}>Добавить суб-аккаунт</UiButton>

                <SubAccountAddFormDialog
                    isOpen={isAddDialogOpen}
                    onClose={handleCloseDialog}
                />
            </div>
            {isLoading && <div>Loading...</div>}
            {isError && error && <div>Error: {error.message}</div>}
            <DataTable
                className='font-sans my-2 bg-white'
                value={subAccounts}
                pt={pt}
                dataKey="id"
                emptyMessage="Аккаунты не найдены"
                sortField="createdAt"
            >
                <Column header="Название" body={(account: SubAccountDto) => {
                    return <div className="flex flex-col gap-1">
                        <p className="text-lg">{account.name}</p>
                        <p className="text-xs">{new Date(account.createdAt).toLocaleDateString()}</p>
                    </div>
                }} />
                <Column header="Контакты" body={(account: SubAccountDto) => {
                    return <div className="flex flex-col gap-1">
                        <p className="text-xs">{account.email}</p>
                        <p className="text-xs">{account.phone}</p>
                    </div>
                }} />
                <Column header="Комментарий" field="comment" />
                <Column header="Адрес" field="address" />
                <Column header=" " style={{ width: '4rem' }} body={(account: SubAccountDto) => {
                    return <div className="flex flex-row gap-2">
                        <Toast ref={toast}></Toast>
                        <Menu model={[
                            { label: 'Редактировать', icon: <Pencil className="mr-2" />, command: () => { handleEdit(account) } },
                            { label: 'Удалить', icon: <TrashBin className="mr-2" /> },
                        ]} popup ref={menuLeft} id="popup_menu_left" />
                        <UiButton text severity="secondary" className="mr-2" onClick={(event) => menuLeft?.current?.toggle(event)}><Ellipsis /></UiButton>
                    </div>
                }} />
            </DataTable>

            <SubAccountEditFormDialog
                isOpen={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                initialData={currentSubAccount as SubAccountDto}
            />
        </UiCard>
    );
}
