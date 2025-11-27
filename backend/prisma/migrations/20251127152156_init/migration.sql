-- CreateTable
CREATE TABLE "whiteboards" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "title" VARCHAR(100),
    "thumbnail" TEXT,

    CONSTRAINT "whiteboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elements" (
    "id" UUID NOT NULL,
    "whiteboard_id" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "points" JSONB,
    "color" VARCHAR(7) NOT NULL,
    "stroke_width" INTEGER NOT NULL,
    "content" TEXT,
    "font_size" INTEGER,
    "z_index" INTEGER NOT NULL DEFAULT 0,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL DEFAULT 'Anonymous User',
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drawing_actions" (
    "id" UUID NOT NULL,
    "whiteboard_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action_type" VARCHAR(20) NOT NULL,
    "element_id" UUID NOT NULL,
    "before_state" JSONB,
    "after_state" JSONB,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drawing_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_elements_whiteboard" ON "elements"("whiteboard_id");

-- CreateIndex
CREATE INDEX "idx_elements_zindex" ON "elements"("whiteboard_id", "z_index");

-- CreateIndex
CREATE INDEX "idx_actions_whiteboard_time" ON "drawing_actions"("whiteboard_id", "timestamp");

-- AddForeignKey
ALTER TABLE "elements" ADD CONSTRAINT "elements_whiteboard_id_fkey" FOREIGN KEY ("whiteboard_id") REFERENCES "whiteboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elements" ADD CONSTRAINT "elements_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawing_actions" ADD CONSTRAINT "drawing_actions_whiteboard_id_fkey" FOREIGN KEY ("whiteboard_id") REFERENCES "whiteboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawing_actions" ADD CONSTRAINT "drawing_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawing_actions" ADD CONSTRAINT "drawing_actions_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
