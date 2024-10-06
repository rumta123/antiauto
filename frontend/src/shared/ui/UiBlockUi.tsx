import React from 'react';
import { BlockUI, BlockUIProps } from 'primereact/blockui';
import clsx from 'clsx';


interface UiBlockUIProps extends BlockUIProps {
    className?: string;
}

const UiBlockUI: React.FC<UiBlockUIProps> = ({ className, ...props }) => {
    return (

        <BlockUI
            className={clsx('', className)}
            pt={{
                mask: {
                    className: 'rounded-ld !bg-gray-50/10 animate-pulse backdrop-blur-[1px] '
                }
            }}
            {...props} />

    );
};

export default UiBlockUI;
