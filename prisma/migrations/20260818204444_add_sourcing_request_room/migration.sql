-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "authorType" TEXT NOT NULL DEFAULT 'customer';

-- CreateTable
CREATE TABLE "public"."SourcingRequest" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "statusSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadId" TEXT NOT NULL,
    "conversationId" TEXT,
    "productSummary" TEXT,
    "brief" TEXT,
    "targetQuantity" TEXT,
    "destination" TEXT,
    "timeline" TEXT,
    "ownerName" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourcingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpenItem" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "answeredAt" TIMESTAMP(3),
    "answeredVia" TEXT,
    "source" TEXT NOT NULL DEFAULT 'spec',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestEvent" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" TEXT,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'customer',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupplierCandidate" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "supplierName" TEXT,
    "supplierContact" TEXT,
    "sourceChannel" TEXT,
    "vettingNotes" TEXT,
    "vettingStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "rejectionReason" TEXT,
    "contactedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupplierQuote" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "supersededById" TEXT,
    "supersededAt" TIMESTAMP(3),
    "label" TEXT NOT NULL,
    "region" TEXT,
    "unitPrice" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "moq" TEXT,
    "leadTimeDays" TEXT,
    "sampleCost" TEXT,
    "sampleDays" TEXT,
    "incoterm" TEXT,
    "certifications" TEXT,
    "notes" TEXT,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SourcingRequest_ref_key" ON "public"."SourcingRequest"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "SourcingRequest_accessToken_key" ON "public"."SourcingRequest"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "SourcingRequest_leadId_key" ON "public"."SourcingRequest"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "SourcingRequest_conversationId_key" ON "public"."SourcingRequest"("conversationId");

-- CreateIndex
CREATE INDEX "SourcingRequest_status_idx" ON "public"."SourcingRequest"("status");

-- CreateIndex
CREATE INDEX "OpenItem_requestId_idx" ON "public"."OpenItem"("requestId");

-- CreateIndex
CREATE INDEX "RequestEvent_requestId_idx" ON "public"."RequestEvent"("requestId");

-- CreateIndex
CREATE INDEX "SupplierCandidate_requestId_idx" ON "public"."SupplierCandidate"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierQuote_supersededById_key" ON "public"."SupplierQuote"("supersededById");

-- CreateIndex
CREATE INDEX "SupplierQuote_candidateId_idx" ON "public"."SupplierQuote"("candidateId");

-- AddForeignKey
ALTER TABLE "public"."SourcingRequest" ADD CONSTRAINT "SourcingRequest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SourcingRequest" ADD CONSTRAINT "SourcingRequest_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpenItem" ADD CONSTRAINT "OpenItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."SourcingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestEvent" ADD CONSTRAINT "RequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."SourcingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplierCandidate" ADD CONSTRAINT "SupplierCandidate_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."SourcingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplierQuote" ADD CONSTRAINT "SupplierQuote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."SupplierCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill authorType for rows that predate the column. The DEFAULT applies
-- 'customer' to every existing row, but assistant turns are KaiExpert; without
-- this the entire historical transcript renders as if the customer said it.
UPDATE "Message" SET "authorType" = 'kaiExpert' WHERE "role" = 'assistant';
