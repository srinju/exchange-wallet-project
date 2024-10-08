"use client"

import { usePathname , useRouter } from "next/navigation"
import React from "react"

export const SideBarItem = ({title,icon,href} : {
    title : string,
    icon : React.ReactNode
    href  : string
}) => {

    const pathname = usePathname();
    const router = useRouter();
    const selected = pathname === href

    return <div className={`flex ${selected ? "text-[#6a51a6]" : "text-slate-500"} cursor-pointer  p-2 pl-8`} onClick={() => {
        router.push(href);
    }}>
        <div className="pr-2">
            {icon}
        </div>
        <div className={`font-bold ${selected ? "text-[#6a51a6]" : "text-slate-500"}`}>
            {title}
        </div>
    </div>
}