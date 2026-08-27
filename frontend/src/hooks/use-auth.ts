import { useQuery } from "@tanstack/react-query";
import { userQuery } from "@/lib/api";

export function useAuth() {
  const query = useQuery(userQuery());
  return { ...query, user: query.data, role: query.data?.perfil_nome };
}

