require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

function createUnavailableError() {
  const error = new Error('DATABASE_URL environment variable is not configured.');
  error.code = 'DATABASE_UNAVAILABLE';
  return error;
}

function createUnavailablePrisma() {
  const throwUnavailable = async () => {
    throw createUnavailableError();
  };

  return {
    $disconnect: async () => {},
    $queryRaw: throwUnavailable,
    project: {
      count: throwUnavailable,
      findMany: throwUnavailable,
      findUnique: throwUnavailable,
      create: throwUnavailable,
      update: throwUnavailable,
      delete: throwUnavailable,
    },
  };
}

let prisma;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  prisma = createUnavailablePrisma();
} else {
  const adapter = new PrismaPg(connectionString);
  prisma = new PrismaClient({ adapter });
}

module.exports = { prisma };
