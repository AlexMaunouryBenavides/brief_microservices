import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { CarEntity } from './entities/CarEntity';
import { OptionEntity } from './entities/OptionEntity';
import { randomUUID } from 'crypto';

const cars: Array<{
  brand: string;
  model: string;
  year: number;
  rangeKm: number;
  powerKw: number;
  basePrice: number;
  imageUrl: string;
  description: string;
  options: Array<{ name: string; description: string; additionalPrice: number }>;
}> = [
  {
    brand: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2024,
    rangeKm: 629,
    powerKw: 258,
    basePrice: 46990,
    imageUrl: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800',
    description: 'La référence des berlines électriques premium.',
    options: [
      { name: 'Autopilot avancé', description: 'Navigation autonome sur autoroute', additionalPrice: 3800 },
      { name: 'Intérieur blanc', description: 'Sièges et tableau de bord blancs', additionalPrice: 1100 },
      { name: 'Jantes 20" Überturbine', description: 'Jantes performance chromées', additionalPrice: 1600 },
    ],
  },
  {
    brand: 'Tesla',
    model: 'Model Y Performance',
    year: 2024,
    rangeKm: 514,
    powerKw: 393,
    basePrice: 54990,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
    description: 'Le SUV électrique le plus vendu au monde.',
    options: [
      { name: 'Autopilot intégral', description: 'Capacité de conduite autonome complète', additionalPrice: 6900 },
      { name: 'Toit panoramique', description: 'Toit vitré intégral teInté', additionalPrice: 900 },
      { name: '3ème rang de sièges', description: '2 sièges supplémentaires à l\'arrière', additionalPrice: 3500 },
    ],
  },
  {
    brand: 'Renault',
    model: 'Megane E-Tech Electric',
    year: 2023,
    rangeKm: 470,
    powerKw: 160,
    basePrice: 35490,
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
    description: 'La compacte française réinventée pour l\'ère électrique.',
    options: [
      { name: 'Pack Confort', description: 'Sièges chauffants, volant chauffant, vitres arrière teintées', additionalPrice: 1200 },
      { name: 'OpenR Link Google', description: 'Système multimédia avec Google intégré 9,3"', additionalPrice: 800 },
    ],
  },
  {
    brand: 'BMW',
    model: 'iX3',
    year: 2024,
    rangeKm: 461,
    powerKw: 210,
    basePrice: 68500,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    description: 'Le SUV électrique premium par excellence.',
    options: [
      { name: 'Pack Confort Plus', description: 'Suspension pneumatique adaptative', additionalPrice: 2400 },
      { name: 'Système audio Harman Kardon', description: '16 haut-parleurs 464W', additionalPrice: 900 },
      { name: 'Pack Hiver', description: 'Sièges avant et arrière chauffants, volant chauffant', additionalPrice: 700 },
    ],
  },
  {
    brand: 'Volkswagen',
    model: 'ID.4 GTX',
    year: 2024,
    rangeKm: 480,
    powerKw: 250,
    basePrice: 52990,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    description: 'La puissance GTX dans un SUV familial.',
    options: [
      { name: 'Pack Confort Plus', description: 'Toit ouvrant panoramique, affichage tête haute', additionalPrice: 2100 },
      { name: 'Pack Assistance', description: 'Régulateur adaptatif, aide au stationnement 360°', additionalPrice: 1500 },
    ],
  },
];

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  const carRepo = AppDataSource.getRepository(CarEntity);
  const optionRepo = AppDataSource.getRepository(OptionEntity);

  await optionRepo.delete({});
  await carRepo.delete({});

  for (const data of cars) {
    const car = carRepo.create({
      id: randomUUID(),
      brand: data.brand,
      model: data.model,
      year: data.year,
      rangeKm: data.rangeKm,
      powerKw: data.powerKw,
      basePrice: data.basePrice,
      imageUrl: data.imageUrl,
      description: data.description,
    });
    const savedCar = await carRepo.save(car);

    for (const opt of data.options) {
      const option = optionRepo.create({
        id: randomUUID(),
        carId: savedCar.id,
        name: opt.name,
        description: opt.description,
        additionalPrice: opt.additionalPrice,
      });
      await optionRepo.save(option);
    }
  }

  console.log(`Seeded ${cars.length} cars with options.`);
  await AppDataSource.destroy();
}

void seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
