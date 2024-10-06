import { OptionsCategoryDictionaryDto } from "@/shared/api/generated";

interface OptionsListProps {
    optionsDict: OptionsCategoryDictionaryDto;
    title?: string;
    children?: React.ReactNode;
    showAsBlock?: boolean;
}
export function OptionsList({ optionsDict, title, children, showAsBlock = true }: OptionsListProps) {
    return <div className={showAsBlock ? 'border border-gray-200 rounded-lg p-6 my-2 bg-white shadow-md backdrop-blur-xl' : ''}>
        {title && <h2 className='text-2xl font-semibold my-2 text-slate-900'>{title}:</h2>}
        <div className='mt-6 columns-3 gap-6'>
            {Object.entries(optionsDict).map(([groupName, options], index) => (
                <div className='break-inside-avoid' key={index}>
                    <h3 className='text-xl font-semibold my-2 text-slate-900'>{groupName}</h3>
                    {Object.entries(options).map(([optionName, optionValue], nameIndex) => (
                        <div key={`${index}-${nameIndex}`} className='max-w-30 text-xs text-slate-600'>
                            <p className="py-1">{optionName}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        {children}
    </div>
}