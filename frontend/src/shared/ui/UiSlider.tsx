
import clsx from 'clsx';

import { Slider, SliderProps } from 'primereact/slider';

interface UiSliderProps extends SliderProps {

    className?: string;
}

const UiSlider: React.FC<UiSliderProps> = ({ className, ...rest }) => {
    return (
        <Slider
            className={clsx('', className)}
            pt={{
                root: ({ props }: { props: any }) => ({
                    className: clsx(
                        'relative',
                        'bg-seabrand-100 dark:bg-gray-800 border-0 rounded-6',
                        { 'h-1 w-full': props.orientation == 'horizontal', 'w-1 h-56': props.orientation == 'vertical' },
                        { 'opacity-60 select-none pointer-events-none cursor-default': props.disabled }
                    )
                }),
                range: ({ props }: { props: any }) => ({
                    className: clsx('bg-seabrand-500', 'block absolute', {
                        'top-0 left-0 h-full': props.orientation == 'horizontal',
                        'bottom-0 left-0 w-full': props.orientation == 'vertical'
                    })
                }),
                handle: ({ props }: { props: any }) => ({
                    className: clsx(
                        'h-4 w-4 bg-seabrand-500 dark:bg-gray-600 border-2 border-seabrand-500 rounded-full transition duration-200',
                        'cursor-grab touch-action-none block',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(207,237,239,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                        'hover:bg-seabrand-700 hover:border hover:border-seabrand-700',
                        {
                            'top-[50%] mt-[-0.5715rem] ml-[-0.5715rem]': props.orientation == 'horizontal',
                            'left-[50%] mb-[-0.5715rem] ml-[-0.4715rem]': props.orientation == 'vertical'
                        }
                    )
                })
            }}
            {...rest} />
    );
};

export default UiSlider;
