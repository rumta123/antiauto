import { DetailedModificationDto } from "@/shared/api/generated";
import React from "react";

interface CarSpecificationProps {
    detailedComplectation?: DetailedModificationDto
}

export function CarSpecification({ detailedComplectation }: CarSpecificationProps) {
    return (
        <div className='flex flex-col gap-y-2 gap-x-8 mt-4'>
            <div className='border border-gray-200 rounded-lg p-6 my-2 bg-white shadow-md backdrop-blur-xl'>
                <h2 className='text-2xl font-semibold text-slate-900'>Характеристики:</h2>
                <div className='mt-6 columns-3 gap-6'>
                    {!!detailedComplectation && detailedComplectation?.specifications && Object.entries(detailedComplectation?.specifications).map(([groupName, specs], index) => (
                        <div key={index} className="break-inside-avoid">
                            <h3 className='text-xl font-semibold my-2 text-slate-900'>{groupName}</h3>
                            {Object.entries(specs).map(([specName, specValue], specIndex) => {
                                let displayValue;
                                if (typeof specValue === 'string') {
                                    try {
                                        const parsedValue = JSON.parse(specValue);
                                        displayValue = parsedValue instanceof Object
                                            ? parsedValue.join(", ")
                                            : specValue;
                                    } catch {
                                        displayValue = specValue;
                                    }
                                } else {
                                    displayValue = specValue;
                                }
                                return (
                                    <div key={`${index}-${specIndex}`} className='max-w-30 my-2 text-xs text-slate-600 flex flex-row justify-between items-center border-b border-b-slate-200'> {/* Добавлен ключ для элемента */}
                                        <p className='text-nowrap'>{specName}</p> <span className="pl-1 font-semibold text-end">{String(displayValue)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}