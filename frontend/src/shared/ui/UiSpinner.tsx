import React, { CSSProperties } from 'react';
import { ProgressSpinner, ProgressSpinnerProps } from 'primereact/progressspinner';
import clsx from 'clsx';

interface UiSpinnerProps extends ProgressSpinnerProps {
    style?: CSSProperties;
    className?: string;
}

export function UiSpinner ({ style, className, ...rest }:UiSpinnerProps) {
    return (
        <div className={clsx('ui-spinner w-full flex flex-row items-center justify-center my-10', className )} style={style}>
            <ProgressSpinner {...rest} />
        </div>
    );
};