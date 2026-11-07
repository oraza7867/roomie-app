import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CAMPUS } from '../src/config/campus';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample student data into database for ' + CAMPUS.name + '...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Sample Users (All Integral University students)
  const user1 = await prisma.user.upsert({
    where: { email: 'aarav@iul.ac.in' },
    update: {},
    create: {
      name: 'Aarav Sharma',
      email: 'aarav@iul.ac.in',
      password: hashedPassword,
      age: 21,
      college: CAMPUS.name,
      course: 'B.Tech',
      year: '3rd year',
      city: 'Lucknow',
      hostelOrLocality: 'Dasauli / Kursi Road',
      bio: 'B.Tech student at IUL. Quiet at night, pretty clean, studying after dinner.',
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'ananya@iul.ac.in' },
    update: {},
    create: {
      name: 'Ananya Verma',
      email: 'ananya@iul.ac.in',
      password: hashedPassword,
      age: 20,
      college: CAMPUS.name,
      course: 'B.Pharm',
      year: '2nd year',
      city: 'Lucknow',
      hostelOrLocality: 'Hall 4 (Girls Hostel)',
      bio: 'Pharmacy student. Early riser, loves chai, keeps room tidy.',
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'rohan@iul.ac.in' },
    update: {},
    create: {
      name: 'Rohan Gupta',
      email: 'rohan@iul.ac.in',
      password: hashedPassword,
      age: 22,
      college: CAMPUS.name,
      course: 'BCA',
      year: '3rd year',
      city: 'Lucknow',
      hostelOrLocality: 'Matiyari',
      bio: 'BCA coder, respectful of personal space and boundaries.',
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
        title: 'Spacious 2BHK — 5 min from Integral University',
        description: 'Furnished room with study desk, Wi-Fi, balcony view, and quiet surroundings. Maid comes daily for cleaning.',
        locality: 'Kursi Road',
        area: 'Dasauli',
        lat: 26.9600,
        lng: 81.0020,
        distanceFromCampusKm: 0.25,
        monthlyRent: 8500,
        deposit: 15000,
        availableFrom: new Date(),
        roomType: 'SHARED',
        furnished: 'FULLY',
        preferredGender: 'MALE',
      },
      {
        ownerId: user2.id,
        title: 'Sunny Studio Flat — Near Gudamba Crossing',
        description: 'Clean room with private bathroom, high-speed Wi-Fi, power backup, and 24/7 security.',
        locality: 'Gudamba',
        area: 'Tedhi Pulia Road',
        lat: 26.9380,
        lng: 80.9850,
        distanceFromCampusKm: 2.75,
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
