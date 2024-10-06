// import clsx from "clsx";
// import React, { ReactNode } from 'react';

// interface UiLinkProps {

//     selected: boolean;
//     title: string;
//     desc: string;
//     className?: string;
//     onClick: (selected: boolean) => void;
// }


// const UIRadioItem: React.FC<UiLinkProps> = ({ className, selected, title, desc, onClick, ...props }) => {
//     return (
//         <div
//             {...props}
//             className={clsx(
//                 className,
//                 " cursor-pointer",
//             )}
//         >
//             <input
//                 type="radio"
//                 checked={selected}
//                 onChange={(e) => onClick(e.target.checked)}
//                 className="w-5 h-5"
//             />
//         </div>
//     );
// }
// export default { UIRadioItem }



import React from 'react';

interface RadioProps {
  label: string;
    checked: boolean;
    desc: string;
  onChange: (checked: boolean) => void;
  className?: string;
}

const UIRadioItem: React.FC<RadioProps> = ({ label, checked, onChange, desc, className }) => {
  return (
    <label className={`inline-flex items-center space-x-2 ${className}`}>
      <input
        type="radio"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox text-blue-600 w-5 h-5"
      />
          <span className="text-gray-700">{label}</span>
          <span>{desc}</span>
    </label>
  );
};

export default UIRadioItem;
