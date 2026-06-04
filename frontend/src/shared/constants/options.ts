import type { InventoryGroup } from "../../features/inventory/types/inventory.types";

// Need options for PeopleReportDialog
export const NEED_OPTIONS = [
  "Su",
  "Gıda",
  "İlaç",
  "Barınma",
  "Kıyafet",
  "Battaniye",
  "Diğer",
];

// Contact method options for PeopleReportDialog
export const CONTACT_METHOD_OPTIONS = ["Telefon", "SMS", "Diğer"];

// Available needs for InventoryDialog
export const AVAILABLE_NEEDS = [
  "Su",
  "Gıda",
  "İlaç",
  "Barınma",
  "Kıyafet",
  "Battaniye",
  "Elektrik",
];

// Group options for InventoryDialog
export const GROUP_OPTIONS: { value: InventoryGroup; label: string }[] = [
  { value: "genel", label: "Genel" },
  { value: "bebek", label: "Bebek" },
  { value: "çocuk", label: "Çocuk" },
  { value: "yetişkin", label: "Yetişkin" },
  { value: "yaşlı", label: "Yaşlı" },
  { value: "kadın", label: "Kadın" },
];

export default {
  NEED_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  AVAILABLE_NEEDS,
  GROUP_OPTIONS,
};
