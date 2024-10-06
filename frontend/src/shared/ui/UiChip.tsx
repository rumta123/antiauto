import React, { CSSProperties } from 'react';
import { Chip, ChipProps } from 'primereact/chip';
import clsx from 'clsx';

interface UiChipProps extends ChipProps {


}

const UiChip: React.FC<UiChipProps> = ({ ...rest }) => {
    return (
        <Chip
            pt={{
                root: { className: clsx('inline-flex items-center', 'bg-seabrand-100 text-seabrand-900 rounded-md px-3 dark:text-white/80 dark:bg-gray-900') },
                label: { className: 'text-sm mt-1 mb-1' },
            }}
            {...rest} />
    );
};

export default UiChip;
