import { useDealersCars } from "@/entities/dealers-cars";
import { useNoun } from "@/shared/hooks/use-noun";
import { UiCard } from "@/shared/ui";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

export function StatSeller() {

    const { cars } = useDealersCars()
    const [chartData, setChartData] = useState<any>({
        datasets: [{
            data: [0]
        }]
    });
    const [chartOptions, setChartOptions] = useState({});
    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
            const { ctx, data } = chart;
            ctx.save();
            ctx.font = 'bold 36px sans-serif';
            ctx.fillStyle = '#334155';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.datasets[0].data[0], chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y)
        }
    }
    const involvedNoun = useNoun(1, 'участвует', 'участвуют', 'участвуют')
    const winNoun = useNoun(1, 'выиграл', 'выиграли', 'выиграли')
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        setChartData({
            labels: [
                'автомобилей в базе',
                `${involvedNoun} в аукционах`,
                `${winNoun} аукцион`,
            ],
            datasets: [{
                data: [
                    cars?.length || 0,
                    2,
                    1
                ],
                backgroundColor: [
                    '#B3E1E5',
                    '#59BFC8',
                    documentStyle.getPropertyValue('--orange-500')
                ],
            }]
        })
        setChartOptions({
            plugins: {
                legend: {
                    display: false,
                }
            },
            cutout: '70%',
        });
    }, [cars])
    return <>
        <UiCard className="bg-seabrand-50 shadow-sm">
            <div className="grid grid-cols-12  divide-x-2 divide-seabrand-400">
                <div className="col-span-3 flex flex-row items-center gap-8 pr-4">
                    <Chart
                        type="doughnut"
                        data={chartData}
                        options={chartOptions}

                        plugins={[
                            textCenter,

                        ]}
                        width="120px"
                        className="!w-32" />
                    <span className="text-seabrand-700 text-lg text-center">автомобилей<br />в базе</span>
                </div>
                <div className="col-span-3 px-4 flex flex-col justify-center">
                    <div className="flex flex-row items-center gap-4">
                        <span className="font-bold text-2xl text-seabrand-600 min-w-10">{1}</span>
                        <span className="font-xl text-slate-700">{useNoun(1, 'участвует', 'участвуют', 'участвуют')} в аукционах</span>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <span className="font-bold text-2xl text-orange-500 min-w-10">{113}</span>
                        <span className="font-xl text-slate-700">{useNoun(1, 'выиграл', 'выиграли', 'выиграли')} аукцион</span>
                    </div>
                </div>
                <div className="col-span-6 pl-4 flex flex-col justify-center">
                    <div className="flex flex-row items-center gap-4">
                        <span className="font-bold text-2xl text-seabrand-600 min-w-10">{Number(100000000).toLocaleString()}  &#8381;</span>
                        <span className="font-xl text-slate-700">сумма выставленных авто</span>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <span className="font-bold text-2xl text-orange-500 min-w-10">{Number(100000000).toLocaleString()}  &#8381;</span>
                        <span className="font-xl text-slate-700">сумма продаж по аукционам</span>
                    </div>
                </div>
            </div>
        </UiCard>
    </>
}