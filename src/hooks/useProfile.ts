import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { type ProfileResponse } from "../lib/api.types";

export function useProfile(accessToken: string) {
  return useQuery({
    queryKey: ["profile", accessToken],
    queryFn: async () => {
      const res = await api.get<ProfileResponse>("/auth/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    },
    enabled: !!accessToken,
  });
}
