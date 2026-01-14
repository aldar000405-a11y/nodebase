-- CreateTable
CREATE TABLE "trigger" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trigger_workflowId_idx" ON "trigger"("workflowId");

-- AddForeignKey
ALTER TABLE "trigger" ADD CONSTRAINT "trigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
