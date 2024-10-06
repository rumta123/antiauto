

import { Tag } from 'primereact/tag';
import React from 'react';
import { MapPin } from '@gravity-ui/icons';
import UiCityTag from '@/shared/ui/UiCityTag';

export default function LotCreateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='container max-w-[1280px] mx-auto'>
            <div className="flex flex-col">
                <div className='grid grid-cols-12 gap-8'>
                    <div className='col-span-8'>
                        {children}
                    </div>
                    <div className='col-span-4'>

                        {/* БЛОК С ЗАВЕРШЁННЫМИ АУКЦИОНАМИ */}
                        <div className='mb-4'><span className='font-bold'>194</span> дилера могут вам помочь</div>
                        <div className="flex flex-col gap-4">
                            {[
                                { title: 'Audi А4 2012 - 2016 8V кабриолет', desc: 'Advance 45 TFSI quattro S tronic', city: 'Красноярск', price: 'от 2 578 000' },
                                { title: 'Audi А4 2012 - 2016 8V кабриолет', desc: 'Advance 45 TFSI quattro S tronic', city: 'Красноярск', price: 'от 2 578 000' },
                                { title: 'Audi А4 2012 - 2016 8V кабриолет', desc: 'Advance 45 TFSI quattro S tronic', city: 'Красноярск', price: 'от 2 578 000' }
                            ].map((item,index) => (
                                <div key={index} className='bg-seabrand-50 rounded-lg p-4 shadow-sm flex flex-col gap-2'>
                                    <p className='font-bold'>{item.title}</p>
                                    <p className='text-gray-400'>{item.desc}</p>
                                    <div>
                                        <UiCityTag text={ item.city} />
                                    </div>
                                    <p className='text-2xl font-bold text-seabrand-800'>{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}