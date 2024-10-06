import { useConfigurationInfo } from "@/entities/catalog/use-configurations";

export function useConfigurationText(generationId_configurationId: string) {
    const { configurationInfo } = useConfigurationInfo(generationId_configurationId);
    const configurationText = configurationInfo
        ? `${configurationInfo?.yearStart} - ${(configurationInfo?.yearStop || 'н.в.')} ${configurationInfo?.configurations[0].bodyType} ${configurationInfo?.configurations[0].notice}`
        : '';
    return { configurationText }
}