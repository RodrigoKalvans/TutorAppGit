import Link from "next/link";
import React from "react";

// TODO: typing and conditional props
/**
 *
 * @param {any} param0 text, style and link
 * @return {any} JSX
 */
export default function Button({children, style, link = "/"}: {children: React.ReactNode, style?: string, link?: string}) {
  return (
    <Link href={link} className={`btn btn-primary px-14 p-2 rounded-full border-0 text-white ${style}`}>{children}</Link>
  );
}
