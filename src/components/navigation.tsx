"use client";
import { cn } from "@/lib/utils"
import { Settings, SettingsIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
const routes = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill
    }, {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill
    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: "Members",
        href: "/members",
        icon: UsersIcon,
        activeIcon: UsersIcon
    }
]
export const Navigation = () => {
    const pathname = usePathname()
    const workspaceId = useWorkspaceId()
    return (
        <ul className="flex flex-col">
            {routes.map((item) => {
                const fullHref = `/workspaces/${workspaceId}${item.href}`
                const isActive = pathname === fullHref;
                const Icon = isActive ? item.activeIcon : item.icon
                return (
                    <Link key={item.href} href={fullHref}>
                        <div className={cn("flex items-center gap-2 p-3 rounded-md hover:text-primary transition font-sans text-neutral-500", isActive && "text-primary bg-white hover:opacity-100 shadow-sm")}>
                            <Icon className="size-5 text-neutral-500" />
                            {item.label}
                        </div>
                    </Link>
                )
            })}
        </ul>
    )
}


