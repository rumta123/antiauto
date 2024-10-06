import React, { CSSProperties, ReactNode } from 'react';
import { CircleInfo } from '@gravity-ui/icons';
import { Button } from 'primereact/button';

interface UiTooltipIconProps {
    text?: string;
    className?: string;
    icon?: ReactNode;
    buttonStyle?: CSSProperties;
    iconStyle?: CSSProperties;
}

const UiTooltipIcon: React.FC<UiTooltipIconProps> = ({ className, text, icon, buttonStyle, iconStyle, ...rest }) => {
    const IconComponent = icon || <CircleInfo className='circle-info-icon' style={iconStyle} />;

    return (

        <Button
            text
            rounded
            disabled
            severity="secondary"
            pt={{
                root: { className: 'p-0 w-4 h-4' }
            }}
            tooltip={text}
            tooltipOptions={{
                position: 'top',
                showOnDisabled: true,
                // autoHide: false,
                hideDelay: 200,
                showDelay: 100,
                // event: 'both',
                pt: {
                    // root: { className: '!bg-white !shadow-md' },
                    // text: {className: '!bg-orange-500' }
                }

            }}>
            {/* <CircleInfo className='circle-info-icon' /> */}
            {IconComponent}
        </Button>

    );
};

export default UiTooltipIcon;
