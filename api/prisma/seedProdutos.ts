import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // limpa apenas dados relacionados aos produtos
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // cria categorias
  await prisma.category.createMany({
    data: [
      { name: 'Eletrônicos' },
      { name: 'Computadores' },
      { name: 'Casa' },
      { name: 'Escritório' },
      { name: 'Esportes' },
    ],
  });

  // busca categorias criadas
  const electronics = await prisma.category.findFirst({
    where: {
      name: 'Eletrônicos',
    },
  });

  const computers = await prisma.category.findFirst({
    where: {
      name: 'Computadores',
    },
  });

  const home = await prisma.category.findFirst({
    where: {
      name: 'Casa',
    },
  });

  const office = await prisma.category.findFirst({
    where: {
      name: 'Escritório',
    },
  });

  const sports = await prisma.category.findFirst({
    where: {
      name: 'Esportes',
    },
  });

  // cria produtos
  await prisma.product.createMany({
    data: [
      // Eletrônicos
      {
        name: 'Smartphone Galaxy',
        price: 2500,
        image: '',
        categoryId: electronics!.id,
      },
      {
        name: 'Fone Bluetooth',
        price: 300,
        image: '',
        categoryId: electronics!.id,
      },
      {
        name: 'Smart TV 50',
        price: 3200,
        image: '',
        categoryId: electronics!.id,
      },

      // Computadores
      {
        name: 'Notebook Gamer',
        price: 5500,
        image: '',
        categoryId: computers!.id,
      },
      {
        name: 'Monitor UltraWide',
        price: 1800,
        image: '',
        categoryId: computers!.id,
      },
      {
        name: 'Teclado Mecânico',
        price: 450,
        image: '',
        categoryId: computers!.id,
      },

      // Casa
      {
        name: 'Sofá Retrátil',
        price: 2300,
        image: '',
        categoryId: home!.id,
      },
      {
        name: 'Mesa de Jantar',
        price: 1400,
        image: '',
        categoryId: home!.id,
      },
      {
        name: 'Luminária LED',
        price: 120,
        image: '',
        categoryId: home!.id,
      },

      // Escritório
      {
        name: 'Cadeira Ergonômica',
        price: 950,
        image: '',
        categoryId: office!.id,
      },
      {
        name: 'Mesa Office',
        price: 700,
        image: '',
        categoryId: office!.id,
      },
      {
        name: 'Impressora',
        price: 600,
        image: '',
        categoryId: office!.id,
      },

      // Esportes
      {
        name: 'Bicicleta',
        price: 2100,
        image: '',
        categoryId: sports!.id,
      },
      {
        name: 'Esteira',
        price: 3500,
        image: '',
        categoryId: sports!.id,
      },
      {
        name: 'Kit Halteres',
        price: 400,
        image: '',
        categoryId: sports!.id,
      },
    ],
  });

  console.log('Seed de categorias e produtos executada com sucesso');
}

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });