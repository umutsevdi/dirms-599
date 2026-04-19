import type { InventoryItem } from "../features/inventory/types/inventory.types";

// Sample inventory data
export const sampleInventory: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Su Şişeleri",
    quantity: 500,
    resolves: ["Su"],
  },
  {
    id: "inv-2",
    name: "İlk Yardım Kitleri",
    quantity: 120,
    resolves: ["Sağlık"],
  },
  {
    id: "inv-3",
    name: "Bebek Battaniyeleri",
    quantity: 300,
    resolves: ["Battaniye", "Giyim"],
    group: "bebek",
  },
  {
    id: "inv-4",
    name: "Gıda Rasyonları",
    quantity: 800,
    resolves: ["Gıda"],
  },
  {
    id: "inv-5",
    name: "Bebek Maması",
    quantity: 150,
    resolves: ["Gıda"],
    group: "bebek",
  },
  {
    id: "inv-6",
    name: "Kadın Hijyen Kitleri",
    quantity: 200,
    resolves: ["Sağlık", "Giyim"],
    group: "kadın",
  },
  {
    id: "inv-7",
    name: "Yaşlı Bakım Malzemeleri",
    quantity: 100,
    resolves: ["Sağlık", "Barınma"],
    group: "yaşlı",
  },
  {
    id: "inv-8",
    name: "Acil Durum Jeneratörleri",
    quantity: 15,
    resolves: ["Elektrik", "Barınma"],
  },
];

export default sampleInventory;
