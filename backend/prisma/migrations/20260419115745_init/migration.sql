-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "projectType" TEXT NOT NULL,
    "useAI" BOOLEAN NOT NULL DEFAULT true,
    "projectName" TEXT,
    "colorPalette" TEXT,
    "navbarPosition" TEXT,
    "pageCount" INTEGER NOT NULL DEFAULT 1,
    "uiPreferences" TEXT,
    "dbProvider" TEXT,
    "ormChoice" TEXT,
    "authRequired" BOOLEAN NOT NULL DEFAULT false,
    "apiType" TEXT,
    "additionalFeatures" TEXT,
    "generatedPrompt" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
