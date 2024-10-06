import clsx from 'clsx';
import React from 'react';

interface UiCardProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

export const UiCard: React.FC<UiCardProps> = ({ onClick, children, className }) => {
    return (
        <div
            className={clsx(
                'rounded-lg p-4 ',
                className,
                onClick ? "hover:shadow-md hover:bg-white/70 transition-all ease-in-out delay-75 active:scale-95 active:bg-gray-50/75 cursor-pointer" : ""
            )}
            onClick={onClick}>
            {children}
        </div>
    );
};

export default UiCard;