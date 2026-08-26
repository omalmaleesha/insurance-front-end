"use client";

import { use } from "react";
import { useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Upload,
  FileText,
  Loader2,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  ClaimDocument,
  ClaimDocumentType,
  DocumentSource,
  DocumentStatus,
} from "../../../../lib/types/claimDocument";

import {
  useClaimDocuments,
  useUploadClaimDocument,
  useDeleteClaimDocument,
  useVerifyClaimDocument,
} from "../../hooks/useClaimDocument";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClaimDocumentsPage({ params }: PageProps) {
  const { id } = use(params);

  const claimId = Number(id);

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useClaimDocuments(claimId);

  const uploadDocument = useUploadClaimDocument(claimId);
  const deleteDocument = useDeleteClaimDocument(claimId);
  const verifyDocument = useVerifyClaimDocument(claimId);

  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<ClaimDocumentType>(
    ClaimDocumentType.CLAIM_FORM
  );
  const [documentSource, setDocumentSource] = useState<DocumentSource>(
    DocumentSource.DIGITAL_UPLOAD
  );
  const [uploadedByEtfNo, setUploadedByEtfNo] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      await uploadDocument.mutateAsync({
        file,
        documentType,
        documentSource,
        uploadedByEtfNo,
      });

      setFile(null);

      const fileInput = document.getElementById(
        "claim-document-file"
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    }
  };

  const handleDelete = async (documentId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this document?"
      )
    ) {
      return;
    }

    try {
      await deleteDocument.mutateAsync(documentId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete document");
    }
  };

  const handleVerify = async (documentId: number) => {
    try {
      await verifyDocument.mutateAsync(documentId);
    } catch (error) {
      console.error(error);
      alert("Failed to verify document");
    }
  };

  const statusStyle: Record<DocumentStatus, string> = {
    [DocumentStatus.PENDING]:
      "bg-slate-800/80 text-slate-300 border border-slate-700/50",
    [DocumentStatus.UPLOADED]:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    [DocumentStatus.VERIFIED]:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    [DocumentStatus.REJECTED]:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const [selectedDocument, setSelectedDocument] =
    useState<ClaimDocument | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-8 w-8 text-rose-400" />
        <p className="text-slate-400">Failed to load claim documents.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/claims/${claimId}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0b1329] text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">Claim Documents</h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload and manage documents for this claim.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Form */}
        <section className="h-fit rounded-2xl border border-slate-800/80 bg-[#0b1329] p-6 shadow-xl">
          <h2 className="mb-5 text-sm font-semibold text-slate-100">
            Upload Document
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value as ClaimDocumentType)
                }
                className="mt-1 w-full rounded-xl border border-slate-800 bg-[#070d19] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              >
                {Object.values(ClaimDocumentType).map((type) => (
                  <option key={type} value={type} className="bg-[#0b1329] text-slate-100">
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Document Source *
              </label>
              <select
                value={documentSource}
                onChange={(e) =>
                  setDocumentSource(e.target.value as DocumentSource)
                }
                className="mt-1 w-full rounded-xl border border-slate-800 bg-[#070d19] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              >
                <option value={DocumentSource.ONLINE_FORM} className="bg-[#0b1329] text-slate-100">
                  Online Form
                </option>
                <option value={DocumentSource.PHYSICAL_SCAN} className="bg-[#0b1329] text-slate-100">
                  Physical Scan
                </option>
                <option value={DocumentSource.DIGITAL_UPLOAD} className="bg-[#0b1329] text-slate-100">
                  Digital Upload
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Uploaded By (ETF No) *
              </label>
              <input
                required
                value={uploadedByEtfNo}
                onChange={(e) => setUploadedByEtfNo(e.target.value)}
                placeholder="ETF001"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-[#070d19] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Select File *
              </label>
              <input
                id="claim-document-file"
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-400 hover:file:bg-emerald-500/20"
              />
              <p className="mt-2 text-xs text-slate-500">
                PDF, JPG or PNG. Maximum 10 MB.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploadDocument.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 disabled:opacity-60"
            >
              {uploadDocument.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Document
                </>
              )}
            </button>
          </form>
        </section>

        {/* Document List */}
        <section className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl">
            <div className="border-b border-slate-800/80 px-6 py-5">
              <h2 className="text-sm font-semibold text-slate-100">
                Uploaded Documents
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {documents.length} document{documents.length !== 1 ? "s" : ""}
              </p>
            </div>

            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <FileText className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onDoubleClick={() => setSelectedDocument(doc)}
                    className="flex cursor-pointer flex-col gap-4 p-5 transition hover:bg-slate-800/40 sm:flex-row sm:items-center"
                    title="Double-click to preview"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#070d19] text-slate-400">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-200">
                          {doc.fileName}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[doc.status]}`}
                        >
                          {doc.status}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span>{doc.documentType.replaceAll("_", " ")}</span>
                        <span>{doc.documentSource.replaceAll("_", " ")}</span>
                        <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>

                      {doc.rejectionReason && (
                        <p className="mt-2 text-xs text-rose-400">
                          Reason: {doc.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.status === DocumentStatus.UPLOADED && (
                        <button
                          onClick={() => handleVerify(doc.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Verify
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Document Preview */}
      {selectedDocument && (
        <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Document Preview
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {selectedDocument.fileName}
              </p>
            </div>

            <button
              onClick={() => setSelectedDocument(null)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="h-[700px] w-full bg-[#070d19]">
            {selectedDocument.contentType === "application/pdf" ? (
              <iframe
                src={selectedDocument.fileUrl}
                className="h-full w-full"
                title={selectedDocument.fileName}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <img
                  src={selectedDocument.fileUrl}
                  alt={selectedDocument.fileName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}