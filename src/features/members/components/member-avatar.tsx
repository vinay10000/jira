import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
    name: string | null | undefined; // Allow null or undefined
    className?: string;
    fallbackClassName?: string;
}

const MemberAvatar = ({
    name,
    fallbackClassName,
    className
}: MemberAvatarProps) => {
    // Get first letter safely, defaulting to '?' if name is undefined/null
    const firstLetter = (name ? name.charAt(0).toUpperCase() : '?');

    return (
        <Avatar className={cn("size-5 transition border border-neutral-300 rounded-full", className)}>
            <AvatarFallback className={cn("bg-neutral-200 text-neutral-500 flex items-center justify-center font-medium", fallbackClassName)}>
                {firstLetter}
            </AvatarFallback>
        </Avatar>
    );
}

export default MemberAvatar;
