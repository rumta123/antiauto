
import React from 'react';


export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='container max-w-[1280px] mx-auto'>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}