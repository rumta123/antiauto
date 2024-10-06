import clsx from "clsx";
import Link from "next/link";
import React from "react";

export type UiLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href?: string;
  className?: string;
};

export const UILink: React.FC<UiLinkProps> = ({ href, className, ...props }) => {
  const linkClassNames = clsx(
    className,
    "py-1 text-sm underline underline-offset-4 text-slate-800 hover:text-slate-500 cursor-pointer"
  );

  // Если href предоставлен, используйте компонент Link
  if (href) {
    return (
      <Link href={href} passHref {...props} className={linkClassNames}>

      </Link>
    );
  }

  // В противном случае верните простой span с аналогичными стилями
  return <span {...props} className={linkClassNames} />;
};
