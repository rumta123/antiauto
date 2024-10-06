'use client'
import React, { Suspense, useEffect, useState } from 'react';

// import Head from 'next/head';

import BrandsCarousel from '@/widgets/BrandsCarousel';
import { SelectBrand } from '@/features/lot-create/ui/select-brand';
import BrandSearchWidget from '@/features/lot-create/ui/brand-search';

export default function Home() {

    return <div className=" bg-[url('/684b0eb8-8b7a-4f25-8e19-b7e280d67315.png')] bg-no-repeat bg-[right_-10rem_bottom_1rem] py-32" >
        <div className='container max-w-[1280px] mx-auto  '>
            <div className=' '>
                <div className=" ">
                    <div className='grid grid-cols-12 gap-4 justify-between self-center'>
                    <div className='lg:col-span-6 2xl:col-span-7'>
                        <h1 className='text-6xl text-brand-900 font-black leading-tight'>
                            Освободим<br /> вас от забот
                        </h1>
                        <p className='py-4 text-xl'>Поможем купить автомобиль мечты по доступной цене или подобрать авто по идеальной цене вашему заказчику</p>
                        <p className='py-4 text-xl'>Для создания лота введите марку и перейдите к выбору следующих характеристик</p>

                        <SelectBrand/>
                    </div>
                    <div className='lg:col-span-7 2xl:col-span-8'>
                        <BrandsCarousel count={6} className='w-full' />

                        <BrandSearchWidget />
                    </div>
                    </div>
                </div>

            </div>
        </div>

    </div>

        ;
}
