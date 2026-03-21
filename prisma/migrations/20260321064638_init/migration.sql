-- CreateTable
CREATE TABLE "Task" (
    "id" BIGSERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "tag" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyLog" (
    "id" BIGSERIAL NOT NULL,
    "taskId" BIGINT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudyLog" ADD CONSTRAINT "StudyLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
