"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { trpc } from "../_trpc/client";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data } = trpc.authCallback.useQuery(undefined, {
    // @ts-expect-error typo not working here
    onSuccess: ({ success }) => {
      if (success) {
        console.log("User is synced to db");
      }
    },
    onError: (err: { data: { code: string } }) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data, origin, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
