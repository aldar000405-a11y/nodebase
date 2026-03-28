DO $$
BEGIN
  -- project
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Project_pkey'
      AND conrelid = 'public.project'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "project" RENAME CONSTRAINT "Project_pkey" TO "project_pkey"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Project_userId_fkey'
      AND conrelid = 'public.project'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "project" RENAME CONSTRAINT "Project_userId_fkey" TO "project_userId_fkey"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'project' AND indexname = 'Project_userId_idx'
  ) THEN
    EXECUTE 'ALTER INDEX "Project_userId_idx" RENAME TO "project_userId_idx"';
  END IF;

  -- project_version
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ProjectVersion_pkey'
      AND conrelid = 'public.project_version'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "project_version" RENAME CONSTRAINT "ProjectVersion_pkey" TO "project_version_pkey"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ProjectVersion_projectId_fkey'
      AND conrelid = 'public.project_version'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "project_version" RENAME CONSTRAINT "ProjectVersion_projectId_fkey" TO "project_version_projectId_fkey"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'project_version' AND indexname = 'ProjectVersion_projectId_versionNum_key'
  ) THEN
    EXECUTE 'ALTER INDEX "ProjectVersion_projectId_versionNum_key" RENAME TO "project_version_projectId_versionNum_key"';
  END IF;

  -- ui_schema
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UiSchema_pkey'
      AND conrelid = 'public.ui_schema'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "ui_schema" RENAME CONSTRAINT "UiSchema_pkey" TO "ui_schema_pkey"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UiSchema_projectVersionId_fkey'
      AND conrelid = 'public.ui_schema'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "ui_schema" RENAME CONSTRAINT "UiSchema_projectVersionId_fkey" TO "ui_schema_projectVersionId_fkey"';
  END IF;

  -- ux_input
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UxInput_pkey'
      AND conrelid = 'public.ux_input'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "ux_input" RENAME CONSTRAINT "UxInput_pkey" TO "ux_input_pkey"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UxInput_projectVersionId_fkey'
      AND conrelid = 'public.ux_input'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE "ux_input" RENAME CONSTRAINT "UxInput_projectVersionId_fkey" TO "ux_input_projectVersionId_fkey"';
  END IF;
END $$;

-- Remove out-of-band column added outside migrations so migrate history can reconcile.
ALTER TABLE "project" DROP COLUMN IF EXISTS "uxBrief";
