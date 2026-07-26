-- Misafirlerin giriş yapmadan QR bağlantısıyla fotoğraflarını görebilmesi için
-- event-photos bucket'ını "public" yapıyoruz. Güvenlik, dosya yollarının
-- tahmin edilemeyecek kadar rastgele olmasına ve get_event_photos(token)
-- fonksiyonunun sadece doğru/geçerli token ile bu yolları döndürmesine dayanır.
update storage.buckets set public = true where id = 'event-photos';
