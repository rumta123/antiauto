import React from 'react';



export default function AuctionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='container max-w-[1280px] mx-auto'>
            {children}
        </div>
    )
}