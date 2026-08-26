-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "caseFinish" TEXT NOT NULL DEFAULT 'Brushed & Polished',
ADD COLUMN     "dialFinish" TEXT NOT NULL DEFAULT 'Sunray Brushed',
ADD COLUMN     "handsType" TEXT NOT NULL DEFAULT 'Dauphine, Rhodium-Plated',
ADD COLUMN     "hourMarkers" TEXT NOT NULL DEFAULT 'Applied Baton Indexes',
ADD COLUMN     "jewelCount" INTEGER NOT NULL DEFAULT 21,
ADD COLUMN     "strapClasp" TEXT NOT NULL DEFAULT 'Pin Buckle',
ADD COLUMN     "strapFinish" TEXT NOT NULL DEFAULT 'Hand-Finished Edges';
