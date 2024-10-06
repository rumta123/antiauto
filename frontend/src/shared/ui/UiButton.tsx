import React from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from 'primereact/button';
import { classNames } from 'primereact/utils';


interface UiButtonProps extends ButtonProps {
    className?: string;
}



export const UiButton: React.FC<UiButtonProps> = ({ className, ...props }) => {

    return (

        <Button
            
            pt={{
                root: ({ props, context }: { props: ButtonProps, context: any }) => ({
                    className: classNames(
                        'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom justify-center',
                        'transition duration-200 ease-in-out',
                        'focus:outline-none focus:outline-offset-0 focus:ring-0 ',
                        'active:scale-95 !active:ring-0 ',
                        {
                            'text-white dark:text-gray-900 bg-brand-700 dark:bg-brand-400 border border-brand-900 dark:border-brand-400 hover:bg-brand-900 dark:hover:bg-brand-500 hover:border-brand-900 dark:hover:border-brand-500':
                                !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
                            'text-brand-600 bg-transparent border-transparent ':
                                props.link
                        },
                        {
                            'focus:shadow-lg dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(203,213,225,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                                props.severity === 'secondary',
                            'focus:shadow-lg dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(134,239,172,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                                props.severity === 'success',
                            'focus:shadow-lg dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(147,197,253,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                                props.severity === 'info',
                            'focus:shadow-lg dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(252,211,77,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                                props.severity === 'warning',
                            'focus:shadow-lg dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(216,180,254,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                                props.severity === 'help',
                            'focus:shadow-lg dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(252,165,165,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                                props.severity === 'danger'
                        },
                        {
                            'text-white dark:text-gray-900 bg-gray-500 dark:bg-gray-400 border border-gray-500 dark:border-gray-400 hover:bg-gray-600 dark:hover:bg-gray-500 hover:border-gray-600 dark:hover:border-gray-500':
                                props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
                            'text-white dark:text-gray-900 bg-green-500 dark:bg-green-400 border border-green-500 dark:border-green-400 hover:bg-green-600 dark:hover:bg-green-500 hover:border-green-600 dark:hover:border-green-500':
                                props.severity === 'success' && !props.text && !props.outlined && !props.plain,
                            'text-white dark:text-gray-900 dark:bg-blue-400 bg-blue-500 dark:bg-blue-400 border border-blue-500 dark:border-blue-400 hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500':
                                props.severity === 'info' && !props.text && !props.outlined && !props.plain,
                            'text-white dark:text-gray-900 bg-orange-400 dark:bg-orange-400 border border-orange-400 dark:border-orange-400 hover:bg-orange-500 dark:hover:bg-orange-500 hover:border-orange-500 dark:hover:border-orange-500':
                                props.severity === 'warning' && !props.text && !props.outlined && !props.plain,
                            'text-white dark:text-gray-900 bg-purple-500 dark:bg-purple-400 border border-purple-500 dark:border-purple-400 hover:bg-purple-600 dark:hover:bg-purple-500 hover:border-purple-600 dark:hover:border-purple-500':
                                props.severity === 'help' && !props.text && !props.outlined && !props.plain,
                            'text-white dark:text-gray-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:border-red-600 dark:hover:border-red-500':
                                props.severity === 'danger' && !props.text && !props.outlined && !props.plain
                        },
                        { 'shadow-xl': props.raised },
                        { 'rounded-lg': !props.rounded, 'rounded-full': props.rounded },
                        {
                            'bg-transparent border-transparent': props.text && !props.plain,
                            'text-brand-800 dark:text-blue-400 hover:bg-brand-300/20': props.text && (props.severity === null || props.severity === 'info') && !props.plain,
                            'text-gray-500 dark:text-grayy-400 hover:bg-gray-300/20': props.text && props.severity === 'secondary' && !props.plain,
                            'text-green-500 dark:text-green-400 hover:bg-green-300/20': props.text && props.severity === 'success' && !props.plain,
                            'text-orange-400 dark:text-orange-400 hover:bg-orange-300/20': props.text && props.severity === 'warning' && !props.plain,
                            'text-purple-500 dark:text-purple-400 hover:bg-purple-300/20': props.text && props.severity === 'help' && !props.plain,
                            'text-red-500 dark:text-red-400 hover:bg-red-300/20': props.text && props.severity === 'danger' && !props.plain
                        },
                        { 'shadow-lg': props.raised && props.text },
                        {
                            'text-gray-500 hover:bg-gray-300/20': props.plain && props.text,
                            'text-gray-500 border border-gray-500 hover:bg-gray-300/20': props.plain && props.outlined,
                            'text-white bg-gray-500 border border-gray-500 hover:bg-gray-600 hover:border-gray-600': props.plain && !props.outlined && !props.text
                        },
                        {
                            'bg-transparent border': props.outlined && !props.plain,
                            'text-brand-700 dark:text-blue-400 border border-brand-700 dark:border-blue-400 hover:bg-brand-300/20': props.outlined && (props.severity === null || props.severity === 'info') && !props.plain,
                            'text-gray-500 dark:text-gray-400 border border-gray-500 dark:border-gray-400 hover:bg-gray-300/20': props.outlined && props.severity === 'secondary' && !props.plain,
                            'text-green-500 dark:text-green-400 border border-green-500 dark:border-green-400 hover:bg-green-300/20': props.outlined && props.severity === 'success' && !props.plain,
                            'text-orange-400 dark:text-orange-400 border border-orange-400 dark:border-orange-400 hover:bg-orange-300/20': props.outlined && props.severity === 'warning' && !props.plain,
                            'text-purple-500 dark:text-purple-400 border border-purple-500 dark:border-purple-400 hover:bg-purple-300/20': props.outlined && props.severity === 'help' && !props.plain,
                            'text-red-500 dark:text-red-400 border border-red-500 dark:border-red-400 hover:bg-red-300/20': props.outlined && props.severity === 'danger' && !props.plain
                        },
                        { 'px-4 py-3 text-sm': props.size === null, 'text-xs py-2 px-3': props.size === 'small', 'text-xl py-3 px-4': props.size === 'large' },
                        { 'flex-column': props.iconPos == 'top' || props.iconPos == 'bottom' },
                        { 'opacity-60 pointer-events-none cursor-default': context.disabled },
                        
                    )
                }),
                // root: {
                //     className: classNames(
                //         'rounded-lg  active:scale-95 active:ring-0 focus:ring-0 text-center text-sm justify-center',
                //         !props?.security ?
                //             'bg-brand-700 hover:bg-brand-900 border-brand-700 hover:border-brand-900'
                //             : props?.security === 'secondary' ?
                //                 'bg-transparent hover:bg-gray-200 text-gray-900 border-gray-300'
                //                 : '',
                //         props?.disabled ?
                //             'text-gray-500 bg-gray-200 border-gray-200'
                //             : ''
                //     )
                // }
            }}
            className={clsx('', className)}

            {...props} />

    );
};

export default UiButton;
