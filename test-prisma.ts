
import prisma from './src/lib/prisma';
import { nanoid } from 'nanoid';

async function main() {
    console.log('Successfully imported prisma client');
    console.log('NanoID:', nanoid(8));
    try {
        const modelCount = Object.keys(prisma).filter(key => key.startsWith('$') === false).length;
        console.log(`Prisma client initialized. Available resource properties: ${modelCount}`);

        // Check if 'paste' model exists if route expects it, but for now just logging keys
        console.log('Keys on prisma instance:', Object.keys(prisma));
    } catch (e) {
        console.error('Error instantiating prisma:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
