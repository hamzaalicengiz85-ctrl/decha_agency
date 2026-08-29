-- ---------------------------------------------------------------------------
-- Decha Agency — eski siteden kalan tabloların kaldırılması
-- ---------------------------------------------------------------------------
-- decha_content ve decha_settings, bu repodaki React uygulamasından önceki
-- sürümden kalmıştı. Yeni uygulama bunlara hiç dokunmuyor; kod tabanında tek
-- bir referansları yok. İçerik artık services / projects / posts / testimonials
-- tablolarından geliyor.
--
-- decha_settings ayrıca adminPass ve EmailJS anahtarlarını (serviceId,
-- templateId, publicKey) düz metin olarak tutuyordu. Tabloyu düşürmek bu
-- değerleri de veritabanından siler; hâlâ ihtiyacınız varsa DÜŞÜRMEDEN ÖNCE
-- yedekleyin.
--
-- Bilerek CASCADE kullanılmadı: beklenmedik bir bağımlılık varsa göç sessizce
-- başka nesneleri silmek yerine hata versin.
-- ---------------------------------------------------------------------------

drop table if exists public.decha_settings;
drop table if exists public.decha_content;
