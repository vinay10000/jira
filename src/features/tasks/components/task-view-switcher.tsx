import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";

export const TaskViewSwitcher = () => {
    return (
        <Tabs className="flex-1 w-full border rounded-lg">
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:*:w-auto" value="table">Table</TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:*:w-auto" value="kanban">kanban</TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:*:w-auto" value="calendar">Calendar</TabsTrigger>
                    </TabsList>
                    <Button variant="primary" size="sm" className="w-full lg:w-auto">
                        <PlusIcon size={16} className="mr-2" />
                        Create Task</Button>
                </div>
                <DottedSeparator className="my-4" />
                {/*Add filters */}
                Data filters
                <DottedSeparator className="my-4" />
                <>
                    <TabsContent className="mt-0" value="table">
                        Data Table
                    </TabsContent>
                    <TabsContent className="mt-0" value="kanban">
                        Data kanban
                    </TabsContent>
                    <TabsContent className="mt-0" value="calendar">
                        Data Calendar
                    </TabsContent>
                </>
            </div>
        </Tabs>
    );

}
