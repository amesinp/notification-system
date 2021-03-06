-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "topic" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_unique_url_topic" ON "Subscription"("url", "topic");
