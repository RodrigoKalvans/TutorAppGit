import Link from "next/link";

// TODO: typing and conditional props
export default function Button({children, style, link = "/"}: {children: React.ReactNode, style?: string, link?: string}) {
  return (
    <button className={`${style} btn btn-primary px-14 p-3 m-2 rounded-full text-white font-bold`}>
      <Link href={link}>{children}</Link>
    </button>
  );
}
