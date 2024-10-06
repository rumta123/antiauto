import React, { CSSProperties } from 'react';

import clsx from 'clsx';
import { Magnifier, Picture } from '@gravity-ui/icons';
import { Image } from 'primereact/image';

interface UiImageProps {
    imgBase64?: string;
    preview?: boolean;
    style?: CSSProperties;
    className?: string;
    imgClassName?: string;
    alt?: string;
}

export const UiImage: React.FC<UiImageProps> = ({ imgBase64, preview, style, className, imgClassName, alt, ...rest }) => {
    return (

        <div className={clsx(className)}>
            {imgBase64?.length ?

                <Image
                    src={`data:image/jpeg;base64,${imgBase64}`}
                    alt={alt || ''}
                    draggable={false}
                    pt={{
                        root: { className: "w-full h-full" },
                        image: { className: 'w-full h-full object-cover object-center rounded-lg' },
                        button: { className: 'rounded-lg' }
                    }}
                    className={clsx('w-full h-full flex')}
                    imageClassName={clsx('', imgClassName)}
                    {...(preview
                        ? { preview: true, indicatorIcon: <Magnifier />, ...rest }
                        : {})}
                />
                :
                <div className={clsx('bg-gray-100 shadow-md rounded-lg flex h-full w-full min-h-32 items-center justify-center', imgClassName)}>
                    <Picture className='place-self-center w-10 h-10 text-gray-300' />
                </div>
            }
        </div>
    );
};

export default UiImage;
