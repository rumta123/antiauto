import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Skeleton } from 'primereact/skeleton';
import UiCard from '@/shared/ui/UiCard';
import { useBrands } from '@/entities/catalog/use-brands';
import { MarkDto } from '@/shared/api/generated';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UiImage } from '@/shared/ui';

interface BrandsCarouselProps {
    count: number;
    className?: string;
}

const BrandsCarousel: React.FC<BrandsCarouselProps> = ({ count, className }) => {
    const router = useRouter();
    const { marks = [], isLoading = true, isError, error } = useBrands({ popular: true });
    if (isError) {
        return <div>Error: {error?.message}</div>;
    }
    const placeholderMarks = Array.from({ length: count }, () => ({}));
    const skeletonTemplate = () => (
        <UiCard className='my-1'>
            <Skeleton size='4rem' />
        </UiCard>
    );
    const brandTemplate = (brand: MarkDto) => {
        return (
            <UiCard className='my-1' onClick={ () => ( router.push(`/lot-create/${brand.id}`)) }>
                <UiImage className='w-[4rem] h-[4rem] object-cover object-center' imgBase64={brand.logo} alt={brand.name} />
            </UiCard>
        );
    };

    return (
        <Carousel
            className={clsx('-ml-2 mt-2', className)}
            value={isLoading ? placeholderMarks : marks}
            itemTemplate={isLoading ? skeletonTemplate : brandTemplate}
            numScroll={1}
            numVisible={count}
            showIndicators={false}
            pt={{
                item: {
                    className: `w-1/${count} flex shrink-0 grow`
                },
                previousButton: {
                    className: 'bg-white border rounded-lg border-gray-300 shadow-md opacity-100 w-10 disabled:text-gray-500 disabled:bg-gray-200 disabled:border-gray-200'
                },
                nextButton: {
                    className: clsx(
                        'flex justify-center items-center self-center',
                        'bg-white border rounded-lg border-gray-300 shadow-md opacity-100 h-8 w-10 disabled:text-gray-500 disabled:bg-gray-200 disabled:border-gray-200 mx-2'
                    )
                }
            }}
        />
    );
};

export default BrandsCarousel;