"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteMemebr } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";

const MembersList = () => {
    const {mutate:deleteMember,isPending:isDeletingMember} = useDeleteMemebr();
    const {mutate:updateMember,isPending:isUpdatingMember} = useUpdateMember();
    const [ConfirmDailog,confirm] = useConfirm("Remove member","Are you sure you want to remove this member?","destructive");
    const workspaceId = useWorkspaceId();
    const { data, isLoading, error } = useGetMembers({ workspaceId });

    if (isLoading) return <div>Loading members...</div>;
    if (error) return <div>Error loading members: {error.message}</div>;
    const handleUpdateMember = (memberId:string,role:MemberRole) => {
        const roleString = role === MemberRole.ADMIN ? "ADMIN" : "MEMBER";
        updateMember({
            param:{memberId},
            // @ts-ignore
            json: { role: roleString }
        });
    }
    const handleDeleteMember = async(memberId:string) => {
        const ok = await confirm();
        if(!ok) return;
        deleteMember({param:{memberId}},{onSuccess:()=>{
            window.location.reload();
        }});
    }
    const members = data?.data.documents;

    return (
        <Card className="h-full w-full shadow-none border-none">
            <ConfirmDailog/>
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button asChild variant="secondary" size="sm">
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeft className="size-4 mr-2" />Back
                    </Link>
                </Button>
                <CardTitle className="text-lg font-bold"> Members List</CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                {members && members.length > 0 ? (
                    members.map((member, index) => {
                        const memberName = typeof member.name === 'string'
                            ? member.name
                            : typeof member.name === 'object'
                                ? member.name?.name || 'Unknown Member'
                                : 'Unknown Member';

                        return (
                            <Fragment key={member.$id}>
                                <div className="flex items-center gap-2">
                                    <MemberAvatar
                                        className="size-10"
                                        fallbackClassName="text-lg"
                                        name={memberName}
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">{memberName}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="ml-auto" variant="secondary" size="icon">
                                                <MoreVerticalIcon className="size-4 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="bottom" align="end">
                                            <DropdownMenuItem className="font-medium" onClick={()=>handleUpdateMember(member.$id,MemberRole.ADMIN)} disabled={isUpdatingMember}>Set as Administrator</DropdownMenuItem>
                                            <DropdownMenuItem className="font-medium" onClick={()=>handleUpdateMember(member.$id,MemberRole.MEMBER)} disabled={isUpdatingMember}>Set as Member</DropdownMenuItem>
                                            <DropdownMenuItem className="font-medium text-amber-700" onClick={()=>handleDeleteMember(member.$id)} disabled={isDeletingMember}>Remove {memberName}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {index < data.data.documents.length - 1 && (
                                    <Separator className="my-2.5" />
                                )}
                            </Fragment>
                        );
                    })
                ) : (
                    <div>No members found.</div>
                )}
            </CardContent>
        </Card>
    );
}

export default MembersList;
