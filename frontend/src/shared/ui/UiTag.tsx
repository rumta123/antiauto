import React from 'react';
import clsx from 'clsx';
import { Tag, TagProps } from 'primereact/tag';

interface UiTagProps extends TagProps {


}

export function UiTag({ ...rest }: UiTagProps) {
    return (
        <Tag
            pt={{
                root: ({ props }: { props: any }) => ({
                    className: clsx(
                        'inline-flex items-center justify-center',
                        'bg-seabrand-600 text-white text-xs font-semibold px-2 py-1 ',
                        {
                            'bg-gray-500 ': props.severity == 'secondary',
                            'bg-green-500 ': props.severity == 'success',
                            'bg-blue-500 ': props.severity == 'info',
                            'bg-orange-500 ': props.severity == 'warning',
                            'bg-purple-500 ': props.severity == 'help',
                            'bg-red-500 ': props.severity == 'danger'
                        },
                        {
                            'rounded-md': !props.rounded,
                            'rounded-full': props.rounded
                        }
                    )
                }),
                value: { className: 'leading-4' },
                icon: { className: 'mr-1 text-sm' }
            }}
            {...rest} />
    );
};


