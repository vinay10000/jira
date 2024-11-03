"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createWorkspaceSchema } from "../schemas"
import { z } from "zod"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DottedSeparator } from "@/components/dotted-separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateWorkspace } from "../api/use-create-workspace"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CreateWorkspaceFormProps {
    onCancel?: () => void
}


export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter()
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            form.setValue("image", file)
        }
    }
    const { mutate, isPending } = useCreateWorkspace();
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: ""
        }
    })
    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                form.reset()
                router.push(`/workspaces/${data.$id}`)
                //TODO : REDIRECT TO WORKSPACES
            }
        })
    }
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new workspace</CardTitle>
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
                                                <Button type="button" variant="destructive" className="mt-2 w-fit" size={"xs"} onClick={() =>{ field.onChange(null); if(inputRef.current){inputRef.current.value = ""}}} disabled={isPending}>Remove Image</Button>)
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
                            <Button size={"lg"} disabled={isPending}>Create Workspace</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}