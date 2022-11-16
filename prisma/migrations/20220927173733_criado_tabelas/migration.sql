-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isRun" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobRuns" (
    "id" TEXT NOT NULL,
    "request" TEXT,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statusCodigo" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "jobRuns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobStatus" (
    "codigo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobStatus_pkey" PRIMARY KEY ("codigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_key_key" ON "jobs"("key");

-- AddForeignKey
ALTER TABLE "jobRuns" ADD CONSTRAINT "jobRuns_statusCodigo_fkey" FOREIGN KEY ("statusCodigo") REFERENCES "JobStatus"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobRuns" ADD CONSTRAINT "jobRuns_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
