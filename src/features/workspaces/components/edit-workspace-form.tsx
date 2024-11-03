"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateWorkspaceSchema } from "../schemas"
import { z } from "zod"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DottedSeparator } from "@/components/dotted-separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Workspace } from "../types"
import { useUpdateWorkspace } from "../api/use-update-workspace"
import { useConfirm } from "@/hooks/use-confirm"
import { useDeleteWorkspace } from "../api/use-delete-workspace"
import { toast } from "sonner"
import { useResetInviteCode } from "../api/use-reset-invite-code"

interface EditWorkspaceFormProps {
    onCancel?: () => void,
    initialValues: Workspace
}


export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
    const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace()
    const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode()
    const router = useRouter()
    const [DeleteDailog, confirmDelete] = useConfirm("Delete Workspace", "Are you sure you want to delete this workspace?", "destructive")
    const [ResetDailog, confirmReset] = useConfirm("Reset Invite Link", "This will invalidate the current invite link", "destructive")
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            form.setValue("image", file)
        }
    }
    const handleDelete = async () => {
        const ok = await confirmDelete()
        if (!ok) return
        deleteWorkspace({
            param: { workspaceId: initialValues.$id }
        }, {
            onSuccess: () => {
                window.location.href = "/"
            }
        })
    }
    const handleResetInviteCode = async () => {
        const ok = await confirmReset()
        if (!ok) return
        resetInviteCode({
            param: { workspaceId: initialValues.$id }
        })
    }
    const { mutate, isPending } = useUpdateWorkspace();
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    })
    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({ form: finalValues, param: { workspaceId: initialValues.$id } }, {
            onSuccess: () => {
                form.reset()
               
                //TODO : REDIRECT TO WORKSPACES
            }
        })
    }
    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink).then(() => toast.success("Invite Link copied"))
    }
    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`
    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDailog />
            <ResetDailog/>
            <Card className="w-full h-full border-s-amber-600">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size="sm" variant="secondary" onClick={onCancel ? onCancel :
                        () => router.push(`/workspaces/${initialValues.$id}`)}>
                        <ArrowLeftIcon className="size-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-xl font-bold">{initialValues.name}</CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4">
                                <FormField name="name" control={form.control} render={({ field }) => (
                                    <FormItem {...field}>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter workspace name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="image" render={({ field }) => (
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <div className="size-[72px] relative rounded-md overflow-hidden">
                                                    <Image src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value} fill className="object-cover" alt="Logo" />
                                                </div>
                                            ) : (
                                                <Avatar className="size-[72px]">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">Workspace Icon</p>
                                                <p className="text-sm text-muted-foreground">JPG,SVG,PNG or JPEG , max 1MB</p>
                                                <input type="file" ref={inputRef} disabled={isPending} onChange={handleImageChange} className="hidden" accept=".jpg,.jpeg,.png,.svg" />
                                                {field.value ? (
                                                    <Button type="button" variant="destructive" className="mt-2 w-fit" size={"xs"} onClick={() => { field.onChange(null); if (inputRef.current) { inputRef.current.value = "" } }} disabled={isPending}>Remove Image</Button>)
                                                    : (
                                                        <Button type="button" variant="teritary" className="mt-2 w-fit" size={"xs"} onClick={() => inputRef.current?.click()} disabled={isPending}>Upload Image</Button>)}
                                            </div>
                                        </div>
                                    </div>

                                )} />
                            </div>
                            <DottedSeparator className="py-7" />
                            <div className="flex items-center justify-between">
                                <Button type="button" variant="secondary" size={"lg"} onClick={onCancel} className={cn(!onCancel && "invisible")} disabled={isPending}>Cancel</Button>
                                <Button size={"lg"} disabled={isPending}>Save Changes</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="w-full h-full border-s-amber-600">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Invite Members</h3>
                        <p className="text-sm text-muted-foreground">Use the invite link to add the members to the workspace</p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                <Input disabled value={fullInviteLink} />
                                <Button onClick={handleCopyInviteLink} variant="secondary" className="size-12"><CopyIcon className="size-5" /></Button>
                            </div>
                        </div>
                        <DottedSeparator className="py-7" />
                        <Button variant="destructive" className="mt-6  ml-auto" size="sm" type="button" disabled={isPending || isResettingInviteCode} onClick={handleResetInviteCode}>Reset Invite Link</Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-full border-s-amber-600">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Deleting a workspace is a irreversible and will remove all associated data</p>
                        <DottedSeparator className="py-7" />
                        <Button variant="destructive" className="mt-6 ml-auto" size="sm" type="button" disabled={isPending || isDeletingWorkspace} onClick={handleDelete}>Delete Workspace</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}