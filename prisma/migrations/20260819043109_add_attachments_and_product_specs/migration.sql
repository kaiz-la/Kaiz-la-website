-- CreateTable
CREATE TABLE "public"."Attachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "messageId" TEXT,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductSpec" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,
    "attachmentId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "category" TEXT,
    "confidence" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "spec" JSONB NOT NULL,

    CONSTRAINT "ProductSpec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attachment_conversationId_idx" ON "public"."Attachment"("conversationId");

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "public"."Attachment"("messageId");

-- CreateIndex
CREATE INDEX "ProductSpec_conversationId_idx" ON "public"."ProductSpec"("conversationId");

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSpec" ADD CONSTRAINT "ProductSpec_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSpec" ADD CONSTRAINT "ProductSpec_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "public"."Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
