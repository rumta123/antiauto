"use client"
import { LotProgress } from "@/features/lot-create/ui/lot-progress";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "primereact/hooks";
import { useEffect, useState } from "react";
import { useSessionQuery } from "@/entities/session";
import { useAccount } from "@/entities/account/use-account";
import PhoneVerificationWidget from "@/features/lot-create/ui/phone-verification";
import { NotAuthorizedWidget } from "@/features/lot-create/ui/not-authorized";
import { useUpdateSessionData } from "@/entities/session/queries";
import LotSendForm from "@/features/lot-create/ui/lot-send-form";
import { LotCard } from "@/features/lot-create/ui/lot-card";
import { useModelInfo, useModels } from "@/entities/catalog/use-models";
import { useConfigurationText } from "@/features/catalog/model/use-configuration-text";
import { useComplectationText } from "@/features/catalog/model/use-complectation-text";
import { CityDto } from "@/shared/api/generated";

interface FinishWidgetProps {
    brandId: string;
    modelId: string;
    generationId_configurationId: string;
    engine_hash: string;
}

const FinishWidget: React.FC<FinishWidgetProps> = ({ brandId, modelId, generationId_configurationId, engine_hash }) => {
    const router = useRouter();
    const { data: sessionData, status } = useSessionQuery();
    const { account } = useAccount();
    const [showVerifyPhone, setShowVerifyPhone] = useState(false);
    const [newLotData, setNewLotData] = useLocalStorage<any>({}, 'lot-create');
    const [isLotCreated, setIsLotCreated] = useState(false)

    const { brand } = useModels(brandId, true);
    const { model } = useModelInfo(modelId);
    const { configurationText } = useConfigurationText(generationId_configurationId);
    const { complectationText } = useComplectationText(engine_hash);
    const cityText = newLotData.city ? `${newLotData.city?.name} до ${newLotData.distance} км` : '';

    useEffect(() => {
        if (!account?.phone.length || !account.isPhoneVerified) {
            setShowVerifyPhone(true)
        } else {
            setShowVerifyPhone(false)
        }
    }, [account]);
    const handleSuccess = () => {
        // useUpdateSessionData();
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <LotProgress value={
                !sessionData ? 95 :
                    showVerifyPhone ? 97 :
                        !isLotCreated ? 99 : 100} />
            {!sessionData ?
                <NotAuthorizedWidget onSuccessCallback={handleSuccess} />
                :
                showVerifyPhone ?
                    <PhoneVerificationWidget
                        onVerified={() => {
                            setShowVerifyPhone(false);
                        }}
                        onCancel={() => router.push(`/lot-create/${brandId}/${modelId}/${generationId_configurationId}/${engine_hash}/city`)}
                    />
                    :
                    <>
                        {!isLotCreated && <>
                            <div className='flex flex-col gap-2'>
                                <p className="text-xl font-semibold">Отлично! Проверьте введённые данные и разместите лот</p>
                            </div>
                            <LotCard
                                brand={brand?.name || ''}
                                brand_logo={brand?.logo || ''}
                                model={model?.name || ''}
                                generation_configuration={configurationText}
                                complectation={complectationText}
                                options={newLotData.requiredOptions}
                                additionalOptions={newLotData.electiveOptions}
                                city={cityText} />

                        </>}
                        <LotSendForm
                            newLotData={newLotData}
                            clearNewLotData={() => {
                                setIsLotCreated(true);
                                setNewLotData({});
                            }}
                            handleBack={() => router.push(`/lot-create/${brandId}/${modelId}/${generationId_configurationId}/${engine_hash}/city`)}
                        />
                    </>

            }
        </div>
    )
}
export default FinishWidget