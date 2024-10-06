export function useOptionsText(options: any) {
    const optionsText = (options && Object.keys(options).join(', ')) || '';
    return { optionsText }
}