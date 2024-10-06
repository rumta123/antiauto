

import { useDeleteOffer } from "@/entities/offers/use-delete-offer";
import { OfferDto } from "@/shared/api/generated";
import { UiToast } from "@/shared/ui";
import { UiConfirmDialog } from "@/shared/ui/UiConfirmDialog";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";

interface OfferDeleteConfirmProps {
    offer: OfferDto;
    visibleConfirmDelete: boolean;
    setVisibleConfirmDelete: (vis: boolean) => void;
    onSuccess: (data: any) => void

}
export function OfferDeleteConfirm({ offer, visibleConfirmDelete, setVisibleConfirmDelete, onSuccess }: OfferDeleteConfirmProps) {
    const toast = useRef<Toast>(null);
    const { deleteOffer, isPending, isError, error, isSuccess } = useDeleteOffer(onSuccess)
    useEffect(() => {
        if (isError && error) {
            toast.current?.show({

                severity: 'error',
                summary: error?.response?.data?.message || 'Произошла ошибка при удалении предложения.'
            })
        }
    }, [error, isError])
    useEffect(() => {
        if (isSuccess) {
            toast.current?.show({
                severity: 'success',
                summary: 'Предложение удалено'
            })
        }
    },[isSuccess])
    return (<>
        <UiToast ref={toast} appendTo={null} />
        <UiConfirmDialog
            visible={visibleConfirmDelete}
            onHide={() => setVisibleConfirmDelete(false)}
            header="Удаление предложения"
            message={`Вы уверены что хотите удалить предложение №${offer.sequence}?`}
            accept={() => deleteOffer(offer.id)}
            reject={() => setVisibleConfirmDelete(false)}
        />
    </>)
}