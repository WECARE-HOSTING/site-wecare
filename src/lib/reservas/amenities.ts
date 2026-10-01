import type { Lang } from "./i18n";

// Hostaway amenity names are English and overlapping (Internet / Wireless /
// Free WiFi). We show only the ones a guest actually decides on, collapsing
// synonyms; anything not listed here is left out on purpose. A listing stores
// the amenity id (the English label); the page turns it into the guest's language.
const ROWS: { names: string[]; pt: string; en: string; es: string }[] = [
  { names: ["Internet", "Wireless", "Free WiFi"], pt: "Wi-Fi", en: "Wi-Fi", es: "Wi-Fi" },
  { names: ["Kitchen"], pt: "Cozinha completa", en: "Full kitchen", es: "Cocina completa" },
  { names: ["Cooking basics"], pt: "Utensílios de cozinha", en: "Cooking basics", es: "Utensilios de cocina" },
  { names: ["Microwave"], pt: "Micro-ondas", en: "Microwave", es: "Microondas" },
  { names: ["Oven"], pt: "Forno", en: "Oven", es: "Horno" },
  { names: ["Refrigerator"], pt: "Geladeira", en: "Refrigerator", es: "Nevera" },
  { names: ["Dishwasher"], pt: "Lava-louças", en: "Dishwasher", es: "Lavavajillas" },
  { names: ["Coffee/tea maker"], pt: "Cafeteira", en: "Coffee maker", es: "Cafetera" },
  { names: ["Electric kettle"], pt: "Chaleira elétrica", en: "Electric kettle", es: "Hervidor eléctrico" },
  { names: ["TV"], pt: "TV", en: "TV", es: "TV" },
  { names: ["Air conditioning"], pt: "Ar-condicionado", en: "Air conditioning", es: "Aire acondicionado" },
  { names: ["Heating"], pt: "Aquecimento", en: "Heating", es: "Calefacción" },
  { names: ["Ceiling fan"], pt: "Ventilador de teto", en: "Ceiling fan", es: "Ventilador de techo" },
  { names: ["Laptop Friendly workspace"], pt: "Espaço de trabalho", en: "Workspace", es: "Espacio de trabajo" },
  { names: ["Office"], pt: "Escritório", en: "Office", es: "Oficina" },
  { names: ["Washing Machine"], pt: "Máquina de lavar", en: "Washing machine", es: "Lavadora" },
  { names: ["Dryer"], pt: "Secadora", en: "Dryer", es: "Secadora" },
  { names: ["Iron"], pt: "Ferro de passar", en: "Iron", es: "Plancha" },
  { names: ["Hair Dryer"], pt: "Secador de cabelo", en: "Hair dryer", es: "Secador de pelo" },
  { names: ["Linens"], pt: "Roupa de cama", en: "Bed linens", es: "Ropa de cama" },
  { names: ["Essentials"], pt: "Itens básicos (toalhas, sabonete, papel higiênico)", en: "Essentials (towels, soap, toilet paper)", es: "Básicos (toallas, jabón, papel higiénico)" },
  { names: ["Hot water"], pt: "Água quente", en: "Hot water", es: "Agua caliente" },
  { names: ["Room darkening shades"], pt: "Cortinas blackout", en: "Blackout curtains", es: "Cortinas opacas" },
  { names: ["Elevator"], pt: "Elevador", en: "Elevator", es: "Ascensor" },
  { names: ["Doorman"], pt: "Portaria", en: "Front desk", es: "Portería" },
  { names: ["24-hour checkin"], pt: "Check-in 24h", en: "24-hour check-in", es: "Llegada 24 h" },
  { names: ["Private entrance"], pt: "Entrada privativa", en: "Private entrance", es: "Entrada privada" },
  { names: ["Balcony"], pt: "Varanda", en: "Balcony", es: "Balcón" },
  { names: ["Garden or backyard"], pt: "Jardim ou quintal", en: "Garden or backyard", es: "Jardín o patio" },
  { names: ["Outdoor grill"], pt: "Churrasqueira", en: "Barbecue grill", es: "Barbacoa" },
  { names: ["Outdoor furniture"], pt: "Móveis externos", en: "Outdoor furniture", es: "Muebles de exterior" },
  { names: ["Hammock"], pt: "Rede", en: "Hammock", es: "Hamaca" },
  { names: ["Swimming pool"], pt: "Piscina", en: "Pool", es: "Piscina" },
  { names: ["Jacuzzi"], pt: "Jacuzzi", en: "Jacuzzi", es: "Jacuzzi" },
  { names: ["Sauna"], pt: "Sauna", en: "Sauna", es: "Sauna" },
  { names: ["Communal sauna"], pt: "Sauna no condomínio", en: "Shared sauna", es: "Sauna comunitaria" },
  { names: ["Gym", "Fitness center"], pt: "Academia", en: "Gym", es: "Gimnasio" },
  { names: ["Exercise equipment"], pt: "Equipamentos de ginástica", en: "Exercise equipment", es: "Equipo de ejercicio" },
  { names: ["Free parking"], pt: "Estacionamento gratuito", en: "Free parking", es: "Aparcamiento gratuito" },
  { names: ["Garage"], pt: "Garagem", en: "Garage", es: "Garaje" },
  { names: ["Electric vehicle charger"], pt: "Carregador para carro elétrico", en: "EV charger", es: "Cargador de coche eléctrico" },
  { names: ["City view"], pt: "Vista da cidade", en: "City view", es: "Vista a la ciudad" },
  { names: ["Beach view"], pt: "Vista para o mar", en: "Sea view", es: "Vista al mar" },
  { names: ["Beach front"], pt: "Pé na areia", en: "Beachfront", es: "Frente a la playa" },
  { names: ["Beach"], pt: "Perto da praia", en: "Near the beach", es: "Cerca de la playa" },
  { names: ["Beach essentials"], pt: "Itens de praia", en: "Beach essentials", es: "Artículos de playa" },
  { names: ["Breakfast"], pt: "Café da manhã", en: "Breakfast", es: "Desayuno" },
  { names: ["Suitable for children"], pt: "Ideal para crianças", en: "Family friendly", es: "Ideal para niños" },
  { names: ["Suitable for infants"], pt: "Ideal para bebês", en: "Suitable for infants", es: "Ideal para bebés" },
  { names: ["Baby crib"], pt: "Berço", en: "Crib", es: "Cuna" },
  { names: ["Pack n play travel crib"], pt: "Berço portátil", en: "Portable crib", es: "Cuna de viaje" },
  { names: ["Long term stays allowed"], pt: "Estadias longas", en: "Long stays allowed", es: "Estancias largas" },
  { names: ["Smoke detector"], pt: "Detector de fumaça", en: "Smoke detector", es: "Detector de humo" },
  { names: ["Fire Extinguisher"], pt: "Extintor de incêndio", en: "Fire extinguisher", es: "Extintor" },
];

const BY_HOSTAWAY_NAME = new Map(ROWS.flatMap((r) => r.names.map((n) => [n, r.en] as const)));
const BY_ID = new Map(ROWS.map((r) => [r.en, r]));

/** Amenity id (stable, language-free) for a Hostaway amenity name, or null when we don't show it. */
export function amenityId(hostawayName: string): string | null {
  return BY_HOSTAWAY_NAME.get(hostawayName) ?? null;
}

export function amenityLabel(id: string, lang: Lang): string {
  return BY_ID.get(id)?.[lang] ?? id;
}
