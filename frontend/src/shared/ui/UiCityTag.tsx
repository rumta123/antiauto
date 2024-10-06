import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import { Tag } from 'primereact/tag';
import { MapPin } from '@gravity-ui/icons';

interface UiCityTagProps {
    text?: string;
    className?: string;
}

const UiCityTag: React.FC<UiCityTagProps> = ({ className, text, ...rest }) => {
    return (
        <Tag className={clsx('!bg-blue-100', className)} {...rest}>
            <div className='flex flex-row gap-1 text-cyan-800'>
                <MapPin />
                <span className='text-xs'>{text}</span>
            </div>
        </Tag>
    );
};

export default UiCityTag;
