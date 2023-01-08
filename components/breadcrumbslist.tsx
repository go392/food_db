import Link from "next/link";

export type BreadcrumbsElement= {
    show:string; 
    href:string;
};

export default function BreadcrumbsList(props: {list:BreadcrumbsElement[]}) : JSX.Element{
    return <nav className="px-2 py-2 text-xs"><ol>
        {props.list.map((v, index) => 
        <li key={v.show} className={index >= props.list.length-1 ? "inline-block" : "inline-block after:content-['>'] after:px-2"}>
            <Link href={v.href}>{v.show}</Link>
        </li>)}
    </ol></nav>
};