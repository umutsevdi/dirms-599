import type { InventoryGroup } from "../../features/inventory/types/inventory.types";

// Contact method options for PeopleReportDialog
export const CONTACT_METHOD_OPTIONS = ["Telefon", "SMS", "Diğer"];

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
  CONTACT_METHOD_OPTIONS,
  GROUP_OPTIONS,
};
