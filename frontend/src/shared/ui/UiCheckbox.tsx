import React, { CSSProperties } from 'react';

import clsx from 'clsx';

import { Button } from 'primereact/button';
import { Checkbox, CheckboxProps } from 'primereact/checkbox';

interface UiCheckboxProps extends CheckboxProps {
    text?: string;
    checkboxId?: string | undefined
    // className?: string;
    labelClassName?: string;
}

const UiCheckbox: React.FC<UiCheckboxProps> = ({ text, checkboxId,labelClassName, ...rest }) => {
    return (
        <div className='flex flex-row items-center'>
            <Checkbox
                inputId={checkboxId}
                pt={{
                    input: ({ props, context }: { props: any, context: any }) => ({
                        className: [
                            'flex items-center justify-center appearance-none absolute',
                            'border-2 !w-6 !h-6 text-slate-600 rounded-lg transition-colors duration-200 ',
                            {
                                'border-slate-300 bg-white dark:border-blue-900/40 dark:bg-slate-900': !context.checked,
                                'border-slate-300 bg-seabrand-100 dark:border-blue-400 dark:bg-blue-400': context.checked
                            },
                            {
                                'hover:border-seabrand-600 dark:hover:border-seabrand-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !props.disabled,
                                'cursor-default opacity-40': props.disabled
                            }
                        ]
                    }),
                    icon: { className: 'text-transparent w-4 h-4 transition-all duration-200 text-white text-base dark:text-gray-900' }
                }}
                {...rest}
            />
            {text &&
                <label
                    htmlFor={checkboxId}
                    className={clsx(
                        'ml-2 text-sm',
                        rest.checked && 'font-semibold',
                        rest.disabled ? 'text-neutral-400' : 'text-slate-700',
                        labelClassName
                    )}>
                    {text}
                </label>
            }
        </div>
    );
};

export default UiCheckbox;
