import type { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'Car auction auth',
    description: '',
}

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex ">
            <div className="grow flex flex-col py-24">
                <div className="rounded-xl border border-slate-300 px-14 py-8 w-[600px] self-center bg-white">
                    
                    {children}
                </div>
            </div>
        </div>


    )
}
