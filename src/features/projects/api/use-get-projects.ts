import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/rpc"

interface useGetProjectsProps {
    workspaceId: string
}
export const useGetProjects = ({workspaceId}:useGetProjectsProps) =>{
    const query = useQuery({
        queryKey: ["projects",workspaceId],
        queryFn: async () => {
            const res = await client.api.projects.$get({
                query: {
                    workspaceId
                }
            });
            if(!res.ok){
                throw new Error("Failed to fetch projects");
            }
            const data = await res.json();
            return data;
}
    })
    return query
}
