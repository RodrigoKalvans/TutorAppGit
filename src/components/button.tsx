import Link from "next/link";
import React from "react";

// TODO: typing and conditional props
export default function Button({children, style, link = "/"}: {children: React.ReactNode, style?: string, link?: string}) {
  return (
    <button className={`btn btn-primary px-14 p-2 m-2 rounded-full border-0 text-white ${style}`}>
      <Link href={link}>{children}</Link>
    </button>
  );
}
