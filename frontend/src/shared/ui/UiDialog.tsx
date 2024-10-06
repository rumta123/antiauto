
import clsx from 'clsx';
import { Dialog, DialogProps } from 'primereact/dialog';

interface UiDialogProps extends DialogProps {

    className?: string;
    onHide: () => void;
}

export const UiDialog: React.FC<UiDialogProps> = ({ className, onHide, ...rest }) => {
    return (
        <Dialog
            className={clsx('', className)}
            onHide={onHide}
            pt={{
                root: { className: ' flex flex-col' },
                content: { className: "h-full" },
                headerTitle: {className:'text-xl'},
                footer: {className:'justify-start'}
            }}
            {...rest} />
    );
};

export default UiDialog;
