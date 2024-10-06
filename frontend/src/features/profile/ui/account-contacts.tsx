import { AccountDto } from "@/shared/api/generated"
import { UiButton, UiCard, UiInput } from "@/shared/ui";
import { CircleCheck, CircleXmarkFill } from "@gravity-ui/icons";
import { useState } from "react";
import { AccountPhone } from "./account-phone";
import { useSessionQuery } from "@/entities/session";
import UiTooltipIcon from "@/shared/ui/UiTooltip";
import { AccountChangePassword } from "./account-change-password";


interface AccountContactsProps {
    accountData?: AccountDto;
}
export function AccountContacts({ accountData }: AccountContactsProps) {
    const { data: sessionData, isError: isSessionError, error: sessionError, status } = useSessionQuery();
    
    return <>
        <UiCard className="bg-white shadow-md flex flex-col gap-4 p-8">
            <h3 className="font-semibold text-xl text-slate-700">Контакты</h3>
            <div className="grid grid-cols-12 gap-2 items-center">
                <label className="col-span-2">E-mail</label>
                <UiInput className="col-span-10 pl-4 w-80" value={sessionData?.email||''} readOnly={true}></UiInput>

                <div className="col-span-2 flex flex-row items-center gap-2">
                    <label className="">Телефон</label>
                    {accountData?.isPhoneVerified ?
                        <UiTooltipIcon icon={<CircleCheck className="text-green-500" />} text="Телефон подтвержден" />
                        :
                        <UiTooltipIcon icon={<CircleXmarkFill className="text-red-500" />} text="Телефон не подтвержден" />
                    }
                </div>
                <div className="col-span-10 flex flex-row items-center gap-2">
                    <AccountPhone phone={accountData?.phone } isPhoneVerified={accountData?.isPhoneVerified} />
                </div>

            </div>
            <AccountChangePassword />
        </UiCard>
    </>
}