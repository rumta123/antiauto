import React, { forwardRef, useState } from 'react';
import { InputText, InputTextProps } from 'primereact/inputtext';
import { Xmark } from '@gravity-ui/icons';
import clsx from 'clsx';

interface UiInputProps extends InputTextProps {
    uiSize?: 'small' | 'large'
    label?: string;
    iconBefore?: React.JSX.Element;
    className?: string;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
    showClear?: boolean;
    onClear?: () => void;
    readOnly?: boolean;
    disabled?: boolean;
    suggested?: boolean;
}

export const UiInput = forwardRef<HTMLInputElement, UiInputProps>(
    ({ label, iconBefore, className, onChange, showClear, onClear, readOnly, disabled, suggested = false, uiSize, ...inputProps }, ref) => {
        const [inputValue, setInputValue] = useState('');

        const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
            setInputValue(e.currentTarget.value);
            if (onChange) {
                onChange(e);
            }
        };

        const handleClear = () => {
            setInputValue('');
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
                {label && (<label className={clsx(
                    'font-bold pl-4  text-nowrap', {
                        'py-1 text-sm': uiSize === "small",
                        'py-2': uiSize === undefined
                    }
                )}>{label}:</label>)}
                {iconBefore && <div className=' pl-4 py-2 '>{iconBefore}</div>}
                <InputText
                    value={inputValue}
                    onChange={handleInputChange}
                    readOnly={readOnly}
                    disabled={disabled}
                    ref={ref}

                    pt={{
                        root: {
                            className: clsx(
                                'w-full bg-inherit rounded-lg pl-0',
                                'border-0 focus:border-0 hover:border-0 ',
                                'shadow-none focus:shadow-none dark:shadow-none ',
                                'ring-0 hover:ring-0 focus:ring-0',
                                {
                                    'py-1.5 text-sm': uiSize === "small"
                                }
                                // 'autofill:!bg-transparent autofill:!shadow-none'
                            )
                        }
                    }}
                    {...inputProps}
                />
                {showClear && (
                    <button
                        className={clsx(
                            'shrink-0 flex justify-center rounded-lg !w-10 h-10 font-medium text-center ',
                            'p-button rounded-lg w-10 h-10 font-medium align-middle text-center  mx-2 p-2',
                            // 'hover:bg-gray-200 focus:ring-0'
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
UiInput.displayName = 'UiInput';

export default UiInput;
