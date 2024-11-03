import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
interface ProjectAvatarProps {
    name: string
    image?: string
    className?: string,
    fallbackClassName?: string
}
const ProjectAvatar = ({
    name,
    image,
    className,
    fallbackClassName
}: ProjectAvatarProps) => {
    if(image){
        return (
        <div className={cn("relative size-5 rounded-md overflow-hidden", className)}>
            <Image src={image} alt={name} fill className={cn("object-cover")}/>
        </div>
    )
    }
    return (
        <Avatar className={cn("size-5 rounded-md", className)}>
            <AvatarFallback className={cn("text-white rounded-md bg-blue-600 font-semibold text-sm uppercase",fallbackClassName)}>
                {name[0].toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}

export default ProjectAvatar
