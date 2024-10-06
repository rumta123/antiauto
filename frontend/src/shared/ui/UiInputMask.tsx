import React, { useEffect, useState } from 'react';

import { InputMask, InputMaskProps } from 'primereact/inputmask';
import { Xmark } from '@gravity-ui/icons';
import clsx from 'clsx';

interface UiInputMaskProps extends InputMaskProps {
    label?: string;
    className?: string;
    showClear?: boolean;
    onClear?: () => void;
    readOnly?: boolean;
    disabled?: boolean;
    suggested?: boolean;
}

export const UiInputMask: React.FC<UiInputMaskProps> = (
    ({ label, className, showClear, onClear, readOnly, disabled, suggested = false, ...inputProps }) => {
        const [inputValue, setInputValue] = useState(inputProps.value);

        useEffect(() => {
            setInputValue(inputProps.value || '');
        }, [inputProps.value]);

        const handleInputChange = (e: any) => {
            const newValue = e.value;
            setInputValue(newValue);
            if (inputProps.onChange) {
                inputProps.onChange(e); // Вызов внешнего обработчика, если он предоставлен
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
                {label && <label className='font-bold pl-4 py-2'>{label}:</label>}
                <InputMask
                    {...inputProps}
                    value={inputValue}
                    onChange={handleInputChange}
                    readOnly={readOnly}
                    disabled={disabled}
                    pt={{
                        root: {
                            className: clsx(
                                'w-full bg-inherit rounded-lg pl-0',
                                'border-0 focus:border-0 hover:border-0 ',
                                'shadow-none focus:shadow-none dark:shadow-none ',
                                'ring-0 hover:ring-0 focus:ring-0'
                            )
                        }
                    }}
                />
                {showClear && (
                    <button
                        className={clsx(
                            'shrink-0 flex justify-center rounded-lg !w-10 h-10 font-medium text-center ',
                            'p-button rounded-lg w-10 h-10 font-medium align-middle text-center  mx-2 p-2',
                            'hover:bg-gray-200 focus:ring-0'
                        )}
                        onClick={handleClear} >
                        <Xmark />
                    </button>
                )}
            </div>
        );
    }
);

export default UiInputMask;
