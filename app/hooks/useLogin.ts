"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../services/auth.service";
import { auth } from "../lib/tanstack/auth";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,

    onSuccess: (token: string) => {
      auth.saveToken(token);
      router.push("/dashboard");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}