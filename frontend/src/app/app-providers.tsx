'use client'
import { queryClient } from "@/shared/api/query-client";
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react";
import { PrimeReactProvider } from 'primereact/api';
import { twMerge } from 'tailwind-merge';
import 'primereact/resources/primereact.min.css';
import "primereact/resources/themes/tailwind-light/theme.css";

import Tailwind from 'primereact/passthrough/tailwind';
import { usePassThrough } from "primereact/passthrough";
import clsx from "clsx";

export function AppProvider({ children }: { children?: ReactNode }) {

    const TWMixedDS = usePassThrough(
        Tailwind,
        {
            image: {
                image: {
                    className: 'w-full h-full object-cover object-center rounded-lg'
                },
                button: {
                    className: 'rounded-lg'
                }
            },
            menu: {
                root: {
                    className: 'py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-white/80 border border-gray-300 dark:border-blue-900/40 rounded-md w-48'
                },
                menu: {
                    className: clsx('m-0 p-0 list-none', 'outline-none')
                },
                content: ({ context }: { context: any }) => ({
                    className: clsx(
                        'text-gray-700 dark:text-white/80 transition-shadow duration-200 rounded-none',
                        'hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-gray-800/80', // Hover
                    )
                }),
                action: {
                    className: clsx('text-gray-700 dark:text-white/80 py-3 px-5 select-none', 'cursor-pointer flex items-center no-underline overflow-hidden relative')
                },
                icon: { className: 'text-gray-600 dark:text-white/70 mr-2' },
                submenuheader: {
                    className: clsx('m-0 p-3 text-gray-700 dark:text-white/80 bg-white dark:bg-gray-900 font-bold rounded-tl-none rounded-tr-none')
                }
            },
            menubar: {
                submenu: ({ props }: { props: any }) => ({
                    className: clsx('py-1 bg-white dark:bg-gray-900 border-0  sm:shadow-md sm:w-48', 'w-full static shadow-none', 'sm:absolute z-10', 'm-0 list-none', {
                        'sm:absolute sm:right-0 sm:left-auto sm:top-auto': !props.root
                    })
                }),
            },
            carousel: {
                root: 'flex flex-col',
                content: 'flex flex-col overflow-auto',
                container: ({ props }: { props: any }) => ({
                    className: clsx('flex', {
                        'flex-row': props.orientation !== 'vertical',
                        'flex-col': props.orientation == 'vertical'
                    })
                }),
                previousbutton: {
                    className: clsx('flex justify-center items-center self-center overflow-hidden relative shrink-0 grow-0', 'w-8 h-8 text-gray-600 border-0 bg-transparent rounded-full transition duration-200 ease-in-out mx-2')
                },
                itemscontent: 'overflow-hidden w-full',
                itemscontainer: ({ props }: { props: any }) => ({
                    className: clsx('flex ', {
                        'flex-row': props.orientation !== 'vertical',
                        'flex-col h-full': props.orientation == 'vertical'
                    })
                }),
                item: ({ props }: { props: any }) => ({
                    className: clsx('flex shrink-0 grow', {
                        'w-1/3': props.orientation !== 'vertical',
                        'w-full': props.orientation == 'vertical'
                    })
                }),
                indicators: {
                    className: clsx('flex flex-row justify-center flex-wrap')
                },
                indicator: 'mr-2 mb-2',
                indicatorbutton: ({ context }: { context: any }) => ({
                    className: clsx('w-8 h-2 transition duration-200 rounded-0', 'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]', {
                        'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600': !context.active,
                        'bg-blue-500 hover:bg-blue-600': context.active
                    })
                })
            },
            skeleton: {
                root: {
                    className: clsx(
                        'overflow-hidden',
                        '!mb-2',
                        'bg-gray-300 dark:bg-gray-800',
                        'after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:content after:w-full after:h-full after:bg-blue-400 after:left-full after:transform after:translate-x-full after:z-10 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent animate-pulse',

                    )
                }
            },
            tooltip: {
                root: { className: 'shadow-none ' },
                text: { className: 'shadow-lg bg-white text-slate-900 text-sm' },
                arrow: ({ context }: { context: any }) => ({
                    className: clsx('absolute w-0 h-0 shadow-lg border-transparent border-solid', {
                        '-mt-1 border-y-[0.25rem] border-r-[0.25rem] border-l-0 border-r-white': context.right,
                        '-mt-1 border-y-[0.25rem] border-l-[0.25rem] border-r-0 border-l-white': context.left,
                        '-ml-1 border-x-[0.25rem] border-t-[0.25rem] border-b-0 border-t-white': context.top,
                        '-ml-1 border-x-[0.25rem] border-b-[0.25rem] border-t-0 border-b-white': context.bottom
                    })
                }),
            },
            rating: {
                root: ({ props }: { props: any }) => ({
                    className: clsx('relative flex items-center', 'gap-2', {
                        'opacity-60 select-none pointer-events-none cursor-default': props.disabled
                    })
                }),
                cancelitem: ({ context }: { context: any }) => ({
                    className: clsx('inline-flex items-center cursor-pointer', {
                        'outline-none outline-offset-0 shadow-gray-100 dark:shadow-gray-500': context?.focused
                    })
                }),
                cancelicon: {
                    className: clsx('text-red-500', 'w-5 h-5', 'transition duration-200 ease-in')
                },
                item: ({ props, context }: { props: any, context: any }) => ({
                    className: clsx(
                        'inline-flex items-center shadow-none',
                        {
                            'cursor-pointer': !props.readOnly,
                            'cursor-default': props.readOnly
                        },
                        {
                            'outline-none outline-offset-0 shadow-gray-100 dark:shadow-gray-500': context?.focused
                        }
                    )
                }),
                officon: {
                    className: clsx('text-gray-700 hover:text-blue-400', 'w-5 h-5', 'transition duration-200 ease-in')
                },
                onicon: {
                    className: clsx('text-blue-500', 'w-5 h-5', 'transition duration-200 ease-in')
                }
            },
            calendar: {
                root: ({ props }:{props:any}) => ({
                    className: clsx('inline-flex max-w-full relative', {
                        'opacity-60 select-none pointer-events-none cursor-default': props.disabled
                    })
                }),
                input: {
                    root: ({ parent }: {parent:any}) => ({
                        className: clsx('font-sans text-base text-gray-600 dark:text-white/80 bg-white dark:bg-gray-900 p-3 border border-gray-300 dark:border-blue-900/40 transition-colors duration-200 appearance-none', 'hover:border-blue-500', {
                            'rounded-lg': !parent.props.showIcon,
                            'border-r-0 rounded-l-lg': parent.props.showIcon
                        })
                    })
                },
                dropdownButton: {
                    root: ({ props }: { props: any}) => ({
                        className: clsx({ 'rounded-l-none': props.icon })
                    })
                },
                // panel: ({ props }:{ props:any }) => ({
                //     className: clsx('bg-white dark:bg-gray-900', 'min-w-full', {
                //         'shadow-md border-0 absolute': !props.inline,
                //         'inline-block overflow-x-auto border border-gray-300 dark:border-blue-900/40 p-2 rounded-lg': props.inline
                //     })
                // }),
                header: {
                    className: clsx('flex items-center justify-between', 'p-1 text-gray-700 dark:text-white/80 bg-white dark:bg-gray-900 font-semibold m-0 border-b border-gray-300 dark:border-blue-900/40 rounded-t-lg')
                },
                previousButton: {
                    className: clsx(
                        'flex items-center justify-center cursor-pointer overflow-hidden relative',
                        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
                    )
                },
                title: 'leading-4 mx-auto',
                monthTitle: {
                    className: clsx('text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-1', 'mr-2', 'hover:text-blue-500')
                },
                yearTitle: {
                    className: clsx('text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-1', 'hover:text-blue-500')
                },
                nextButton: {
                    className: clsx(
                        'flex items-center justify-center cursor-pointer overflow-hidden relative',
                        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
                    )
                },
                table: {
                    className: clsx('border-collapse w-full', 'my-1')
                },
                tableHeaderCell: 'p-1',
                weekday: 'text-gray-600 dark:text-white/70',
                day: 'p-1',
                dayLabel: ({ context }:{context:any}) => ({
                    className: clsx(
                        'w-8 h-8 rounded-full transition-shadow duration-200 border-transparent border',
                        'flex items-center justify-center mx-auto overflow-hidden relative',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                        {
                            'opacity-60 cursor-default': context.disabled,
                            'cursor-pointer': !context.disabled
                        },
                        {
                            'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                            'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled
                        }
                    )
                }),
                monthPicker: 'my-2',
                month: ({ context }:{context:any}) => ({
                    className: clsx(
                        'w-1/3 inline-flex items-center justify-center cursor-pointer overflow-hidden relative',
                        'p-1 transition-shadow duration-200 rounded-lg',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                        { 'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled, 'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled }
                    )
                }),
                yearPicker: {
                    className: clsx('my-2')
                },
                year: ({ context }:{context:any}) => ({
                    className: clsx(
                        'w-1/2 inline-flex items-center justify-center cursor-pointer overflow-hidden relative',
                        'p-1 transition-shadow duration-200 rounded-lg',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                        {
                            'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                            'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled
                        }
                    )
                }),
                timePicker: {
                    className: clsx('flex justify-center items-center', 'border-t-1 border-solid border-gray-300')
                },
                separatorContainer: 'flex items-center flex-col px-2',
                separator: 'text-xl',
                hourPicker: 'flex items-center flex-col px-2',
                minutePicker: 'flex items-center flex-col px-2',
                ampmPicker: 'flex items-center flex-col px-2',
                incrementButton: {
                    className: clsx(
                        'flex items-center justify-center cursor-pointer overflow-hidden relative',
                        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
                    )
                },
                decrementButton: {
                    className: clsx(
                        'flex items-center justify-center cursor-pointer overflow-hidden relative',
                        'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                        'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
                    )
                },
                groupContainer: 'flex',
                group: {
                    className: clsx('flex-1', 'border-l border-gray-300 pr-0.5 pl-0.5 pt-0 pb-0', 'first:pl-0 first:border-l-0')
                },
                transition: {
                    timeout: 150,
                    classNames: {
                        enter: 'opacity-0 scale-75',
                        enterActive: 'opacity-100 !scale-100 transition-transform transition-opacity duration-150 ease-in',
                        exit: 'opacity-100',
                        exitActive: '!opacity-0 transition-opacity duration-150 ease-linear'
                    }
                }
            }

        },
        { mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge }
    )

    return (
        <PrimeReactProvider
            value={{
                unstyled: true,
                pt: TWMixedDS,
                ptOptions: { mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge }
            }}
        >

            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>

        </PrimeReactProvider>
    )
}