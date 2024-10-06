import clsx from "clsx";
import { InputHTMLAttributes, PropsWithRef, useId } from "react";

export type UiTextFieldProps = {
  className?: string;
  label?: string;
  innerLabel?: string;
  error?: string;
  inputProps?: PropsWithRef<InputHTMLAttributes<HTMLInputElement>>;
};

export function UiTextField({
  className,
  error,
  label,
  innerLabel,
  inputProps,
}: UiTextFieldProps) {
  const id = useId();
  return (
    <div className={clsx(className, "flex flex-col gap-1")}>
      {label && (
        <label htmlFor={id} className="block">
          {label}
        </label>
      )}
      <div className="rounded-lg border border-slate-300 focus-within:ring-brand focus-within:ring-2 bg-white h-12 flex items-center">
        {innerLabel && (
          <label htmlFor={id} className="block pl-5 py-2.5 font-bold">
          {innerLabel}
        </label>
        )}
        <input
          {...inputProps}
          id={id}
          className={clsx(
            inputProps?.className,
            "block w-full h-full px-5 py-2.5 bg-white-50 border-0 rounded-md border-transparent  focus:ring-0 outline-none",
          )}
        />
      </div>
      {error && <div className="text-rose-400 text-sm">{error}</div>}
    </div>
  );
}