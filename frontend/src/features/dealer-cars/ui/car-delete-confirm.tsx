import { useDeleteDealersCar } from "@/entities/dealers-cars";
import { DealersCarDto, DealersCarIdDto } from "@/shared/api/generated";
import { UiToast } from "@/shared/ui";
import { UiConfirmDialog } from "@/shared/ui/UiConfirmDialog";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";

interface CarDeleteConfirmProps {
    car: DealersCarDto;
    visibleConfirmDelete: boolean;
    setVisibleConfirmDelete: (vis: boolean) => void;
    onSuccess: (data: DealersCarIdDto) => void

}
export function CarDeleteConfirm({ car, visibleConfirmDelete, setVisibleConfirmDelete, onSuccess }: CarDeleteConfirmProps) {
    const toast = useRef<Toast>(null);
    const { deleteCar, isPending, isError, error, isSuccess } = useDeleteDealersCar(onSuccess)
    useEffect(() => {
        if (isError && error) {
            toast.current?.show({
                severity: 'error',
                summary: error?.response?.data?.message || 'Произошла ошибка при удалении автомобиля.'
            })
        }
    }, [error, isError])
    useEffect(() => {
        if (isSuccess) {
            toast.current?.show({
                severity: 'success',
                summary: 'Автомобиль удалён'
            })
        }
    },[isSuccess])
    return (<>
        <UiConfirmDialog
            visible={visibleConfirmDelete}
            onHide={() => setVisibleConfirmDelete(false)}
            header="Удаление автомобиля"
            message={`Вы уверены что хотите удалить автомобиль №${car.sequence}?`}
            accept={() => deleteCar(car.id)}
            reject={() => setVisibleConfirmDelete(false)}
        />
        <UiToast ref={toast} />
    </>)
}