-- AlterTable
ALTER TABLE "project" ADD COLUMN     "brandGuidelines" JSONB;

-- CreateTable
CREATE TABLE "project_version" (
    "id" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ux_input" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "extractedText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectVersionId" TEXT NOT NULL,

    CONSTRAINT "ux_input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_schema" (
    "id" TEXT NOT NULL,
    "screenName" TEXT NOT NULL,
    "screenPath" TEXT,
    "jsonSchema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectVersionId" TEXT NOT NULL,

    CONSTRAINT "ui_schema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_version_projectId_versionNum_key" ON "project_version"("projectId", "versionNum");

-- AddForeignKey
ALTER TABLE "project_version" ADD CONSTRAINT "project_version_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ux_input" ADD CONSTRAINT "ux_input_projectVersionId_fkey" FOREIGN KEY ("projectVersionId") REFERENCES "project_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_schema" ADD CONSTRAINT "ui_schema_projectVersionId_fkey" FOREIGN KEY ("projectVersionId") REFERENCES "project_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;
