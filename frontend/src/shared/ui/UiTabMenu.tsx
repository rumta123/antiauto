import clsx from 'clsx';
import { TabMenu, TabMenuProps } from 'primereact/tabmenu';

interface UiTabMenuProps extends TabMenuProps {
    className?: string;
}
export const UiTabMenu: React.FC<UiTabMenuProps> = ({ className, ...rest }) => {
    return (
        <TabMenu
            className={clsx('', className)}
            pt={{
                root: { className: "transparent" },
                menu: { className: "bg-transparent border-gray-300" },
                action:({ context, parent }:{ context:any, parent:any }) => ({
                    className: clsx(
                        'bg-transparent px-0 mr-10 focus:bg-transparent',
                        'cursor-pointer select-none flex items-center relative no-underline overflow-hidden',
                        'border-b-2 font-bold text-xl rounded-t-lg ',
                        'focus:outline-none  focus:outline-offset-0 focus:shadow-none',
                        {
                            'border-gray-300  text-gray-700 hover:bg-transparent  hover:border-gray-400 hover:text-gray-600 dark:bg-gray-900 dark:border-brand-900/40 dark:text-white/80 dark:hover:bg-gray-800/80': parent.state.activeIndex !== context.index, // Condition-based hover styles.
                            ' border-brand-400 text-brand-400 dark:bg-gray-900 dark:border-brand-300 dark:text-brand-300': parent.state.activeIndex === context.index // Condition-based active styles.
                        }
                    ),
                    style: { top: '2px' }
                })
            }}
            {...rest} />
    );
};

export default UiTabMenu;
