"use client";

import { useSearchParams } from "next/navigation";

import { usePublicProposal } from "../hooks/usePublicProposal";

export default function ProposalPage() {

  const params = useSearchParams();

  const token = params.get("token");

  const {

    data,

    isLoading,

    isError,

  } = usePublicProposal(token ?? undefined);

  if (isLoading)
    return <div>Loading...</div>;

  if (isError)
    return <div>Invalid or expired link.</div>;

  return (

    <div>

      <h1>{data?.customerName}</h1>

      <p>{data?.customerEmail}</p>

      <p>{data?.proposalNumber}</p>

    </div>

  );

}