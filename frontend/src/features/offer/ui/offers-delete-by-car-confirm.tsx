import { useDeleteOffersByCar } from "@/entities/offers/use-delete-offers-by-car";
import { DealersCarDto, OfferDto } from "@/shared/api/generated";
import { UiToast } from "@/shared/ui";
import { UiConfirmDialog } from "@/shared/ui/UiConfirmDialog";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";

interface OffersDeleteConfirmProps {
    car: DealersCarDto;
    visibleConfirmDelete: boolean;
    setVisibleConfirmDelete: (vis: boolean) => void;
    onSuccess: (data: any) => void

}
export function OffersDeleteByCarConfirm({ car, visibleConfirmDelete, setVisibleConfirmDelete, onSuccess }: OffersDeleteConfirmProps) {
    const toast = useRef<Toast>(null);
    const { deleteOffersByCar, isPending, isError, error, isSuccess } = useDeleteOffersByCar(onSuccess)
    useEffect(() => {
        if (isError && error) {
            toast.current?.show({

                severity: 'error',
                summary: error?.response?.data?.message || 'Произошла ошибка при удалении предложений.'
            })
        }
    }, [error, isError])
    useEffect(() => {
        if (isSuccess) {
            toast.current?.show({
                severity: 'success',
                summary: 'Предложения удалены'
            })
        }
    },[isSuccess])
    return (<>
        <UiToast ref={toast} appendTo={null} />
        <UiConfirmDialog
            visible={visibleConfirmDelete}
            onHide={() => setVisibleConfirmDelete(false)}
            header="Удаление предложений"
            message={`Вы уверены что хотите удалить все предложение автомобиля №${car.sequence}?`}
            accept={() => deleteOffersByCar(car.id)}
            reject={() => setVisibleConfirmDelete(false)}
        />
    </>)
}