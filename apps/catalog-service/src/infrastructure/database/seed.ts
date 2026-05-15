import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { CarEntity } from './entities/CarEntity';
import { OptionEntity } from './entities/OptionEntity';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker/locale/fr';

faker.seed(42);

const EV_CATALOG: Array<{
  brand: string;
  model: string;
  baseRangeKm: number;
  basePowerKw: number;
  basePrice: number;
}> = [
  { brand: 'Tesla', model: 'Model 3 Long Range', baseRangeKm: 629, basePowerKw: 258, basePrice: 46990 },
  { brand: 'Tesla', model: 'Model Y Performance', baseRangeKm: 514, basePowerKw: 393, basePrice: 54990 },
  { brand: 'Tesla', model: 'Model S Plaid', baseRangeKm: 652, basePowerKw: 760, basePrice: 119990 },
  { brand: 'Renault', model: 'Mégane E-Tech Electric', baseRangeKm: 470, basePowerKw: 160, basePrice: 35490 },
  { brand: 'Renault', model: 'Scenic E-Tech Electric', baseRangeKm: 625, basePowerKw: 220, basePrice: 44490 },
  { brand: 'BMW', model: 'iX3', baseRangeKm: 461, basePowerKw: 210, basePrice: 68500 },
  { brand: 'BMW', model: 'i4 M50', baseRangeKm: 510, basePowerKw: 544, basePrice: 84900 },
  { brand: 'BMW', model: 'iX xDrive50', baseRangeKm: 630, basePowerKw: 385, basePrice: 113900 },
  { brand: 'Volkswagen', model: 'ID.4 GTX', baseRangeKm: 480, basePowerKw: 250, basePrice: 52990 },
  { brand: 'Volkswagen', model: 'ID.7 Pro S', baseRangeKm: 709, basePowerKw: 210, basePrice: 64990 },
  { brand: 'Peugeot', model: 'e-3008 Long Range', baseRangeKm: 700, basePowerKw: 170, basePrice: 47990 },
  { brand: 'Peugeot', model: 'e-308', baseRangeKm: 410, basePowerKw: 156, basePrice: 37990 },
  { brand: 'Kia', model: 'EV6 GT', baseRangeKm: 424, basePowerKw: 430, basePrice: 65990 },
  { brand: 'Kia', model: 'EV9 GT-Line', baseRangeKm: 505, basePowerKw: 283, basePrice: 74990 },
  { brand: 'Hyundai', model: 'IONIQ 6 RWD', baseRangeKm: 614, basePowerKw: 168, basePrice: 44900 },
  { brand: 'Hyundai', model: 'IONIQ 5 N', baseRangeKm: 448, basePowerKw: 478, basePrice: 69900 },
  { brand: 'Mercedes', model: 'EQS 450+', baseRangeKm: 784, basePowerKw: 245, basePrice: 109900 },
  { brand: 'Mercedes', model: 'EQB 300 4MATIC', baseRangeKm: 419, basePowerKw: 168, basePrice: 55900 },
  { brand: 'Audi', model: 'Q4 e-tron 50', baseRangeKm: 488, basePowerKw: 220, basePrice: 58900 },
  { brand: 'Audi', model: 'e-tron GT RS', baseRangeKm: 598, basePowerKw: 475, basePrice: 149900 },
];

