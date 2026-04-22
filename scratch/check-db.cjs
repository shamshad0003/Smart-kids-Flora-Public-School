const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('--- Checking Database Connection ---');
    const count = await prisma.galleryItem.count();
    console.log(`Total images in database: ${count}`);
    
    if (count > 0) {
      const latest = await prisma.galleryItem.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      console.log('Latest 5 images:');
      console.log(JSON.stringify(latest, null, 2));
    } else {
      console.log('No images found in database.');
    }
  } catch (error) {
    console.error('DATABASE ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
