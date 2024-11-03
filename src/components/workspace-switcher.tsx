"use client"

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { RiAddCircleFill } from "react-icons/ri"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select"
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal"

export const WorkspaceSwitcher = () => {
    const router = useRouter()
    const {open} = useCreateWorkspaceModal()
    const workspaceId = useWorkspaceId()
    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`)
    }
    const { data: workspaces } = useGetWorkspaces()
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col items-center justify-between">
                <div className="flex items-center mb-5 gap-x-10">
                    <h1 className="text-xs font-sans uppercase text-neutral-500">Workspaces</h1>
                    <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition " />
                </div>

                <Select onValueChange={onSelect} value={workspaceId}>
                    <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                        <SelectValue placeholder="No Workspaces Selected" />
                    </SelectTrigger>
                    <SelectContent>
                        {workspaces?.data.documents.map((workspace) => (
                            <SelectItem key={workspace.$id} value={workspace.$id}>
                                <div className="flex justify-start items-center gap-3 font-medium">
                                    <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                                    <span className="truncate">{workspace.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}



