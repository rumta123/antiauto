import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { OverlayPanel, OverlayPanelProps } from 'primereact/overlaypanel';

interface UiOverlayPanelProps extends OverlayPanelProps {
    className?: string;
}

export const UiOverlayPanel = forwardRef<OverlayPanel, UiOverlayPanelProps>(({ className, ...rest }, ref) => {
    return (
        <OverlayPanel
            ref={ref}
            className={clsx('', className)}
            pt={{
                root: {
                    className: clsx(
                        'mt-0',
                        'before:absolute before:w-0 before:h-0 before:border-transparent before:border-solid before:ml-6 before:border-0 before:content-none',
                    )
                },
            }}
            {...rest} />
    );
});
UiOverlayPanel.displayName = 'UiOverlayPanel';

export default UiOverlayPanel;
