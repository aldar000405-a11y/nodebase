-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_fromNodeId_fkey";

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_toNodeId_fkey";

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_userId_fkey";

-- DropForeignKey
ALTER TABLE "Execution" DROP CONSTRAINT "Execution_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "node" DROP CONSTRAINT "node_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "node" DROP CONSTRAINT "node_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "trigger" DROP CONSTRAINT "trigger_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "workflow" DROP CONSTRAINT "workflow_userId_fkey";

-- DropTable
DROP TABLE "Connection";

-- DropTable
DROP TABLE "Credential";

-- DropTable
DROP TABLE "Execution";

-- DropTable
DROP TABLE "node";

-- DropTable
DROP TABLE "trigger";

-- DropTable
DROP TABLE "workflow";

-- DropEnum
DROP TYPE "CredentialType";

-- DropEnum
DROP TYPE "ExecutionStatus";

-- DropEnum
DROP TYPE "NodeType";

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "journeyNodes" JSONB NOT NULL DEFAULT '[]',
    "journeyEdges" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_userId_idx" ON "project"("userId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;


