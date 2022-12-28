import Link from "next/link";

export type BreadcrumbsElement= {
    show:string; 
    href:string;
};

export const BreadcrumbsList = (props: {list:BreadcrumbsElement[]}) =>{
    return <nav className="px-2 py-2"><ol>
        {props.list.map((v, index) => 
        <li className={index == 0 ? "inline" : "inline before:content-['>'] px-2"}>
            <Link href={v.href}>{v.show}</Link>
        </li>)}
    </ol></nav>
};

export default BreadcrumbsList;