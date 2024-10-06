
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

// export const metadata: Metadata = {
//     title: 'Car auction',
//     description: '',
// }

function DealerLayout({children}: PropsWithChildren<unknown>) {
    return (
        <div className='container max-w-[1280px] mx-auto'>
            {children}
        </div>
    )
}

export default DealerLayout;