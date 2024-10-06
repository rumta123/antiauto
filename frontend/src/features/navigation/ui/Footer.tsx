// src/components/Footer.tsx

import { UILink } from '@/shared/ui/UiLink';
import React from 'react';

export function Footer () {
    return (
        <footer className="py-12 ">
            <div className="container mx-auto max-w-[1280px]  grid grid-cols-2 gap-4 content-between">
                <p className="text-sm text-slate-400">2023 Покупай. Все права защищены</p>
                <div className="flex flex-row items-end justify-end gap-10 text-slate-400">
                    <div className='flex flex-col '>
                        <UILink href="#link1">О сервисе</UILink>
                        <UILink href="#link2">Условие работы</UILink>
                        <UILink href="/help">Помощь</UILink>
                    </div>

                    <div className='flex flex-col '>
                        <UILink href="#link4">Отзывы о сервисе</UILink>
                        <UILink href="#link5">Пользовательское соглашение</UILink>
                        <UILink href="#link6">Условия обработки персональных данных</UILink>
                    </div>
                </div>
            </div>
        </footer>
    );
};


