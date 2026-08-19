-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "photoDeclinedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."ErrorLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "detail" TEXT,
    "requestRef" TEXT,
    "conversationId" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ErrorLog_createdAt_idx" ON "public"."ErrorLog"("createdAt");

-- CreateIndex
CREATE INDEX "ErrorLog_resolved_createdAt_idx" ON "public"."ErrorLog"("resolved", "createdAt");

