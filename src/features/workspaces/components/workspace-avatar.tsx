import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
interface WorkspaceAvatarProps {
    name: string
    image?: string
    className?: string
}
const WorkspaceAvatar = ({
    name,
    image,
    className
}: WorkspaceAvatarProps) => {
    if(image){
        return (
        <div className={cn("relative size-10 rounded-md overflow-hidden", className)}>
            <Image src={image} alt={name} fill className={cn("object-cover")}/>
        </div>
    )
    }
    return (
        <Avatar className={cn("size-10 rounded-md", className)}>
            <AvatarFallback className="text-white rounded-md bg-blue-600 font-semibold text-lg uppercase">
                {name[0].toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}

export default WorkspaceAvatar
