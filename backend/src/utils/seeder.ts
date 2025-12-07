import prisma from '../db';

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Tech Innovations Inc.',
    address: '123 Main Street',
    city: 'San Francisco',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    company: 'Digital Solutions Ltd.',
    address: '456 Oak Avenue',
    city: 'New York',
  },
  {
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    company: 'Creative Designs Co.',
    address: '789 Pine Road',
    city: 'Los Angeles',
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    company: 'Global Enterprises',
    address: '321 Elm Street',
    city: 'Chicago',
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    company: 'Innovation Labs',
    address: '654 Maple Drive',
    city: 'Boston',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    company: 'Future Systems Inc.',
    address: '987 Cedar Lane',
    city: 'Seattle',
  },
  {
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    company: 'Smart Tech Solutions',
    address: '147 Birch Boulevard',
    city: 'Austin',
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    company: 'Cloud Dynamics',
    address: '258 Spruce Way',
    city: 'Denver',
  },
  {
    name: 'James Taylor',
    email: 'james.taylor@example.com',
    company: 'Data Systems Corp.',
    address: '369 Willow Court',
    city: 'Miami',
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    company: 'Modern Solutions LLC',
    address: '741 Ash Street',
    city: 'Portland',
  },
  {
    name: 'Christopher White',
    email: 'chris.white@example.com',
    company: 'NextGen Technologies',
    address: '852 Poplar Avenue',
    city: 'Phoenix',
  },
  {
    name: 'Amanda Harris',
    email: 'amanda.harris@example.com',
    company: 'Innovative Ventures',
    address: '963 Cherry Drive',
    city: 'San Diego',
  },
];

export async function seedDatabaseIfNeeded() {
  try {
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      console.log('Database is empty. Seeding');

      for (const user of sampleUsers) {
        await prisma.user.create({
          data: user,
        });
      }

      console.log(`Automatically seeded ${sampleUsers.length} users`);
    } else {
      console.log(`Database already has ${userCount} users. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error during auto-seeding:', error);
  }
}
