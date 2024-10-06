import React, { forwardRef, useState } from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import clsx from 'clsx';
import { Xmark } from '@gravity-ui/icons';

interface UiSelectProps extends DropdownProps {
    uiSize?: 'small' | 'large';
    label?: string;
    placeholder?: string;
    className?: string;
    options: { label: string; value: any }[];
    onChange?: (value: any) => void;
    showClear?: boolean;
    onClear?: () => void;
    readOnly?: boolean;
    disabled?: boolean;
    suggested?: boolean;
}

export const UiSelect = forwardRef<HTMLDivElement, UiSelectProps>(
    ({ label, placeholder, className, options, onChange, showClear, onClear, readOnly, disabled, suggested = false, uiSize, ...props }, ref) => {
        const [selectedValue, setSelectedValue] = useState<any>(null);

        const handleSelectChange = (e: { value: any }) => {
            setSelectedValue(e.value);
            if (onChange) {
                onChange(e.value);
            }
        };

        const handleClear = () => {
            setSelectedValue(null);
            if (onClear) {
                onClear();
            }
        };

        return (
            <div className={clsx(
                className,
                "border",
                "  rounded-lg bg-white flex flex-row gap-2 items-center focus-within:ring-brand-600 focus-within:ring-2 shadow-sm",
                (suggested ? 'border-brand-300' : 'border-neutral-300'),
                (disabled && "!bg-neutral-200 !border-0 !cursor-not-allowed"),
                (readOnly && "read-only:!bg-seabrand-50 read-only:border-seabrand-50 read-only:!cursor-default")
            )} ref={ref}>
                {label && <label className='font-bold pl-4 text-nowrap flex-none'>{label}:</label>}
                <div className='shrink grow min-w-1'>
                    <Dropdown
                        value={selectedValue}
                        options={options}
                        onChange={handleSelectChange}
                        emptyMessage=' '
                        emptyFilterMessage=' '
                        pt={{
                            root: {
                                className: clsx(
                                    ' grow w-full bg-inherit rounded-lg',
                                    'border-0 focus:border-0 hover:border-0 ',
                                    'shadow-none focus:shadow-none dark:shadow-none ',
                                    'ring-0 hover:ring-0 focus:ring-0',
                                    'md\:w-full'
                                )
                            },
                            input: ({ props }: { props: any }) => ({
                                className: clsx(
                                    'shadow-none',
                                    label ? ' pl-0' : 'pl-4',
                                    {
                                        'py-1.5 text-sm': uiSize === "small"
                                    }
                                )
                            }),
                            trigger: {
                                className: clsx(
                                    (readOnly || disabled) && 'hidden'
                                )
                            }
                        }}
                        disabled={disabled || readOnly}
                        placeholder={(!readOnly && !disabled) ? placeholder : '\u00A0'}
                        {...props}
                    />
                </div>
                {showClear && (
                    <button
                        className={clsx(
                            'shrink-0 flex-none justify-center rounded-lg !w-10 h-10 font-medium text-center ',
                            'p-button rounded-lg w-10 h-10 font-medium align-middle text-center  mr-2 p-2',
                            // 'hover:bg-gray-200 focus:ring-0'
                            'hover:text-brand-300 focus:ring-0'
                        )}
                        onClick={handleClear}
                    >
                        <Xmark />
                    </button>
                )}
            </div>
        );
    }
);
UiSelect.displayName = 'UiSelect';

export default UiSelect;
