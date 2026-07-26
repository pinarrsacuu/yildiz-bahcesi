-- Örnek veri (yerel/test ortamında Studio'da hemen bir şeyler görmek için)

insert into venue_content (section_key, title, body) values
  ('anasayfa', 'Yıldız Bahçesi', 'Bursa''nın şehir karmaşasından uzak, yemyeşil saklı bahçesi.'),
  ('biz_kimiz', 'Biz Kimiz', 'Bursa Nilüfer''de butik organizasyonlar düzenliyoruz.'),
  ('neler_yapiyoruz', 'Neler Yapıyoruz', 'Doğum günü, nişan, küçük ölçekli düğün ve baby shower organizasyonları.')
on conflict (section_key) do nothing;

insert into packages (category, title, description, price_info, display_order) values
  ('paket', 'Doğum Günü Paketi', 'Balon süsleme, pasta masası ve fotoğraf köşesi dahil temel paket.', 'Kişi başı fiyatlandırma, detay için iletişime geçin', 1),
  ('paket', 'Baby Shower Paketi', 'Pastel tema süsleme ve ikram masası dahil paket.', 'Kişi başı fiyatlandırma, detay için iletişime geçin', 2),
  ('menu', 'Standart İkram Menüsü', 'Sıcak/soğuk içecek, tuzlu-tatlı atıştırmalık seçenekleri.', null, 1)
on conflict do nothing;

-- Not: staff_users, events ve appointment_requests test kayıtları
-- gerçek bir Supabase Auth kullanıcısı oluşturulduktan sonra
-- Faz 1 test adımında Studio üzerinden elle eklenecek.
