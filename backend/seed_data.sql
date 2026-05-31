-- ============================================================================
-- DİRMS Seed Data Script (PostgreSQL)
-- Afet Bilgi ve Kaynak Yönetim Sistemi - Referans Veri Betiği
-- ============================================================================

-- ============================================================================
-- 1. KURULUŞLAR (Entities)
-- Frontend türleri backend enumlarına eşlendi:
--   STK → NGO, Üniversite → University, Şirket → Company,
--   Hükumet → Government, Medya → Media
-- ============================================================================

INSERT INTO entities (id, name, type, logo_url, description, website, created_at, updated_at) VALUES
('ent-1', 'Türk Kızılayı', 'NGO',
 'https://www.kliksoft.net/wp-content/uploads/logo-turk-kizilay.png',
 'Türkiye''nin en büyük sivil toplum kuruluşu olarak afet yardımları ve insani yardım faaliyetleri yürütmektedir.',
 'https://www.kizilay.org.tr',
 '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),

('ent-2', 'İstanbul Teknik Üniversitesi', 'UNIVERSITY',
 'https://www.itu.edu.tr/Sitefinity/WebsiteTemplates/ITUTemplate/App_Themes/ITUTemplate/lib/img/itu-logo-white.png',
 'Afet araştırmaları ve koordinasyonu alanında lider teknik üniversite.',
 'https://www.itu.edu.tr',
 '2024-02-20T00:00:00Z', '2024-02-20T00:00:00Z'),

('ent-3', 'AKUT Arama Kurtarma Derneği', 'NGO',
 'http://www.akut.org.tr/images/AKUT-logo-400x400.png',
 'Türkiye''nin önde gelen arama kurtarma sivil toplum kuruluşu.',
 'https://www.akut.org.tr',
 '2024-04-05T00:00:00Z', '2024-04-05T00:00:00Z'),

('ent-4', 'Boğaziçi Üniversitesi', 'UNIVERSITY',
 'https://mediastore.cc.bogazici.edu.tr/web/upload/sayfalar/776-bogazici-university-corporate-logos-20250522-175905_755x440.jpg',
 'Afet çalışmaları ve sürdürülebilirlik araştırmalarıyla öne çıkan köklü üniversite.',
 'https://www.boun.edu.tr',
 '2024-05-10T00:00:00Z', '2024-05-10T00:00:00Z');

-- ============================================================================
-- 2. ÇALIŞANLAR (Employees)
-- ============================================================================

INSERT INTO employees (id, full_name, email, entity_id, role, enabled, created_at, last_login_at) VALUES
-- Türk Kızılayı
('emp-1', 'Ayşe Yılmaz', 'ayse.yilmaz@kizilay.org.tr', 'ent-1', 'ADMIN', true, '2024-01-15T00:00:00Z', '2024-04-15T10:30:00Z'),
('emp-2', 'Mehmet Kaya', 'mehmet.kaya@kizilay.org.tr', 'ent-1', 'USER', true, '2024-01-20T00:00:00Z', '2024-04-14T14:20:00Z'),
('emp-3', 'Fatma Demir', 'fatma.demir@kizilay.org.tr', 'ent-1', 'USER', false, '2024-02-01T00:00:00Z', '2024-03-10T09:15:00Z'),

-- İTÜ
('emp-4', 'Prof. Dr. Ahmet Şahin', 'sahin@itu.edu.tr', 'ent-2', 'ADMIN', true, '2024-02-20T00:00:00Z', '2024-04-19T08:45:00Z'),
('emp-5', 'Dr. Zeynep Özdemir', 'ozdemir@itu.edu.tr', 'ent-2', 'USER', true, '2024-02-25T00:00:00Z', '2024-04-18T16:30:00Z'),
('emp-6', 'Burak Yıldız', 'yildiz@itu.edu.tr', 'ent-2', 'USER', true, '2024-03-01T00:00:00Z', '2024-04-17T11:20:00Z'),

-- AKUT
('emp-10', 'Ali Veli', 'ali.veli@akut.org.tr', 'ent-3', 'ADMIN', true, '2024-04-05T00:00:00Z', '2024-04-19T09:00:00Z'),
('emp-11', 'Elif Çelik', 'elif.celik@akut.org.tr', 'ent-3', 'USER', true, '2024-04-10T00:00:00Z', '2024-04-18T14:15:00Z'),

-- Boğaziçi Üniversitesi
('emp-12', 'Prof. Dr. Cemal Bilgin', 'bilgin@boun.edu.tr', 'ent-4', 'ADMIN', true, '2024-05-10T00:00:00Z', '2024-04-19T10:30:00Z'),
('emp-13', 'Dr. Eda Sarı', 'sari@boun.edu.tr', 'ent-4', 'USER', true, '2024-05-15T00:00:00Z', '2024-04-18T16:45:00Z'),
('emp-14', 'Barış Tan', 'tan@boun.edu.tr', 'ent-4', 'USER', true, '2024-05-20T00:00:00Z', '2024-04-17T09:20:00Z');

-- ============================================================================
-- 3. OLAY ARKETİPLERİ (Incident Archetypes)
-- İnsan raporlarındaki kalıplardan oluşturuldu
-- ============================================================================

-- Genel İnsan Raporu Arketipi
INSERT INTO incident_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, implications,
    default_report_urgency, created_by, created_at, updated_at, version
) VALUES (
    'genel-insan-raporu',
    'Genel İnsan Raporu',
    'Demografi, altyapı durumu ve ihtiyaçları içeren standart köy/topluluk raporudur.',
    'incident',
    'SYSTEM',
    '[
        {"field": "binaHasar", "label": "Hasarlı Bina Sayısı", "type": "number", "required": false},
        {"field": "hayvanKayip", "label": "Telef Olan Hayvan Sayısı", "type": "number", "required": false},
        {"field": "yolDurumu", "label": "Yol Durumu", "type": "select", "required": false, "options": ["Açık", "Kapalı", "Kısmen Açık"]},
        {"field": "suErisim", "label": "Su Erişimi", "type": "boolean", "required": false, "defaultValue": true},
        {"field": "elektrikErisim", "label": "Elektrik Erişimi", "type": "boolean", "required": false, "defaultValue": true}
    ]'::jsonb,
    '[
        {"field": "binaHasar", "operator": ">", "value": 50, "setUrgency": "critical", "message": "KRİTİK: Toplu bina yıkımı (>50)"},
        {"field": "binaHasar", "operator": ">", "value": 20, "setUrgency": "high", "message": "YÜKSEK: Önemli bina hasarı (>20)"}
    ]'::jsonb,
    '{
        "needs": [
            {"label": "Barınma", "priority": 1, "defaultUrgency": "high"},
            {"label": "Gıda", "priority": 2, "defaultUrgency": "medium"}
        ],
        "demographics": [
            {"group": "adult", "count": 1}
        ],
        "status_counts": {"missing": 0, "injured": 0, "disabled": 0, "bedridden": 0}
    }'::jsonb,
    'MEDIUM',
    NULL,
    NOW(), NOW(), 1
);

