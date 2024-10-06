import { Toast, ToastProps } from "primereact/toast";
import React, { forwardRef, RefObject } from "react";

interface UiToastProps extends ToastProps {}

const UiToast = forwardRef<Toast, UiToastProps>((props, ref) => {
    return <Toast ref={ref} {...props} />;
});
UiToast.displayName = 'UiToast';

export { UiToast };