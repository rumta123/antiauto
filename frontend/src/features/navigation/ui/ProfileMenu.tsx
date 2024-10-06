"use client";

import { useSessionQuery } from "@/entities/session";
import { SignOutButton } from "@/features/auth";
import { UILink } from "@/shared/ui/UiLink";
import { Bell, CircleQuestion, Comment, ArrowRightFromSquare, Person } from '@gravity-ui/icons';

import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from "react";
import UiButton from "@/shared/ui/UiButton";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Menubar } from "primereact/menubar";
import { AxiosError } from "axios";

export default function ProfileMenu() {
    const { data: sessionData, isError: isSessionError, error: sessionError, status } = useSessionQuery();

    const sessionErrorCode = sessionError instanceof AxiosError
        ? sessionError?.response?.data?.statusCode
        : undefined;

    const router = useRouter();

    const LinkRenderer = (item: any) => (
        <UILink href={item.url}>{item.label}</UILink>
    )
    const IconRenderer = (item: any) => (
        <UiButton text severity="secondary" rounded className="!w-12 !h-12">{item.icon}</UiButton>
    )
    const LitItemRenderer = (item: any) => (
        <div className="py-2 px-4 flex flex-row gap-2 items-center hover:bg-gray-100" >
            {item.icon}
            <p className="text-nowrap text-sm">{item.label}</p>
        </div>
    )
    let linkLeft: any[] = []
    let linksAuth: any[] = [

    ];

    if (sessionData?.type === 'seller') {
        linkLeft = [
            ...linkLeft,
            {
                label: 'Все аукционы',
                url: '/auctions-search',
                template: LinkRenderer
            },
            
        ]
        linksAuth = [
            ...linksAuth,

            {
                label: 'База авто',
                url: '/cars',
                template: LinkRenderer
            },
            {
                label: 'Мои аукционы',
                url: '/my-auctions',
                template: LinkRenderer
            },
            {
                label: 'Статистика',
                url: '/stats',
                template: LinkRenderer
            },
        ];
    } else if (sessionData?.type === 'customer') {
        // linkLeft = [
        //     ...linkLeft,
        //     {
        //         label: 'Создать лот',
        //         url: '/lot-create',
        //         template: LinkRenderer
        //     },
        // ]
        linksAuth = [
            ...linksAuth,
            {
                label: 'Мои аукционы',
                url: '/auctions',
                template: LinkRenderer
            },
        ]
    } else if (sessionData?.type === 'service_desk') {
    } else if (sessionData?.type === 'root') {

    } else { // unauthorised
        linkLeft = [
            ...linkLeft,
            {
                label: 'Стать дилером',
                url: '/sign-up-dealer',
                template: LinkRenderer
            }
        ]
    }

    const itemsAuth = [
        ...linksAuth.map((item, index) => ({ ...item, key: `auth-${index}` })),
        {
            icon: <Comment />,
            template: IconRenderer,
            key: 'auth-comment'
        },
        {
            icon: <Person className='absolute  mx-auto my-auto text-white w-7 h-7 inset-0 translate-y-2' />,
            key: 'auth-person',
            template: (item: any) => (
                <UiButton
                    rounded
                    text
                    severity="secondary"
                    pt={{
                        root: {
                            className: 'bg-seabrand-400 hover:bg-seabrand-300 text-gray-500 !rounded-full w-10 h-10 block relative'
                        }
                    }}>
                    {item.icon}
                </UiButton>
            ),
            items: [
                {
                    label: sessionData?.email,
                    template: (item: any) => (
                        <div className="py-4 px-4 flex flex-row gap-2 items-center text-slate-700" >
                            <p className="text-nowrap text-xs ">{item.label}</p>
                        </div>
                    )
                },
                { separator: true },
                {
                    label: 'Профиль',
                    icon: <Person />,
                    key: 'profile',
                    command: () => router.push("/profile"),
                    template: LitItemRenderer
                },
                {
                    label: 'Сообщения',
                    icon: <Comment />,
                    key: 'chat',
                    command: () => router.push("/chat"),
                    template: LitItemRenderer
                },
                {
                    label: 'Помощь',
                    icon: <CircleQuestion />,
                    key: 'help',
                    command: () => router.push("/help"),
                    template: LitItemRenderer
                },
                { separator: true },
                {
                    data: <SignOutButton />,
                    icon: <ArrowRightFromSquare />,
                    key: 'signout',
                    template: (item: any) => (
                        <div className="flex flex-row gap-2 py-2 px-4 items-center">
                            {item.icon}
                            {item.data}
                        </div>
                    )
                }

            ]
        }
    ];

    const itemsUnAuth = [
        {
            icon: <Person className='absolute animate-pulse  mx-auto my-auto text-neutral-400 w-7 h-7 inset-0 translate-y-2' />,
            template: (item: any) => (
                <UiButton
                    rounded
                    text
                    severity="secondary"
                    pt={{
                        root: {
                            className: `bg-neutral-200  w-10 h-10 block relative ${status === 'pending' ? 'bg-neutral-100' : ''}`
                        }
                    }}>
                    {item.icon}
                </UiButton>
            ),
            items: [
                {
                    label: 'Вход / регистрация',
                    icon: <Person />,
                    command: () => router.push("/sign-in"),
                    template: LitItemRenderer
                },

                {
                    label: 'Помощь',
                    icon: <CircleQuestion />,
                    command: () => router.push("/help"),
                    template: LitItemRenderer
                }
            ]
        }
    ]
    return (
        <div className="flex flex-row justify-between gap-4 items-center w-full">
            {linkLeft.map((item, index) => (
                <div className="flex flex-row  items-center" key={index}>
                    {item.template(item)}
                </div>
            ))}
            <div className="flex flex-row justify-end grow">
                <Menubar
                    model={(sessionData && (!isSessionError && sessionErrorCode !== 401)) ? itemsAuth : itemsUnAuth}
                    pt={{
                        root: {
                            className: 'bg-transparent border-0 p-0 '
                        },
                        menu: ({ state }: { state: any }) => ({
                            className: clsx(
                                'm-0 sm:p-0 list-none',
                                'outline-none',
                                'sm:flex items-center flex-wrap sm:flex-row sm:top-auto sm:left-auto sm:relative sm:bg-transparent sm:shadow-none sm:w-auto',
                                'flex-col gap-4 top-full left-0',
                                'absolute py-1 bg-white dark:bg-gray-900 border-0 shadow-md w-full',
                                {
                                    'hidden ': !state?.mobileActive,
                                    'flex ': state?.mobileActive
                                }
                            )
                        }),
                        menuitem: {
                            className: 'bg-transparent hover:bg-transparent active:bg-transparent shadow-none '
                        },

                    }}
                />
            </div>
        </div>
    );
}