-- Tıbbi Acil Durum Arketipi
INSERT INTO incident_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, implications,
    default_report_urgency, created_by, created_at, updated_at, version
) VALUES (
    'tibbi-acil-durum',
    'Tıbbi Acil Durum Raporu',
    'Kronik hastalığı olan ve ilaç veya tıbbi malzeme gerektiren kişileri içeren raporlar.',
    'incident',
    'SYSTEM',
    '[
        {"field": "kronikHastalikTipi", "label": "Kronik Hastalık Tipi", "type": "select", "required": true, "options": ["diyabet", "hipertansiyon", "astim", "kalp_hastaligi", "koah"]},
        {"field": "hastaSayisi", "label": "Hasta Sayısı", "type": "number", "required": true},
        {"field": "ilacIhtiyaci", "label": "Gerekli İlaç", "type": "text", "required": false},
        {"field": "kalanGunSayisi", "label": "Kalan İlaç Günü", "type": "number", "required": false}
    ]'::jsonb,
    '[
        {"field": "kalanGunSayisi", "operator": "<", "value": 1, "setUrgency": "critical", "message": "KRİTİK: İlaç tükendi"},
        {"field": "kalanGunSayisi", "operator": "<", "value": 3, "setUrgency": "high", "message": "YÜKSEK: İlaç kritik seviyede (<3 gün)"},
        {"field": "hastaSayisi", "operator": ">", "value": 10, "setUrgency": "high", "message": "YÜKSEK: Birden fazla hasta ilaç bekliyor (>10)"}
    ]'::jsonb,
    '{
        "needs": [
            {"label": "İlaç", "priority": 1, "defaultUrgency": "critical"}
        ],
        "chronic_diseases": [
            {"name": "Kronik Rahatsızlık", "severity": "high", "medicationNeeded": "Çeşitli"}
        ],
        "status_counts": {"missing": 0, "injured": 0, "disabled": 0, "bedridden": 0}
    }'::jsonb,
    'HIGH',
    NULL,
    NOW(), NOW(), 1
);

-- Engelli ve Yaşlı Bakım Arketipi
INSERT INTO incident_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, implications,
    default_report_urgency, created_by, created_at, updated_at, version
) VALUES (
    'engelli-yasli-bakim',
    'Engelli ve Yaşlı Bakım Raporu',
    'Özel bakım gerektiren engelli veya yatalak bireyleri içeren topluluk raporları.',
    'incident',
    'SYSTEM',
    '[
        {"field": "engelliSayisi", "label": "Engelli Birey Sayısı", "type": "number", "required": true},
        {"field": "yatalakSayisi", "label": "Yatalak Birey Sayısı", "type": "number", "required": true},
        {"field": "tekerlekliSandalyeGerekli", "label": "Tekerlekli Sandalye Gerekli", "type": "boolean", "required": false, "defaultValue": false},
        {"field": "yetiskinBeziGerekli", "label": "Yetişkin Bezi Gerekli", "type": "boolean", "required": false, "defaultValue": false},
        {"field": "konteynerGerekli", "label": "Konteyner Konut Gerekli", "type": "boolean", "required": false, "defaultValue": false}
    ]'::jsonb,
    '[
        {"field": "yatalakSayisi", "operator": ">", "value": 5, "setUrgency": "critical", "message": "KRİTİK: Birden fazla yatalak hasta acil bakım gerektiriyor"},
        {"field": "engelliSayisi", "operator": ">", "value": 10, "setUrgency": "high", "message": "YÜKSEK: Kalabalık engelli nüfus destek bekliyor"}
    ]'::jsonb,
    '{
        "needs": [
            {"label": "Sağlık", "priority": 1, "defaultUrgency": "high"},
            {"label": "Konteyner", "priority": 2, "defaultUrgency": "medium"}
        ],
        "demographics": [
            {"group": "elderly", "count": 1}
        ],
        "status_counts": {"missing": 0, "injured": 0, "disabled": 0, "bedridden": 0}
    }'::jsonb,
    'HIGH',
    NULL,
    NOW(), NOW(), 1
);

-- ============================================================================
-- 4. ENVANTER ARKETİPLERİ (Inventory Archetypes)
-- Frontend envanter örneklerinden oluşturuldu
-- ============================================================================

-- Su Şişeleri
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, created_by, created_at, updated_at, version
) VALUES (
    'su-siseleri',
    'Su Şişeleri',
    'Afet dağıtımı için şişelenmiş içme suyu.',
    'food',
    'SYSTEM',
    '[
        {"field": "hacimLitre", "label": "Şişe Hacmi (L)", "type": "number", "required": false, "defaultValue": 1},
        {"field": "sonKullanmaTarihi", "label": "Son Kullanma Tarihi", "type": "text", "required": false}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 100, "setUrgency": "high", "message": "YÜKSEK: Su stoğu kritik seviyede"}
    ]'::jsonb,
    '["Su"]',
    '["genel"]',
    'şişe',
    NULL, NOW(), NOW(), 1
);

-- İlk Yardım Kitleri
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, created_by, created_at, updated_at, version
) VALUES (
    'ilk-yardim-kitleri',
    'İlk Yardım Kitleri',
    'Temel tıbbi malzemelerle donatılmış acil ilk yardım çantaları.',
    'medical',
    'SYSTEM',
    '[
        {"field": "kitTipi", "label": "Kit Tipi", "type": "select", "required": false, "options": ["Temel", "Gelişmiş", "Travma"]},
        {"field": "sonKullanmaTarihi", "label": "Son Kullanma Tarihi", "type": "text", "required": false}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 20, "setUrgency": "critical", "message": "KRİTİK: İlk yardım kitleri neredeyse tükendi"}
    ]'::jsonb,
    '["Sağlık"]',
    '["genel"]',
    'kit',
    NULL, NOW(), NOW(), 1
);

-- Bebek Battaniyeleri
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, physical_properties, created_by, created_at, updated_at, version
) VALUES (
    'bebek-battaniyeleri',
    'Bebek Battaniyeleri',
    'Bebekler ve küçük çocuklar için uygun sıcak battaniyeler.',
    'food',
    'SYSTEM',
    '[
        {"field": "beden", "label": "Beden", "type": "select", "required": false, "options": ["Yeni Doğan", "0-6 ay", "6-12 ay"]},
        {"field": "malzeme", "label": "Malzeme", "type": "text", "required": false}
    ]'::jsonb,
    '[]'::jsonb,
    '["Battaniye", "Giyim"]',
    '["bebek"]',
    'adet',
    '{"bozulabilir": false, "agirlikKg": 0.3}'::jsonb,
    NULL, NOW(), NOW(), 1
);

-- Gıda Rasyonları
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, physical_properties, created_by, created_at, updated_at, version
) VALUES (
    'gida-rasyonlari',
    'Gıda Rasyonları',
    'Afet yardımı için acil gıda rasyon paketleri.',
    'food',
    'SYSTEM',
    '[
        {"field": "rasyonTipi", "label": "Rasyon Tipi", "type": "select", "required": false, "options": ["Kuru Gıda", "Konserve", "Hazır Yemek"]},
        {"field": "sonKullanmaTarihi", "label": "Son Kullanma Tarihi", "type": "text", "required": false},
        {"field": "porsiyonSayisi", "label": "Paket Başına Porsiyon", "type": "number", "required": false, "defaultValue": 1}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 200, "setUrgency": "high", "message": "YÜKSEK: Gıda rasyonları azalıyor"}
    ]'::jsonb,
    '["Gıda"]',
    '["genel"]',
    'paket',
    '{"bozulabilir": false, "rafOmruGun": 365}'::jsonb,
    NULL, NOW(), NOW(), 1
);

-- Bebek Maması
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, food_properties, physical_properties, created_by, created_at, updated_at, version
) VALUES (
    'bebek-mamasi',
    'Bebek Maması',
    'Bebek formülü ve bebek gıda ürünleri.',
    'food',
    'SYSTEM',
    '[
        {"field": "marka", "label": "Marka", "type": "select", "required": false, "options": ["Çicibebe", "Bebelac", "Hero Baby", "Diğer"]},
        {"field": "yasAraligi", "label": "Yaş Aralığı", "type": "select", "required": false, "options": ["0-3 ay", "3-6 ay", "6-12 ay", "12+ ay"]},
        {"field": "sonKullanmaTarihi", "label": "Son Kullanma Tarihi", "type": "text", "required": true}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 50, "setUrgency": "critical", "message": "KRİTİK: Bebek maması kritik seviyede"},
        {"field": "sonKullanmaTarihi", "operator": "<", "value": 30, "setUrgency": "high", "message": "YÜKSEK: Mama 30 gün içinde sona eriyor"}
    ]'::jsonb,
    '["Gıda"]',
    '["bebek"]',
    'kutu',
    '{"tip": "formula", "uygunGrup": ["bebek"], "minAy": 0, "hazirlikGerekli": true}'::jsonb,
    '{"bozulabilir": true, "rafOmruGun": 730, "sogutmaGerekli": false}'::jsonb,
    NULL, NOW(), NOW(), 1
);

-- Kadın Hijyen Kitleri
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, created_by, created_at, updated_at, version
) VALUES (
    'kadin-hijyen-kitleri',
    'Kadın Hijyen Kitleri',
    'Acil durumlar için özel olarak tasarlanmış kadın hijyen kitleri.',
    'medical',
    'SYSTEM',
    '[
        {"field": "kitIcerigi", "label": "Kit İçeriği", "type": "text", "required": false}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 50, "setUrgency": "high", "message": "YÜKSEK: Kadın hijyen kitleri azalıyor"}
    ]'::jsonb,
    '["Sağlık", "Giyim"]',
    '["kadın"]',
    'kit',
    NULL, NOW(), NOW(), 1
);

-- Yaşlı Bakım Malzemeleri
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, created_by, created_at, updated_at, version
) VALUES (
    'yasli-bakim-malzemeleri',
    'Yaşlı Bakım Malzemeleri',
    'Yetişkin bezi, hareketlilik yardımları vb. yaşlılar için bakım malzemeleri.',
    'medical',
    'SYSTEM',
    '[
        {"field": "malzemeTipi", "label": "Malzeme Tipi", "type": "select", "required": false, "options": ["Yetişkin Bezi", "Hareketlilik Yardımları", "Bakım Kitleri", "Diğer"]},
        {"field": "sonKullanmaTarihi", "label": "Son Kullanma Tarihi", "type": "text", "required": false}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 30, "setUrgency": "high", "message": "YÜKSEK: Yaşlı bakım malzemeleri azalıyor"}
    ]'::jsonb,
    '["Sağlık", "Barınma"]',
    '["yaşlı"]',
    'kit',
    NULL, NOW(), NOW(), 1
);

-- Acil Durum Jeneratörleri
INSERT INTO inventory_archetypes (
    id, name, description, category, source,
    field_schema, urgency_rules, resolves_needs, target_demographics,
    quantity_unit, physical_properties, created_by, created_at, updated_at, version
) VALUES (
    'acil-durum-jeneratorleri',
    'Acil Durum Jeneratörleri',
    'Elektrik kesintileri için taşınabilir acil durum jeneratörleri.',
    'medical',
    'SYSTEM',
    '[
        {"field": "gucCikisi", "label": "Güç Çıkışı (kW)", "type": "number", "required": false},
        {"field": "yakitTipi", "label": "Yakıt Tipi", "type": "select", "required": false, "options": ["Dizel", "Benzin", "Propan"]},
        {"field": "calismaSaati", "label": "Çalışma Saati", "type": "number", "required": false}
    ]'::jsonb,
    '[
        {"field": "quantity", "operator": "<", "value": 5, "setUrgency": "critical", "message": "KRİTİK: Çok az jeneratör mevcut"}
    ]'::jsonb,
    '["Elektrik", "Barınma"]',
    '["genel"]',
    'adet',
    '{"agirlikKg": 50, "hacimLitre": 100}'::jsonb,
    NULL, NOW(), NOW(), 1
);

-- ============================================================================
-- 5. ENVANTER KAYITLARI (Inventory Items)
-- Frontend envanter verileri arketip tabanlı backend şemasına eşlendi
-- archetype_values JSONB alanı frontend'e özgü alanları saklar
-- ============================================================================

INSERT INTO inventory (
    id, archetype_id, quantity, location_lat, location_lng,
    location_address, status, archetype_values, created_at, updated_at
) VALUES
-- inv-1: Su Şişeleri
('inv-1', 'su-siseleri', 500,
 37.7645, 38.6432,
 'Adıyaman, Kahta, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Su"], "grup": "genel", "orijinal_ad": "Su Şişeleri"}'::jsonb,
 NOW(), NOW()),

-- inv-2: İlk Yardım Kitleri
('inv-2', 'ilk-yardim-kitleri', 120,
 37.8238, 37.5415,
 'Adıyaman, Gölbaşı, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Sağlık"], "grup": "genel", "orijinal_ad": "İlk Yardım Kitleri"}'::jsonb,
 NOW(), NOW()),

-- inv-3: Bebek Battaniyeleri
('inv-3', 'bebek-battaniyeleri', 300,
 37.7645, 38.6432,
 'Adıyaman, Kahta, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Battaniye", "Giyim"], "grup": "bebek", "orijinal_ad": "Bebek Battaniyeleri"}'::jsonb,
 NOW(), NOW()),

-- inv-4: Gıda Rasyonları
('inv-4', 'gida-rasyonlari', 800,
 37.8238, 37.5415,
 'Adıyaman, Gölbaşı, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Gıda"], "grup": "genel", "orijinal_ad": "Gıda Rasyonları"}'::jsonb,
 NOW(), NOW()),

-- inv-5: Bebek Maması
('inv-5', 'bebek-mamasi', 150,
 37.7645, 38.6432,
 'Adıyaman, Kahta, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Gıda"], "grup": "bebek", "orijinal_ad": "Bebek Maması"}'::jsonb,
 NOW(), NOW()),

-- inv-6: Kadın Hijyen Kitleri
('inv-6', 'kadin-hijyen-kitleri', 200,
 37.8238, 37.5415,
 'Adıyaman, Gölbaşı, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Sağlık", "Giyim"], "grup": "kadın", "orijinal_ad": "Kadın Hijyen Kitleri"}'::jsonb,
 NOW(), NOW()),

-- inv-7: Yaşlı Bakım Malzemeleri
('inv-7', 'yasli-bakim-malzemeleri', 100,
 37.7645, 38.6432,
 'Adıyaman, Kahta, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Sağlık", "Barınma"], "grup": "yaşlı", "orijinal_ad": "Yaşlı Bakım Malzemeleri"}'::jsonb,
 NOW(), NOW()),

-- inv-8: Acil Durum Jeneratörleri
('inv-8', 'acil-durum-jeneratorleri', 15,
 37.8238, 37.5415,
 'Adıyaman, Gölbaşı, Depo Merkezi',
 'AVAILABLE',
 '{"cozer": ["Elektrik", "Barınma"], "grup": "genel", "orijinal_ad": "Acil Durum Jeneratörleri"}'::jsonb,
 NOW(), NOW());
