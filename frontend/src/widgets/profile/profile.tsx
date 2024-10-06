import { useAccount } from "@/entities/account/use-account";

import { useSignOut } from "@/features/auth/model/use-sign-out";
import { AccountContacts, AccountName, AccountSubAccounts, StatCustomer, StatSeller } from "@/features/profile";
import { UiButton } from "@/shared/ui";

export function ProfileWidget() {
    const { account } = useAccount()
    const { isPending, signOut } = useSignOut()
    return <>
        <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
                <h1 className='text-4xl text-brand-900 font-black leading-9'>Личный кабинет</h1>
                <UiButton outlined size="small" onClick={() => signOut({})} loading={isPending}>Выйти</UiButton>
            </div>

            <AccountName name={account?.name} />

            {account?.accountType === 'seller' && <StatSeller />}
            {account?.accountType === 'customer' && <StatCustomer />}

            <AccountContacts accountData={account} />

            {(account?.accountType === 'seller' || account?.accountType === 'root') && <AccountSubAccounts />}

            <div className="flex flex-row gap-4 items-center">
                <UiButton size="small" outlined>Удалить аккаунт</UiButton>
                <span className="text-xs text-slate-400">{`Действие безвозвратно удалит все данные${account?.accountType === 'seller' ? ', включая субаккаунты,':''} в течение 7 дней`}</span>
            </div>
        </div>
    </>
}