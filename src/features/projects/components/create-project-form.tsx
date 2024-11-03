"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createProjectSchema } from "../schemas"
import { z } from "zod"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DottedSeparator } from "@/components/dotted-separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "../api/use-create-project"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

interface CreateProjectFormProps {
    onCancel?: () => void
}


export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            form.setValue("image", file)
        }
    }
    const { mutate, isPending } = useCreateProject();
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({workspaceId: true})),
        defaultValues: {
            name: ""
        }
    })
    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                form.reset()
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
                //TODO : REDIRECT TO PROJECT DETAIL

            }
        })
    }
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
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
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter Project name" />
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
                                            <p className="text-sm">Project Icon</p>
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
                            <Button size={"lg"} disabled={isPending}>Create Project</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}