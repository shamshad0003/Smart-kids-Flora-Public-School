import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('--- Checking Database Connection ---');
    const count = await prisma.galleryItem.count();
    console.log(`Total images in database: ${count}`);
    
    if (count > 0) {
      const latest = await prisma.galleryItem.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      console.log('Latest 3 images:');
      console.log(JSON.stringify(latest, null, 2));
    }
  } catch (error) {
    console.error('DATABASE ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
