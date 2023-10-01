import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    const usersData = [
      {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone_number: '+1234567890',
        wallet_id: 1,
        forex_wallet_id: 2,
        account_created_on: new Date(),
        role_id: 1,
      },
      // Add more user objects as needed
    ];

    console.log(`Start seeding ...`);
    for (const u of usersData) {
      const user = await prisma.user.create({
        data: u,
      });
      console.log(`Created user with id: ${user.user_id}`);
    }
    console.log(`Seeding finished.`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function to seed the users
seedUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });