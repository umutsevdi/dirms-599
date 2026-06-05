-- ============================================================================
-- DİRMS Needs Archetypes - Generated from boun_data-trimmed.csv Analysis
-- Source: Turkish Earthquake Relief Data (Feb 2023) - BOUN Dataset
-- Total records analyzed: 1804
-- Generated: 2026-06-05
-- ============================================================================
-- This script defines needs archetypes derived from real disaster data patterns.
-- Each archetype includes urgency rules based on frequency and criticality
-- observed in the field reports.
-- ============================================================================

-- ============================================================================
-- 1. BARINMA (SHELTER) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'cadir',
    'Çadır',
    'Acil barınma çadırı ihtiyacı. Deprem sonrası evleri yıkılan veya hasar gören kişiler için geçici barınma.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 100, "setUrgency": "critical", "message": "KRİTİK: Toplu çadır ihtiyacı (>100)"},
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Büyük çadır ihtiyacı (>50)"},
        {"field": "quantity", "operator": ">", "value": 20, "setUrgency": "medium", "message": "ORTA: Orta seviye çadır ihtiyacı (>20)"}
    ]'::jsonb,
    'tent',
    '#FF6B6B',
    NOW(), NOW(), 1
),
(
    'konteyner',
    'Konteyner',
    'Konteyner konut ihtiyacı. Çadırda kalması zor olan yaşlı, engelli veya uzun süreli barınma gereken durumlar.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "critical", "message": "KRİTİK: Büyük konteyner ihtiyacı (>50)"},
        {"field": "hasDisabled", "operator": "==", "value": true, "setUrgency": "high", "message": "YÜKSEK: Engelli/yaşlı için konteyner gerekli"}
    ]'::jsonb,
    'container',
    '#4ECDC4',
    NOW(), NOW(), 1
),
(
    'yatak',
    'Yatak',
    'Yatak ve uyku malzemesi ihtiyacı. Özellikle sahra koşullarında temel uyku ihtiyacı.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'bed',
    '#95E1D3',
    NOW(), NOW(), 1
),
(
    'hayvan-cadiri',
    'Hayvan Çadırı/Barınağı',
    'Hayvanlar için geçici barınak ihtiyacı. Büyükbaş ve küçükbaş hayvanların korunması.',
    'need',
    'SYSTEM',
    '[
        {"field": "animalCount", "operator": ">", "value": 100, "setUrgency": "high", "message": "YÜKSEK: Çok sayıda hayvan barınak bekliyor (>100)"}
    ]'::jsonb,
    'warehouse',
    '#F38181',
    NOW(), NOW(), 1
),
(
    'ahir',
    'Ahır',
    'Hayvanlar için ahır ihtiyacı. Yıkılan ahırların yerine geçici veya kalıcı ahır.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'warehouse',
    '#AA96DA',
    NOW(), NOW(), 1
),
(
    'seyyar-tuvalet',
    'Seyyar Tuvalet/Banyo',
    'Mobil tuvalet ve banyo üniteleri. Hijyen ve sanitasyon için acil ihtiyaç.',
    'need',
    'SYSTEM',
    '[
        {"field": "population", "operator": ">", "value": 500, "setUrgency": "high", "message": "YÜKSEK: Kalabalık nüfus için seyyar tuvalet gerekli (>500 kişi)"}
    ]'::jsonb,
    'bath',
    '#FCBAD3',
    NOW(), NOW(), 1
),
(
    'branda',
    'Branda',
    'Geçici örtü ve branda ihtiyacı. Enkaz üstü örtme, geçici koruma amaçlı.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'layers',
    '#FFFFD2',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 2. GIDA (FOOD) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'gida',
    'Gıda',
    'Genel gıda ihtiyacı. Kuru gıda, bakliyat, temel besin maddeleri.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 500, "setUrgency": "critical", "message": "KRİTİK: Büyük gıda ihtiyacı (>500 kişi/paket)"},
        {"field": "quantity", "operator": ">", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Önemli gıda ihtiyacı (>200)"},
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "medium", "message": "ORTA: Gıda desteği gerekli (>50)"}
    ]'::jsonb,
    'restaurant',
    '#FFA07A',
    NOW(), NOW(), 1
),
(
    'kuru-gida',
    'Kuru Gıda',
    'Bakliyat, un, bulgur, pirinç, makarna gibi kuru gıda maddeleri. Çay, şeker, yağ dahil.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 300, "setUrgency": "high", "message": "YÜKSEK: Büyük kuru gıda ihtiyacı (>300)"}
    ]'::jsonb,
    'grain',
    '#DEB887',
    NOW(), NOW(), 1
),
(
    'bebek-mamasi',
    'Bebek Maması',
    'Bebek formülü ve bebek gıda ürünleri. 0-12 ay arası bebekler için kritik ihtiyaç.',
    'need',
    'SYSTEM',
    '[
        {"field": "babyCount", "operator": ">", "value": 20, "setUrgency": "critical", "message": "KRİTİK: Çok sayıda bebek mama bekliyor (>20)"},
        {"field": "babyCount", "operator": ">", "value": 5, "setUrgency": "high", "message": "YÜKSEK: Bebek mama ihtiyacı (>5)"}
    ]'::jsonb,
    'baby-formula',
    '#FFB6C1',
    NOW(), NOW(), 1
),
(
    'ekmek',
    'Ekmek',
    'Günlük ekmek ihtiyacı. Taze ekmek dağıtımı veya ekmek kartsız erişim.',
    'need',
    'SYSTEM',
    '[
        {"field": "dailyQuantity", "operator": ">", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Günlük büyük ekmek ihtiyacı (>200)"}
    ]'::jsonb,
    'bakery',
    '#F5DEB3',
    NOW(), NOW(), 1
),
(
    'kahvaltilik',
    'Kahvaltılık Ürünler',
    'Peynir, zeytin, reçel, tereyağı gibi kahvaltılık temel gıdalar.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'coffee',
    '#FFE4B5',
    NOW(), NOW(), 1
),
(
    'glutensiz-gida',
    'Glutensiz/Özel Gıda',
    'Fenilketonüri, çölyak vb. hastalıklar için özel diyet gıdaları.',
    'need',
    'SYSTEM',
    '[
        {"field": "hasSpecialDiet", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Özel diyet gıdası acil gerekli"}
    ]'::jsonb,
    'medical-food',
    '#DDA0DD',
    NOW(), NOW(), 1
),
(
    'konserve',
    'Konserve Yiyecek',
    'Hazır konserve gıdalar. Pişirme imkanı olmayan durumlar için.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'canned-food',
    '#CD853F',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 3. ISINMA ve YAKIT (HEATING & FUEL) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'isitma',
    'Isıtma',
    'Isıtma ihtiyacı. Soba, ısıtıcı, kalorifer vb. ısınma araçları.',
    'need',
    'SYSTEM',
    '[
        {"field": "winterSeason", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Kış ayında ısınma hayati önem taşıyor"},
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Büyük ısıtıcı ihtiyacı (>50)"}
    ]'::jsonb,
    'whatshot',
    '#FF4500',
    NOW(), NOW(), 1
),
(
    'komur',
    'Kömür',
    'Isınma amaçlı kömür ihtiyacı. Soba kömürü, kalorifer kömürü.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 100, "setUrgency": "high", "message": "YÜKSEK: Büyük kömür ihtiyacı (>100 torba)"}
    ]'::jsonb,
    'local-fire-dept',
    '#8B4513',
    NOW(), NOW(), 1
),
(
    'odun',
    'Odun/Yakacak',
    'Isınma amaçlı odun ve yakacak ihtiyacı.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'park',
    '#A0522D',
    NOW(), NOW(), 1
),
(
    'yakit',
    'Yakıt (Mazot/Benzin)',
    'Araç ve jeneratör yakıtı ihtiyacı. Mazot, benzin, LPG.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 500, "setUrgency": "high", "message": "YÜKSEK: Büyük yakıt ihtiyacı (>500 litre)"}
    ]'::jsonb,
    'local-gas-station',
    '#FFD700',
    NOW(), NOW(), 1
),
(
    'tup',
    'Tüp (LPG/Mutfak Gazı)',
    'Mutfak tüpü ve katalitik soba tüpü ihtiyacı.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Büyük tüp ihtiyacı (>50 adet)"}
    ]'::jsonb,
    'propane-tank',
    '#FF8C00',
    NOW(), NOW(), 1
),
(
    'battaniye',
    'Battaniye',
    'Battaniye ve ısınma malzemesi ihtiyacı. Termal battaniye dahil.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Büyük battaniye ihtiyacı (>200)"},
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "medium", "message": "ORTA: Battaniye desteği gerekli (>50)"}
    ]'::jsonb,
    'hotel',
    '#4169E1',
    NOW(), NOW(), 1
),
(
    'soba',
    'Soba',
    'Odun sobası, katalitik soba vb. ısınma araçları.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'fireplace',
    '#B22222',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 4. SU (WATER) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'su',
    'Su',
    'İçme suyu ve kullanım suyu ihtiyacı. Şebeke suyu kesintisi veya kirlenmesi durumunda.',
    'need',
    'SYSTEM',
    '[
        {"field": "noWaterAccess", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Su erişimi tamamen kesik"},
        {"field": "quantity", "operator": ">", "value": 500, "setUrgency": "high", "message": "YÜKSEK: Büyük su ihtiyacı (>500 litre)"}
    ]'::jsonb,
    'water-drop',
    '#1E90FF',
    NOW(), NOW(), 1
),
(
    'icme-suyu',
    'İçme Suyu',
    'Şişelenmiş veya tankerdan içme suyu ihtiyacı. Sağlık için kritik.',
    'need',
    'SYSTEM',
    '[
        {"field": "population", "operator": ">", "value": 1000, "setUrgency": "critical", "message": "KRİTİK: Kalabalık nüfus içme suyu bekliyor (>1000)"}
    ]'::jsonb,
    'water',
    '#00BFFF',
    NOW(), NOW(), 1
),
(
    'su-altyapi',
    'Su Altyapı/Boru',
    'Şebeke suyu altyapı onarımı. Boru, tesisat, su deposu ihtiyacı.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'plumbing',
    '#4682B4',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 5. ILAC ve SAGLIK (MEDICAL & HEALTH) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'ilac',
    'İlaç',
    'Genel ilaç ihtiyacı. Kronik hastalık ilaçları, akut tedavi ilaçları.',
    'need',
    'SYSTEM',
    '[
        {"field": "chronicPatientCount", "operator": ">", "value": 20, "setUrgency": "critical", "message": "KRİTİK: Çok sayıda kronik hasta ilaç bekliyor (>20)"},
        {"field": "chronicPatientCount", "operator": ">", "value": 5, "setUrgency": "high", "message": "YÜKSEK: Kronik hasta ilaç ihtiyacı (>5)"},
        {"field": "daysRemaining", "operator": "<", "value": 3, "setUrgency": "critical", "message": "KRİTİK: İlaç 3 günden az kaldı"}
    ]'::jsonb,
    'medical-bag',
    '#DC143C',
    NOW(), NOW(), 1
),
(
    'kronik-ilac',
    'Kronik Hastalık İlacı',
    'Diyabet (şeker), hipertansiyon (tansiyon), kalp hastalığı, astım, KOAH gibi kronik hastalık ilaçları.',
    'need',
    'SYSTEM',
    '[
        {"field": "patientCount", "operator": ">", "value": 10, "setUrgency": "critical", "message": "KRİTİK: Birden fazla kronik hasta ilaçsız (>10)"},
        {"field": "hasInsulin", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: İnsülin ihtiyacı hayati"}
    ]'::jsonb,
    'pill',
    '#B22222',
    NOW(), NOW(), 1
),
(
    'agri-kesici',
    'Ağrı Kesici',
    'Ağrı kesici ilaç ihtiyacı. Apranax, parasetamol vb.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'pain-relief',
    '#CD5C5C',
    NOW(), NOW(), 1
),
(
    'antibiyotik',
    'Antibiyotik',
    'Enfeksiyon tedavisi için antibiyotik ihtiyacı.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Büyük antibiyotik ihtiyacı (>50)"}
    ]'::jsonb,
    'antibiotic',
    '#8B0000',
    NOW(), NOW(), 1
),
(
    'ates-dusurucu',
    'Ateş Düşürücü/Çocuk Şurubu',
    'Çocuklar için ateş düşürücü şurup ve soğuk algınlığı ilaçları.',
    'need',
    'SYSTEM',
    '[
        {"field": "childCount", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Çok sayıda çocuk ateş düşürücü bekliyor (>50)"}
    ]'::jsonb,
    'child-care',
    '#FF69B4',
    NOW(), NOW(), 1
),
(
    'oksijen-tupu',
    'Oksijen Tüpü',
    'Nefes alamayan hastalar için oksijen tüpü ve solunum desteği.',
    'need',
    'SYSTEM',
    '[
        {"field": "patientCount", "operator": ">", "value": 1, "setUrgency": "critical", "message": "KRİTİK: Oksijen tüpü hayati önem taşıyor"}
    ]'::jsonb,
    'oxygen',
    '#00CED1',
    NOW(), NOW(), 1
),
(
    'tekerlekli-sandalye',
    'Tekerlekli Sandalye',
    'Engelli ve hareket kısıtlılığı olan bireyler için tekerlekli sandalye. Akülü sandalye dahil.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 5, "setUrgency": "high", "message": "YÜKSEK: Birden fazla tekerlekli sandalye gerekli (>5)"}
    ]'::jsonb,
    'accessible',
    '#9370DB',
    NOW(), NOW(), 1
),
(
    'saglik',
    'Sağlık Hizmeti',
    'Genel sağlık hizmeti ihtiyacı. Doktor, sahra hastanesi, gezici sağlık ekibi.',
    'need',
    'SYSTEM',
    '[
        {"field": "hasFieldHospital", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Sahra hastanesi acil gerekli"}
    ]'::jsonb,
    'hospital',
    '#2E8B57',
    NOW(), NOW(), 1
),
(
    'ozel-ilac',
    'Özel İlaç (Epilepsi/SMA/Kanser)',
    'Rivotril, Keppra, Tegrefol (epilepsi), SMA ilaçları, onkoloji ilaçları gibi özel tedaviler.',
    'need',
    'SYSTEM',
    '[
        {"field": "hasSMAPatient", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: SMA hastası ilaç bekliyor - hayati"},
        {"field": "hasCancerPatient", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Kanser hastası tedavi bekliyor"}
    ]'::jsonb,
    'special-med',
    '#8A2BE2',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 6. GIYIM (CLOTHING) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'kiyafet',
    'Kıyafet',
    'Genel giyim ihtiyacı. Çocuk, yetişkin, yaşlı kıyafetleri. Kışlık giyim öncelikli.',
    'need',
    'SYSTEM',
    '[
        {"field": "quantity", "operator": ">", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Büyük kıyafet ihtiyacı (>200)"},
        {"field": "winterSeason", "operator": "==", "value": true, "setUrgency": "high", "message": "YÜKSEK: Kış ayında kıyafet hayati"}
    ]'::jsonb,
    'checkroom',
    '#4682B4',
    NOW(), NOW(), 1
),
(
    'ic-camasiri',
    'İç Çamaşırı',
    'Kadın ve erkek iç çamaşırı ihtiyacı. Özellikle kadın iç çamaşırı kritik.',
    'need',
    'SYSTEM',
    '[
        {"field": "womenCount", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Kadın iç çamaşırı ihtiyacı (>50)"}
    ]'::jsonb,
    'underwear',
    '#DB7093',
    NOW(), NOW(), 1
),
(
    'ayakkabi',
    'Ayakkabı/Bot/Çizme',
    'Çocuk ve yetişkin ayakkabı, bot, çizme ihtiyacı. Kış koşullarında kritik.',
    'need',
    'SYSTEM',
    '[
        {"field": "childCount", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Çocuk ayakkabı ihtiyacı (>50)"}
    ]'::jsonb,
    'shoe',
    '#8B7355',
    NOW(), NOW(), 1
),
(
    'mont',
    'Mont/Kaban/Eşofman',
    'Kışlık mont, kaban, eşofman gibi dış giyim ihtiyacı.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'coat',
    '#696969',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 7. BEBEK ve COCUK (BABY & CHILD) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'bebek-bezi',
    'Bebek Bezi',
    'Bebek bezi ihtiyacı. 0-24 ay arası bebekler için.',
    'need',
    'SYSTEM',
    '[
        {"field": "babyCount", "operator": ">", "value": 30, "setUrgency": "critical", "message": "KRİTİK: Çok sayıda bebek bez bekliyor (>30)"},
        {"field": "babyCount", "operator": ">", "value": 10, "setUrgency": "high", "message": "YÜKSEK: Bebek bezi ihtiyacı (>10)"}
    ]'::jsonb,
    'baby-diaper',
    '#FFC0CB',
    NOW(), NOW(), 1
),
(
    'cocuk-bezi',
    'Çocuk Bezi',
    'Tuvalet eğitimini tamamlamamış çocuklar için bez.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'child-diaper',
    '#FFD1DC',
    NOW(), NOW(), 1
),
(
    'pisik-kremi',
    'Pişik Kremi/Bebek Bakım',
    'Pişik kremi, bebek losyonu, bebek şampuanı gibi bebek bakım ürünleri.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'baby-care',
    '#FFB6C1',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 8. HİJYEN ve TEMİZLİK (HYGIENE & CLEANING) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'hijyenik-ped',
    'Hijyenik Ped/Kadın Sağlığı',
    'Kadın hijyenik ped ihtiyacı. Acil durum kadın sağlığı ürünleri.',
    'need',
    'SYSTEM',
    '[
        {"field": "womenCount", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Kadın hijyenik ped ihtiyacı (>50)"}
    ]'::jsonb,
    'feminine-care',
    '#C71585',
    NOW(), NOW(), 1
),
(
    'hasta-bezi',
    'Yetişkin Bezi/Hasta Bezi',
    'Yatalak, engelli ve yaşlı hastalar için yetişkin bezi.',
    'need',
    'SYSTEM',
    '[
        {"field": "bedriddenCount", "operator": ">", "value": 5, "setUrgency": "critical", "message": "KRİTİK: Birden fazla yatalak hasta bezi bekliyor (>5)"},
        {"field": "bedriddenCount", "operator": ">", "value": 1, "setUrgency": "high", "message": "YÜKSEK: Yatalak hasta bezi gerekli"}
    ]'::jsonb,
    'adult-diaper',
    '#D8BFD8',
    NOW(), NOW(), 1
),
(
    'temizlik-malzemesi',
    'Temizlik Malzemesi',
    'Deterjan, çamaşır suyu, sabun, hijyen malzemeleri.',
    'need',
    'SYSTEM',
    '[
        {"field": "population", "operator": ">", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Kalabalık nüfus temizlik malzemesi bekliyor (>200)"}
    ]'::jsonb,
    'cleaning',
    '#20B2AA',
    NOW(), NOW(), 1
),
(
    'hijyen-kiti',
    'Hijyen Kiti',
    'Kişisel hijyen kiti. Diş fırçası, macun, ıslak mendil, tuvalet kağıdı vb.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'hygiene-kit',
    '#7FFFD4',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 9. HAYVAN YEMİ (ANIMAL FEED) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'hayvan-yemi',
    'Hayvan Yemi',
    'Büyükbaş ve küçükbaş hayvanlar için genel yem ihtiyacı.',
    'need',
    'SYSTEM',
    '[
        {"field": "animalCount", "operator": ">", "value": 500, "setUrgency": "critical", "message": "KRİTİK: Çok sayıda hayvan yem bekliyor (>500)"},
        {"field": "animalCount", "operator": ">", "value": 100, "setUrgency": "high", "message": "YÜKSEK: Büyük hayvan yemi ihtiyacı (>100)"},
        {"field": "animalCount", "operator": ">", "value": 30, "setUrgency": "medium", "message": "ORTA: Hayvan yemi desteği gerekli (>30)"}
    ]'::jsonb,
    'hayvan-yemi',
    '#8FBC8F',
    NOW(), NOW(), 1
),
(
    'arpa-kepek',
    'Arpa/Kepek/Süt Yemi',
    'Hayvanlar için arpa, kepek, süt yemi, besi yemi, saman gibi özel yem türleri.',
    'need',
    'SYSTEM',
    '[
        {"field": "animalCount", "operator": ">", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Büyük özel yem ihtiyacı (>200 hayvan)"}
    ]'::jsonb,
    'grain-feed',
    '#6B8E23',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 10. ELEKTRİK ve ENERJİ (ELECTRICAL & ENERGY) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'elektrik',
    'Elektrik',
    'Elektrik altyapı ihtiyacı. Elektrik kesintisi, trafo hasarı, jeneratör desteği.',
    'need',
    'SYSTEM',
    '[
        {"field": "noElectricity", "operator": "==", "value": true, "setUrgency": "high", "message": "YÜKSEK: Elektrik kesintisi var"},
        {"field": "affectedHouseholds", "operator": ">", "value": 100, "setUrgency": "critical", "message": "KRİTİK: Çok sayıda hane elektriksiz (>100)"}
    ]'::jsonb,
    'electricity',
    '#FFD700',
    NOW(), NOW(), 1
),
(
    'jenerator',
    'Jeneratör',
    'Acil durum jeneratörü ihtiyacı. Elektrik kesintilerinde yaşam desteği.',
    'need',
    'SYSTEM',
    '[
        {"field": "hasMedicalEquipment", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Tıbbi cihazlar için jeneratör hayati"},
        {"field": "quantity", "operator": ">", "value": 3, "setUrgency": "high", "message": "YÜKSEK: Birden fazla jeneratör gerekli (>3)"}
    ]'::jsonb,
    'generator',
    '#FFA500',
    NOW(), NOW(), 1
),
(
    'aydinlatma',
    'Aydınlatma (Powerbank/El Feneri/Mum)',
    'Taşınabilir aydınlatma araçları. Powerbank, el feneri, mum, fener.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'flashlight',
    '#FFFF00',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 11. ULAŞIM ve LOJİSTİK (TRANSPORT & LOGISTICS) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'nakit-para',
    'Nakit Para',
    'Acil nakit para ihtiyacı. Temel ihtiyaçlar için finansal destek.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'cash',
    '#228B22',
    NOW(), NOW(), 1
),
(
    'hasar-tespit',
    'Hasar Tespit Ekibi',
    'Bina hasar tespit ekibi ihtiyacı. Güvenlik değerlendirmesi.',
    'need',
    'SYSTEM',
    '[
        {"field": "buildingCount", "operator": ">", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Çok sayıda bina hasar tespit bekliyor (>50)"}
    ]'::jsonb,
    'inspection',
    '#FF6347',
    NOW(), NOW(), 1
),
(
    'kece-vinc',
    'Kepçe/Vinç',
    'Enkaz kaldırma, bina yıkımı için ağır iş makinaları.',
    'need',
    'SYSTEM',
    '[
        {"field": "hasDangerousBuilding", "operator": "==", "value": true, "setUrgency": "critical", "message": "KRİTİK: Tehlikeli bina vinç bekliyor"}
    ]'::jsonb,
    'construction',
    '#FF8C00',
    NOW(), NOW(), 1
),
(
    'ambulans',
    'Ambulans/Sağlık Aracı',
    'Acil ambulans ve sağlık aracı ihtiyacı.',
    'need',
    'SYSTEM',
    '[
        {"field": "injuredCount", "operator": ">", "value": 1, "setUrgency": "critical", "message": "KRİTİK: Yaralı için ambulans gerekli"}
    ]'::jsonb,
    'ambulance',
    '#FF0000',
    NOW(), NOW(), 1
);

-- ============================================================================
-- 12. ÖZEL İHTİYAÇLAR (SPECIAL NEEDS) ARCHETYPES
-- ============================================================================

INSERT INTO needs_archetypes (id, name, description, category, source, urgency_rules, icon, color, created_at, updated_at, version) VALUES
(
    'plastik-esya',
    'Plastik Tabak/Çatal/Kaşık',
    'Tek kullanımlik plastik sofra malzemeleri. Tabak, çatal, kaşık, bıçak.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'tableware',
    '#E6E6FA',
    NOW(), NOW(), 1
),
(
    'corega',
    'Corega/Protez Yapıştırıcısı',
    'Yaşlılar için protez diş yapıştırıcısı (Corega vb.).',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'dental',
    '#F0F8FF',
    NOW(), NOW(), 1
),
(
    'hali-mat',
    'Halı/Mat/Sünger Yatak',
    'Çadır içi zemin örtüsü. Halı, mat, sünger yatak.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'floor',
    '#F5F5DC',
    NOW(), NOW(), 1
),
(
    'tasiyici-havlu',
    'Havlu/Banyo Malzemesi',
    'Banyo havlusu, el havlusu ve banyo malzemeleri.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'towel',
    '#E0FFFF',
    NOW(), NOW(), 1
),
(
    'mezar-malzemesi',
    'Mezar Malzemesi (Kefen/Mezar Taşı)',
    'Vefat edenler için kefen, mezar taşı, tahta kalem, boya, pirket.',
    'need',
    'SYSTEM',
    '[
        {"field": "deathCount", "operator": ">", "value": 1, "setUrgency": "high", "message": "YÜKSEK: Vefat eden için mezar malzemesi gerekli"}
    ]'::jsonb,
    'memorial',
    '#708090',
    NOW(), NOW(), 1
),
(
    'iletisim',
    'İletişim Desteği',
    'İletişim sorunu yaşayan bölgeler için iletişim altyapısı.',
    'need',
    'SYSTEM',
    '[]'::jsonb,
    'signal',
    '#778899',
    NOW(), NOW(), 1
);

-- ============================================================================
-- VERIFICATION: Total needs archetypes inserted
-- ============================================================================
-- Run this query to verify:
-- SELECT COUNT(*) FROM needs_archetypes WHERE source = 'SYSTEM';
-- Expected: 42 archetypes (12 original + 30 new from CSV analysis)
-- ============================================================================
