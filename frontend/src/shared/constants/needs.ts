export const NEEDS_ARCHETYPE_MAP: Record<string, string> = {
  'su': 'Su',
  'gida': 'Gıda',
  'ilac': 'İlaç',
  'barinma': 'Barınma',
  'cadir': 'Çadır',
  'kiyafet': 'Kıyafet',
  'battaniye': 'Battaniye',
  'elektrik': 'Elektrik',
  'isitma': 'Isıtma',
  'hayvan-yemi': 'Hayvan Yemi',
  'konteyner': 'Konteyner',
  'saglik': 'Sağlık',
  'diger': 'Diğer',
};

export function getNeedName(archetypeId: string): string {
  return NEEDS_ARCHETYPE_MAP[archetypeId] || archetypeId;
}
