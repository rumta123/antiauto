

import { useDeleteOffer } from "@/entities/offers/use-delete-offer";
import { useSetOfferStatus } from "@/entities/offers/use-set-offer-status";
import { OfferDto } from "@/shared/api/generated";
import { UiToast } from "@/shared/ui";
import { UiConfirmDialog } from "@/shared/ui/UiConfirmDialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";

interface OfferDeleteConfirmProps {
    offer: OfferDto;
    visibleConfirmSelect: boolean;
    setVisibleConfirmSelect: (vis: boolean) => void;
    onSuccess: (data: any) => void;
    successMsg: string;
    title: string;
    message: string;
    direction?: 'next' | 'prev'
}
export function OfferSelectConfirm({ offer, visibleConfirmSelect, setVisibleConfirmSelect, onSuccess, successMsg, title, message, direction = 'next' }: OfferDeleteConfirmProps) {
    const toast = useRef<Toast>(null);
    const { setOfferStatus, isPending, isError, error, isSuccess } = useSetOfferStatus(onSuccess)
    useEffect(() => {
        if (isError && error) {
            toast.current?.show({

                severity: 'error',
                summary: error?.response?.data?.message || 'Произошла ошибка'
            })
        }
    }, [error, isError])
    useEffect(() => {
        if (isSuccess) {
            toast.current?.show({
                severity: 'success',
                summary: successMsg
            })
        }
    }, [isSuccess])
    return (<>
        <UiToast ref={toast} appendTo={null} />
        <UiConfirmDialog
            visible={visibleConfirmSelect}
            onHide={() => setVisibleConfirmSelect(false)}
            header={title}
            message={message}
            accept={() => setOfferStatus({ offerId: offer.id, statusDirection: direction })}
            reject={() => setVisibleConfirmSelect(false)}
        />
    </>)
}