const OPTION_POOLS: Record<string, Array<{ name: string; description: string; minPrice: number; maxPrice: number }>> = {
  tech: [
    { name: 'Pack Autopilot', description: 'Navigation autonome sur autoroute et parking automatique', minPrice: 3500, maxPrice: 7500 },
    { name: 'Affichage tête haute AR', description: "Projection d'informations de conduite sur le pare-brise", minPrice: 800, maxPrice: 1500 },
    { name: 'Son surround 3D', description: 'Système audio premium 16 haut-parleurs 600W', minPrice: 700, maxPrice: 1800 },
    { name: 'Chargeur embarqué 22 kW', description: "Charge en courant alternatif jusqu'à 22 kW", minPrice: 400, maxPrice: 900 },
    { name: 'Caméra 360°', description: 'Aide au stationnement avec vue panoramique', minPrice: 500, maxPrice: 1200 },
    { name: 'Internet embarqué Wi-Fi', description: 'Hotspot Wi-Fi 4G/5G pour 8 appareils', minPrice: 300, maxPrice: 600 },
  ],
  comfort: [
    { name: 'Pack Confort Hiver', description: 'Sièges chauffants avant/arrière, volant chauffant, dégivrage pare-brise', minPrice: 600, maxPrice: 1200 },
    { name: 'Sièges massants', description: 'Sièges avant avec fonction massage 8 points', minPrice: 900, maxPrice: 2000 },
    { name: 'Toit panoramique', description: 'Toit vitré intégral avec protection solaire', minPrice: 800, maxPrice: 1800 },
    { name: 'Sellerie cuir Nappa', description: 'Habillage intérieur en cuir pleine fleur', minPrice: 2000, maxPrice: 4500 },
    { name: 'Hayon électrique mains libres', description: 'Ouverture automatique du coffre par détection de pied', minPrice: 400, maxPrice: 800 },
    { name: 'Pack 3ème rangée', description: '2 sièges escamotables supplémentaires', minPrice: 2500, maxPrice: 4000 },
  ],
  design: [
    { name: 'Jantes 20" sport', description: 'Jantes alliage forgé design bicolore', minPrice: 1200, maxPrice: 2500 },
    { name: 'Jantes 21" exclusives', description: 'Jantes grande dimension finition polie', minPrice: 1800, maxPrice: 3500 },
    { name: 'Peinture bi-ton', description: 'Toit et rétroviseurs en couleur contrastante', minPrice: 600, maxPrice: 1500 },
    { name: 'Pack éclairage ambiance', description: 'Éclairage intérieur RGB 64 couleurs', minPrice: 300, maxPrice: 700 },
    { name: "Film de protection carrosserie", description: 'Film transparent anti-éclats sur zones exposées', minPrice: 800, maxPrice: 2000 },
  ],
  safety: [
    { name: 'Pack Sécurité Plus', description: 'Freinage autonome, détection angle mort, aide au maintien de voie', minPrice: 1200, maxPrice: 2500 },
    { name: 'Pack Assistance Conduite', description: 'Régulateur adaptatif prédictif, reconnaissance panneaux', minPrice: 900, maxPrice: 1800 },
    { name: "Surveillance du conducteur", description: "Détection de somnolence et d'inattention avec alertes", minPrice: 400, maxPrice: 800 },
  ],
};

function pickRandomOptions(): Array<{ name: string; description: string; additionalPrice: number }> {
  const count = faker.number.int({ min: 2, max: 5 });
  const allOptions = Object.values(OPTION_POOLS).flat();
  const shuffled = faker.helpers.shuffle(allOptions);
  const picked = shuffled.slice(0, count);

  return picked.map((opt) => ({
    name: opt.name,
    description: opt.description,
    additionalPrice: faker.number.int({ min: opt.minPrice, max: opt.maxPrice, multipleOf: 50 }),
  }));
}

const UNSPLASH_EV_IMAGES = [
  'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
];

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  const carRepo = AppDataSource.getRepository(CarEntity);
  const optionRepo = AppDataSource.getRepository(OptionEntity);

  await AppDataSource.createQueryBuilder().delete().from(OptionEntity).execute();
  await AppDataSource.createQueryBuilder().delete().from(CarEntity).execute();

  for (const spec of EV_CATALOG) {
    const car = carRepo.create({
      id: randomUUID(),
      brand: spec.brand,
      model: spec.model,
      year: faker.helpers.arrayElement([2023, 2024, 2025]),
      rangeKm: spec.baseRangeKm + faker.number.int({ min: -30, max: 30, multipleOf: 5 }),
      powerKw: spec.basePowerKw,
      basePrice: spec.basePrice + faker.number.int({ min: -500, max: 500, multipleOf: 100 }),
      imageUrl: faker.helpers.arrayElement(UNSPLASH_EV_IMAGES),
      description: faker.helpers.arrayElement([
        `${spec.model} : ${faker.commerce.productDescription()}`,
        `La nouvelle référence parmi les véhicules électriques ${spec.brand}.`,
        `Performance, autonomie et technologie au service de votre mobilité.`,
        `Découvrez l'excellence électrique avec le ${spec.model}.`,
      ]),
    });

    const savedCar = await carRepo.save(car);

    for (const opt of pickRandomOptions()) {
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

  console.log(`Seeded ${EV_CATALOG.length} cars with options.`);
  await AppDataSource.destroy();
}

void seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
