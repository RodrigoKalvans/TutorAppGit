import Link from "next/link";

export default function Button({ text, color, link = "/" }: {text: string, color: string, link: string}) {
    return (
        <button className={`btn btn-primary px-14 p-3 m-2 bg-${color}-400 rounded-full text-white text-lg font-bold`}>
            <Link href={link}>{text}</Link>
        </button>
    );
}