import { usePatchAccount } from "@/entities/account/use-patch-account";
import { UiButton, UiInput } from "@/shared/ui";
import { ArrowUturnCcwLeft, FloppyDisk, PencilToLine } from "@gravity-ui/icons";
import { useEffect, useState } from "react";

interface AccountNameProps {
    name?: string;
}
export function AccountName({ name }: AccountNameProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedName, setEditedName] = useState(name);
    useEffect(()=>setEditedName(name),[name])
    const { updateAccount, isPending, isError, error } = usePatchAccount();
    return <>
        {!isEditMode ?
            <div className="flex flex-row items-center gap-2">
                {name?.length ?
                    <p className='text-2xl text-slate-900 font-semibold'>{name}</p>
                    : <p className='text-2xl text-slate-400 font-semibold'>ФИО</p>}
                <UiButton text onClick={()=>setIsEditMode(true)}><PencilToLine/></UiButton>
            </div>
            :
            <div className="flex flex-row items-center gap-2">
                <UiInput label="ФИО" value={editedName||''} onChange={(e) => setEditedName(e.currentTarget.value)} className="w-2/5" />
                <UiButton text onClick={() => {
                    setEditedName(name)
                    setIsEditMode(false)
                }}><ArrowUturnCcwLeft /></UiButton>
                <UiButton text onClick={() => {
                    updateAccount({ name: editedName });
                    setIsEditMode(false);
                }}><FloppyDisk /></UiButton>
            </div>
        }

    </>
}