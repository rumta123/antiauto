
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from './app-providers';
import { Footer, Header } from '@/features/navigation';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Car auction',
    description: '',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>

                <AppProvider>
                    <div>
                        {/* <div className="min-h-screen flex flex-col  text-slate-800 bg-gradient-to-br from-[#f3f1ff] via-white via-30% to-[#eefcfd]"> */}
                        <div className="min-h-screen flex flex-col  text-slate-800 bg-[url('/90909090.jpeg')] bg-repeat-y " style={{ backgroundSize: "100% auto" }}>
                            <div className='flex-grow relative'>
                                <Header />

                                <div className='pt-28 pb-10'>
                                    {children}
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </AppProvider>

            </body>
        </html>
    )
}
