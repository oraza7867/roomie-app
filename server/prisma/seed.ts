import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample student data into database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Sample Users
  const user1 = await prisma.user.upsert({
    where: { email: 'aarav@delhi.edu' },
    update: {},
    create: {
      name: 'Aarav Sharma',
      email: 'aarav@delhi.edu',
      password: hashedPassword,
      age: 21,
      college: 'Delhi University (North Campus)',
      course: 'Computer Science',
      year: '3rd year',
      city: 'Delhi',
      bio: 'Quiet at night, pretty clean, and usually studying after dinner.',
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'ananya@pune.edu' },
    update: {},
    create: {
      name: 'Ananya Verma',
      email: 'ananya@pune.edu',
      password: hashedPassword,
      age: 20,
      college: 'Symbiosis Pune',
      course: 'Design & Media',
      year: '2nd year',
      city: 'Pune',
      bio: 'Early riser, loves tea, keeps the common area tidy.',
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'rohan@mumbai.edu' },
    update: {},
    create: {
      name: 'Rohan Gupta',
      email: 'rohan@mumbai.edu',
      password: hashedPassword,
      age: 22,
      college: 'IIT Bombay',
      course: 'Electrical Eng',
      year: '4th year',
      city: 'Mumbai',
      bio: 'Night owl coding DSA, respectful of boundaries.',
    }
  });

  // 2. Add Lifestyle Preferences
  await prisma.lifestylePreference.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      sleepSchedule: '10 PM – 12 AM',
      cleanliness: 'Very clean',
      noiseTolerance: 'Quiet',
      socialLevel: 'Somewhere in the middle',
      guestPreference: 'Occasional guests okay',
      smokingPreference: 'Non-smoker',
      foodPreference: 'Vegetarian',
      studyHabits: 'Prefers studying in room',
    }
  });

  await prisma.lifestylePreference.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      sleepSchedule: 'Before 10 PM',
      cleanliness: 'Very clean',
      noiseTolerance: 'Quiet',
      socialLevel: 'Mostly private',
      guestPreference: 'No overnight guests',
      smokingPreference: 'Non-smoker',
      foodPreference: 'Any food okay',
      studyHabits: 'Library regular',
    }
  });

  await prisma.lifestylePreference.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      sleepSchedule: 'After 2 AM',
      cleanliness: 'Fairly clean',
      noiseTolerance: 'Some background noise',
      socialLevel: 'Very social',
      guestPreference: 'Friends welcome',
      smokingPreference: 'Non-smoker',
      foodPreference: 'Non-Vegetarian',
      studyHabits: 'Night owl study sessions',
    }
  });

  // 3. Add Sample Room Listings
  await prisma.roomListing.createMany({
    data: [
      {
        ownerId: user1.id,
        title: 'Spacious 2BHK — 10 min from DU North Campus',
        description: 'Furnished room with study desk, Wi-Fi, balcony view, and quiet surroundings. Maid comes daily for cleaning.',
        city: 'Delhi',
        area: 'Kamla Nagar',
        monthlyRent: 8500,
        deposit: 15000,
        availableFrom: new Date(),
        roomType: 'SHARED',
        furnished: 'FULLY',
        preferredGender: 'MALE',
      },
      {
        ownerId: user2.id,
        title: 'Sunny Studio Flat — Near Symbiosis Campus',
        description: 'Clean room with private bathroom, high-speed Wi-Fi, power backup, and 24/7 security.',
        city: 'Pune',
        area: 'Viman Nagar',
        monthlyRent: 9500,
        deposit: 18000,
        availableFrom: new Date(),
        roomType: 'PRIVATE',
        furnished: 'FULLY',
        preferredGender: 'FEMALE',
      }
    ]
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
