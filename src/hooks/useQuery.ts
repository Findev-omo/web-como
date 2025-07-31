import { useQuery, type QueryKey } from "@tanstack/react-query";
import createClient from "@/api/client";

const useQueryHook = <T>(queryKey: QueryKey, endpoint: string) => {
  const queryFn = async () => {
    const client = await createClient();
    const { data } = await client.get<T>(endpoint);
    return data;
  };

  return useQuery<T>({ queryKey, queryFn });
};

export default useQueryHook;
