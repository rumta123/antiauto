import React from 'react';
import { AutoComplete, AutoCompleteProps } from 'primereact/autocomplete';
import clsx from 'clsx';
import { Xmark } from '@gravity-ui/icons';

interface UiAutoCompleteProps extends AutoCompleteProps {
    label?: string;
    showClear?: boolean;
    uiSize?: 'small' | 'large'
}


export const UiAutoComplete: React.FC<UiAutoCompleteProps> = ({ className, label, uiSize, showClear, ...props }) => {
    const handleClear = (e: React.SyntheticEvent<Element, Event>) => {

        if (props.onClear) {
            props.onClear(e);
        }
    };
    return (
        <div className={clsx(
            "border rounded-lg bg-white flex flex-row gap-2 items-center focus-within:ring-brand focus-within:ring-2 shadow-sm",
            (props.disabled && "!bg-neutral-200 !border-0 !cursor-not-allowed"),
            (props.readOnly && "read-only:!bg-brand-50 read-only:!cursor-default"),
            className
        )}>

            {label && (
                <label className={clsx(
                    'font-bold pl-4 ',
                    {
                        'py-1 text-sm': uiSize === "small",
                        'py-2': uiSize === undefined
                    }
                )}>{label}:</label>
            )}
            <AutoComplete
                className={clsx(


                )}
                pt={{
                    root: {
                        className: 'w-full'
                    },
                    input: {
                        root: {
                            className: clsx(
                                'w-full bg-inherit rounded-lg z-40 pl-0',
                                'border-0 focus:border-0 hover:border-0 ',
                                'shadow-none focus:shadow-none dark:shadow-none ',
                                'ring-0 hover:ring-0 focus:ring-0',
                                {
                                    'py-1.5 text-sm': uiSize === "small"
                                }
                            )
                        }
                    }
                }}
                {...props} />
            {showClear && (
                    <button
                        className={clsx(
                            'shrink-0 flex justify-center rounded-lg !w-10 h-8 font-medium text-center ',
                            'p-button rounded-lg w-10 h-8 font-medium align-middle text-center  mx-2 p-1',
                            // 'hover:bg-gray-200 focus:ring-0'
                            'hover:text-brand-300 focus:ring-0'
                        )}
                        onClick={handleClear} >
                        <Xmark />
                    </button>
                )}
        </div>

    );
};

export default UiAutoComplete;
