import clsx from "clsx";
import { SelectButton, SelectButtonContext, SelectButtonProps } from "primereact/selectbutton";

interface UiSelectButtonProps extends SelectButtonProps {
    buttonSize?: 'small' | 'large' | 'normal'
}

export function UiSelectButton({ buttonSize,...rest }: UiSelectButtonProps) {
    return (
        <SelectButton
            pt={{
                root: ({ props }: { props: UiSelectButtonProps }) => ({
                    className: clsx({ 'opacity-60 select-none pointer-events-none cursor-default': props.disabled })
                }),
                button: ({ props,context }: { props: UiSelectButtonProps, context: SelectButtonContext }) => ({
                    className: clsx(
                        'inline-flex cursor-pointer select-none items-center align-bottom text-center overflow-hidden relative',
                        {
                            'px-4 py-3': buttonSize === "normal" || buttonSize === undefined,
                            'px-2 py-2': buttonSize === "small",
                            'px-5 py-4': buttonSize === "large" 
                        },
                        'transition duration-200 border border-r-0',
                        'first:rounded-l-md first:rounded-tr-none first:rounded-br-none last:border-r last:rounded-tl-none last:rounded-bl-none last:rounded-r-md',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-none',
                        {
                            'bg-white dark:bg-gray-900 text-gray-700 dark:text-white/80 border-gray-300 dark:border-blue-900/40 hover:bg-gray-50 dark:hover:bg-gray-800/80 ': !context.selected,
                            'bg-brand-700 border-brand-700 text-white hover:bg-brand-900': context.selected,
                            'opacity-60 select-none pointer-events-none cursor-default': context.disabled
                        }
                    )
                }),
                label: {
                    className: clsx('font-bold', {
                        'text-xs': buttonSize === "small",
                        'text-lg': buttonSize === "large" 
                }) }
            }}
            {...rest} />
    )
}