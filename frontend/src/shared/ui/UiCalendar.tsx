import clsx from 'clsx';
import { Calendar, CalendarContext, CalendarPropsSingle } from 'primereact/calendar';


interface UiCalendarProps extends CalendarPropsSingle {
    className?: string;
    label?: string;
}

const UiCalendar: React.FC<UiCalendarProps> = ({ className, label, ...rest }) => {
    return (
        <div className={clsx(
            className,
            "border rounded-lg bg-white flex flex-row gap-2 items-center focus-within:ring-brand-600 focus-within:ring-2 shadow-sm",
            (rest.disabled && "!bg-neutral-200 !border-0 !cursor-not-allowed"),

        )}>
            {label && <label className='font-bold pl-4 py-2 text-nowrap'>{label}:</label>}

            <Calendar
                className={clsx('', className)}
                pt={{
                    panel: ({ props }: { props: any }) => ({
                        className: clsx('bg-white dark:bg-gray-900', '!min-w-[300px]', 'text-xs', {
                            'shadow-md border-0 absolute': !props.inline,
                            'inline-block overflow-x-auto border border-gray-300 dark:border-blue-900/40 p-2 rounded-lg': props.inline
                        })
                    }),
                    tableHeaderCell: { className: 'p-1' },
                    input: {
                        root: {
                            className: '!border-0 focus:!ring-0 focus:!shadow-none'
                        }
                    },
                    dayLabel: ({ context }:{context:CalendarContext}) => ({
                        className: clsx(
                            {
                                'opacity-35 cursor-default': context.disabled,
                                'cursor-pointer': !context.disabled
                            },
                            {
                                'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                                'text-brand-700 bg-brand-100 hover:bg-brand-200': context.selected && !context.disabled
                            },
                            {
                                'bg-gray-100': context.today
                            }
                        )
                    }),
                    
                }}
                // locale="ru"
                {...rest} />
        </div>
    );
};

export default UiCalendar;
