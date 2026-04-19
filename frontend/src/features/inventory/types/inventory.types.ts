export type InventoryGroup =
  | "bebek"
  | "çocuk"
  | "yetişkin"
  | "yaşlı"
  | "kadın"
  | "genel";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  resolves: string[]; // e.g., ["Medical", "Water", "Food"]
  group?: InventoryGroup; // e.g., "baby", "women", "elderly", etc.
}
