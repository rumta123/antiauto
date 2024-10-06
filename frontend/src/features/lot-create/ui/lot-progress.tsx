import { ProgressBar } from "primereact/progressbar";

interface LotProgressProps {
    value: number
}
export function LotProgress({ value }: LotProgressProps) {
    return (
        <ProgressBar
            value={value}
            showValue={false}
            pt={{
                root: {className: 'h-3 bg-seabrand-50 rounded-[3px]'},
                value: { className: 'bg-seabrand-400' }
            }}
        />
    )
}