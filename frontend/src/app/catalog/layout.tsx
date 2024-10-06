
import React from 'react';


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='container max-w-[1280px] mx-auto'>
            <div className="flex flex-col">
                <h1 className='text-4xl text-brand-900 font-black leading-9'>Каталог</h1>
                {children}
            </div>
        </div>
    )
}