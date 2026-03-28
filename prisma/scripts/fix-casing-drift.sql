DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Project'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'project'
  ) THEN
    EXECUTE 'ALTER TABLE "Project" RENAME TO "project"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ProjectVersion'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'project_version'
  ) THEN
    EXECUTE 'ALTER TABLE "ProjectVersion" RENAME TO "project_version"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'UxInput'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ux_input'
  ) THEN
    EXECUTE 'ALTER TABLE "UxInput" RENAME TO "ux_input"';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'UiSchema'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ui_schema'
  ) THEN
    EXECUTE 'ALTER TABLE "UiSchema" RENAME TO "ui_schema"';
  END IF;
END $$;
