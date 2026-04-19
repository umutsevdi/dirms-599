import type { Entity, Employee, EntityType, EmployeeRole } from "../features/auth/types/auth.types";

// Mock entities (organizations)
export const entities: Entity[] = [
  {
    id: "ent-1",
    name: "Türk Kızılayı",
    type: "STK" as EntityType,
    logoUrl:
      "https://www.kliksoft.net/wp-content/uploads/logo-turk-kizilay.png",
    description:
      "Türkiye'nin en büyük sivil toplum kuruluşu olarak afet yardımları ve insani yardım faaliyetleri yürütmektedir.",
    website: "https://www.kizilay.org.tr",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "ent-2",
    name: "İstanbul Teknik Üniversitesi",
    type: "Üniversite" as EntityType,
    logoUrl:
      "https://www.itu.edu.tr/Sitefinity/WebsiteTemplates/ITUTemplate/App_Themes/ITUTemplate/lib/img/itu-logo-white.png",
    description:
      "Afet araştırmaları ve koordinasyonu alanında lider teknik üniversite.",
    website: "https://www.itu.edu.tr",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "ent-3",
    name: "AKUT Arama Kurtarma Derneği",
    type: "STK" as EntityType,
    logoUrl:
      "http://www.akut.org.tr/images/AKUT-logo-400x400.png",
    description:
      "Türkiye'nin önde gelen arama kurtarma sivil toplum kuruluşu.",
    website: "https://www.akut.org.tr",
    createdAt: "2024-04-05T00:00:00Z",
    updatedAt: "2024-04-05T00:00:00Z",
  },
  {
    id: "ent-4",
    name: "Boğaziçi Üniversitesi",
    type: "Üniversite" as EntityType,
    logoUrl:
      "https://mediastore.cc.bogazici.edu.tr/web/upload/sayfalar/776-bogazici-university-corporate-logos-20250522-175905_755x440.jpg",
    description:
      "Afet çalışmaları ve sürdürülebilirlik araştırmalarıyla öne çıkan köklü üniversite.",
    website: "https://www.boun.edu.tr",
    createdAt: "2024-05-10T00:00:00Z",
    updatedAt: "2024-05-10T00:00:00Z",
  },
];

// Mock employees (users)
export const employees: Employee[] = [
  // Türk Kızılayı çalışanları
  {
    id: "emp-1",
    fullName: "Ayşe Yılmaz",
    email: "ayse.yilmaz@kizilay.org.tr",
    entityId: "ent-1",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-01-15T00:00:00Z",
    lastLoginAt: "2024-04-15T10:30:00Z",
  },
  {
    id: "emp-2",
    fullName: "Mehmet Kaya",
    email: "mehmet.kaya@kizilay.org.tr",
    entityId: "ent-1",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-01-20T00:00:00Z",
    lastLoginAt: "2024-04-14T14:20:00Z",
  },
  {
    id: "emp-3",
    fullName: "Fatma Demir",
    email: "fatma.demir@kizilay.org.tr",
    entityId: "ent-1",
    role: "USER" as EmployeeRole,
    enabled: false, // Disabled employee example
    createdAt: "2024-02-01T00:00:00Z",
    lastLoginAt: "2024-03-10T09:15:00Z",
  },
  // İTÜ çalışanları
  {
    id: "emp-4",
    fullName: "Prof. Dr. Ahmet Şahin",
    email: "sahin@itu.edu.tr",
    entityId: "ent-2",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-02-20T00:00:00Z",
    lastLoginAt: "2024-04-19T08:45:00Z",
  },
  {
    id: "emp-5",
    fullName: "Dr. Zeynep Özdemir",
    email: "ozdemir@itu.edu.tr",
    entityId: "ent-2",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-02-25T00:00:00Z",
    lastLoginAt: "2024-04-18T16:30:00Z",
  },
  {
    id: "emp-6",
    fullName: "Burak Yıldız",
    email: "yildiz@itu.edu.tr",
    entityId: "ent-2",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-03-01T00:00:00Z",
    lastLoginAt: "2024-04-17T11:20:00Z",
  },
  // AKUT çalışanları
  {
    id: "emp-10",
    fullName: "Ali Veli",
    email: "ali.veli@akut.org.tr",
    entityId: "ent-3",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-04-05T00:00:00Z",
    lastLoginAt: "2024-04-19T09:00:00Z",
  },
  {
    id: "emp-11",
    fullName: "Elif Çelik",
    email: "elif.celik@akut.org.tr",
    entityId: "ent-3",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-04-10T00:00:00Z",
    lastLoginAt: "2024-04-18T14:15:00Z",
  },
  // Boğaziçi Üniversitesi çalışanları
  {
    id: "emp-12",
    fullName: "Prof. Dr. Cemal Bilgin",
    email: "bilgin@boun.edu.tr",
    entityId: "ent-4",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-05-10T00:00:00Z",
    lastLoginAt: "2024-04-19T10:30:00Z",
  },
  {
    id: "emp-13",
    fullName: "Dr. Eda Sarı",
    email: "sari@boun.edu.tr",
    entityId: "ent-4",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-05-15T00:00:00Z",
    lastLoginAt: "2024-04-18T16:45:00Z",
  },
  {
    id: "emp-14",
    fullName: "Barış Tan",
    email: "tan@boun.edu.tr",
    entityId: "ent-4",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-05-20T00:00:00Z",
    lastLoginAt: "2024-04-17T09:20:00Z",
  },
];

// Test credentials for development
export const getTestCredentials = (): {
  email: string;
  password: null;
  role: EmployeeRole;
  entity: string;
}[] => {
  return employees.map((e) => ({
    email: e.email,
    password: null,
    role: e.role,
    entity: entities.find((ent) => ent.id === e.entityId)?.name || "Unknown",
  }));
};

export default { entities, employees };
