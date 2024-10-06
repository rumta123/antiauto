import React, { forwardRef, useState } from 'react';
import { InputNumber, InputNumberChangeEvent, InputNumberProps } from 'primereact/inputnumber';
import { Xmark } from '@gravity-ui/icons';
import clsx from 'clsx';

interface UiInputNumberProps extends Omit<InputNumberProps, 'onChange'> {
    uiSize?: 'small' | 'large'
    label?: string;
    iconBefore?: React.JSX.Element;
    className?: string;
    onChange?: (e: InputNumberChangeEvent) => void;
    showClear?: boolean;
    onClear?: () => void;
    readOnly?: boolean;
    disabled?: boolean;
    suggested?: boolean;
}

export const UiInputNumber = forwardRef<HTMLInputElement, UiInputNumberProps>(
    ({ label, iconBefore, className, onChange, showClear, onClear, readOnly, disabled, suggested = false, uiSize, ...inputProps }, ref) => {
        const [inputValue, setInputValue] = useState<number | null>(null);

        const handleInputChange = (e: InputNumberChangeEvent) => {
            setInputValue(e.value);
            if (onChange) {
                onChange(e);
            }
        };

        const handleClear = () => {
            setInputValue(null);
            if (onClear) {
                onClear();
            }
        };

        return (
            <div className={clsx(
                className,
                "border rounded-lg bg-white flex flex-row gap-2 items-center focus-within:ring-brand-600 focus-within:ring-2 shadow-sm",
                (suggested ? 'border-brand-300' : 'border-neutral-300'),
                (disabled && "!bg-neutral-200 !border-0 !cursor-not-allowed"),
                (readOnly && "read-only:!bg-seabrand-50 read-only:border-seabrand-50 read-only:!cursor-default")
            )}>
                {label && <label className={clsx(
                    'font-bold pl-4  text-nowrap',
                    {
                        'py-1 text-sm': uiSize === "small",
                        'py-2': uiSize === undefined
                    }
                )}>{label}:</label>}
                {iconBefore && <div className=' pl-4 py-2 '>{iconBefore}</div>}
                <InputNumber
                    value={inputValue}
                    onChange={handleInputChange}
                    readOnly={readOnly}
                    disabled={disabled}
                    pt={{
                        input: {
                            root: {
                                className: clsx(
                                    'w-full !bg-inherit rounded-lg pl-0',
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
                    inputClassName={clsx(
                        'w-full !bg-inherit rounded-lg pl-0',
                        'border-0 focus:border-0 hover:border-0 ',
                        'shadow-none focus:shadow-none dark:shadow-none ',
                        'ring-0 hover:ring-0 focus:ring-0',
                        {
                            'py-1.5 text-sm': uiSize === "small"
                        }
                    )}
                    {...inputProps}
                />
                {showClear && (
                    <button
                        className={clsx(
                            'shrink-0 flex justify-center rounded-lg !w-10 h-10 font-medium text-center ',
                            'p-button rounded-lg w-10 h-10 font-medium align-middle text-center  mx-2 p-2',
                            'hover:text-brand-300 focus:ring-0'
                        )}
                        onClick={handleClear} >
                        <Xmark />
                    </button>
                )}

            </div>
        );
    }
);
UiInputNumber.displayName = 'UiInputNumber';

export default UiInputNumber;
