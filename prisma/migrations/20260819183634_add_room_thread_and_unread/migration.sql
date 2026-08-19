-- AlterTable
ALTER TABLE "public"."SourcingRequest" ADD COLUMN     "customerNotifiedAt" TIMESTAMP(3),
ADD COLUMN     "customerReadAt" TIMESTAMP(3),
ADD COLUMN     "lastCustomerMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastStaffMessageAt" TIMESTAMP(3),
ADD COLUMN     "staffAlertedAt" TIMESTAMP(3),
ADD COLUMN     "staffReadAt" TIMESTAMP(3),
ADD COLUMN     "threadConversationId" TEXT,
ADD COLUMN     "whatsappRequestedAt" TIMESTAMP(3),
ADD COLUMN     "whatsappWindowOpenedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "public"."Message"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SourcingRequest_threadConversationId_key" ON "public"."SourcingRequest"("threadConversationId");

-- AddForeignKey
ALTER TABLE "public"."SourcingRequest" ADD CONSTRAINT "SourcingRequest_threadConversationId_fkey" FOREIGN KEY ("threadConversationId") REFERENCES "public"."Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

