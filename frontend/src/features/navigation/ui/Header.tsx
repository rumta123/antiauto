"use client";
import { useSessionQuery } from '@/entities/session';
// import { SignOutButton } from '@/features/auth';

import React from 'react';
import useScroll from "@/shared/hooks/use-scroll";

import { UILink } from '@/shared/ui/UiLink';
import { SignOutButton } from '@/features/auth';
import ProfileMenu from './ProfileMenu';
import { Car } from '@gravity-ui/icons';



export  function Header() {

    const scrolled = useScroll(50);

    return (
         <header className={`fixed top-0 w-full p-3 text-gray-700 border-b border-gray-100 bg-white/50 backdrop-blur-xl z-[100]`}>
            <div className="container mx-auto max-w-[1280px] ">
                <div className='flex items-center'> {/* justify-between  */}
                    <div className='flex flex-row items-center'>
                        <a href="/" className='flex flex-row gap-4 items-center'>
                            <div className='bg-seabrand-600 text-white rounded-lg w-10 h-10 flex items-center justify-center'>
                                <Car className='w-6 h-6'/>
                            </div>
                            <p className='text-2xl font-bold text-brand-900'>Аукцион</p>
                        </a>
                        <UILink className='px-4 pl-8 text-sm underline underline-offset-4' href="/catalog">Каталог</UILink>
                        {/* <UILink className='px-4 text-sm underline underline-offset-4' href="/">Стать дилером</UILink> */}
                    </div>
                    <ProfileMenu />
                    {/* <SignOutButton /> */}
                </div>
            </div>
        </header>

    );
}
