-- =============================================================
-- Decha Agency — örnek içerik (0001_init.sql çalıştırıldıktan sonra)
-- Tekrar çalıştırılabilir: slug çakışmalarında güncelleme yapar.
-- =============================================================

insert into public.services (slug, title, summary, icon, features, price_from, order_no) values
('web-tasarim', 'Web Tasarım & Geliştirme', 'Hızlı, erişilebilir ve dönüşüm odaklı kurumsal siteler, e-ticaret ve web uygulamaları.', 'layout', '["UI/UX tasarım","React & Next.js","Headless CMS","Core Web Vitals optimizasyonu"]', 45000, 1),
('marka-kimligi', 'Marka Kimliği', 'Logo, tipografi, renk sistemi ve kullanım kılavuzuyla tutarlı bir marka dili kurgularız.', 'sparkles', '["Logo & amblem","Marka kılavuzu","Sosyal medya kiti","Basılı materyal"]', 28000, 2),
('dijital-pazarlama', 'Dijital Pazarlama', 'Performans pazarlaması, SEO ve içerik stratejisiyle ölçülebilir büyüme sağlarız.', 'trending', '["Google & Meta Ads","Teknik SEO","İçerik stratejisi","Analitik & raporlama"]', 18000, 3),
('mobil-uygulama', 'Mobil Uygulama', 'iOS ve Android için tek kod tabanıyla native hisli, ölçeklenebilir mobil ürünler.', 'phone', '["React Native","App Store & Play yayını","Push bildirim","Analitik entegrasyonu"]', 90000, 4),
('urun-stratejisi', 'Ürün Stratejisi', 'Fikirden MVP''ye; kullanıcı araştırması, yol haritası ve prototipleme süreçleri.', 'compass', '["Kullanıcı araştırması","Bilgi mimarisi","Prototip","Yol haritası"]', 22000, 5),
('bakim-destek', 'Bakım & Destek', 'Yayına aldığınız ürünün güvenliği, hızı ve sürekliliği için aylık destek paketleri.', 'shield', '["7/24 izleme","Güvenlik güncellemeleri","Yedekleme","SLA garantisi"]', 7500, 6)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, icon = excluded.icon,
  features = excluded.features, price_from = excluded.price_from, order_no = excluded.order_no;

insert into public.projects (slug, title, client, category, year, summary, description, cover_url, tags, metrics, featured, order_no) values
('nova-finance', 'Nova Finance', 'Nova Bank', 'Web Uygulaması', 2025, 'Bireysel yatırımcılar için portföy takip paneli.', 'Nova Bank için gerçek zamanlı portföy takibi, risk analizi ve raporlama sunan bir web uygulaması tasarladık ve geliştirdik. Kullanıcıların ortalama oturum süresi %62 arttı.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', '["React","Supabase","Design System"]', '[{"label":"Oturum süresi","value":"+%62"},{"label":"Dönüşüm","value":"+%38"}]', true, 1),
('atlas-travel', 'Atlas Travel', 'Atlas Turizm', 'E-Ticaret', 2025, 'Tur rezervasyon platformu ve mobil deneyim.', 'Atlas Turizm''in rezervasyon akışını baştan kurguladık. Ödeme adımlarını 5''ten 2''ye indirerek sepet terk oranını ciddi biçimde düşürdük.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', '["E-Ticaret","UX","Ödeme Entegrasyonu"]', '[{"label":"Sepet terk","value":"-%41"},{"label":"Mobil satış","value":"+%77"}]', true, 2),
('verde-organics', 'Verde Organics', 'Verde', 'Marka Kimliği', 2024, 'Organik gıda markası için uçtan uca kimlik.', 'Logo, ambalaj, tipografi ve dijital varlıkları kapsayan bütünsel bir marka kimliği geliştirdik. Marka bilinirliği ilk 6 ayda iki katına çıktı.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', '["Branding","Ambalaj","Art Direction"]', '[{"label":"Bilinirlik","value":"2x"},{"label":"Raf satışı","value":"+%54"}]', true, 3),
('pulse-health', 'Pulse Health', 'Pulse', 'Mobil Uygulama', 2024, 'Kronik hasta takibi için mobil uygulama.', 'Hastaların ilaç ve ölçüm takibini kolaylaştıran, hekimle veri paylaşımı sağlayan bir mobil uygulama geliştirdik.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80', '["React Native","Sağlık","KVKK"]', '[{"label":"Günlük aktif","value":"18K"},{"label":"Uygulama puanı","value":"4.8"}]', false, 4),
('kite-saas', 'Kite SaaS', 'Kite', 'Web Uygulaması', 2024, 'B2B ekipler için proje yönetim aracı.', 'Sıfırdan tasarım sistemi kurarak Kite''ın ürününü yeniden inşa ettik; yeni kullanıcı aktivasyonu belirgin şekilde arttı.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', '["SaaS","Design System","B2B"]', '[{"label":"Aktivasyon","value":"+%45"},{"label":"Destek talebi","value":"-%30"}]', false, 5),
('orbit-studio', 'Orbit Studio', 'Orbit', 'Kurumsal Web', 2023, 'Mimarlık ofisi için portfolyo sitesi.', 'Görsel ağırlıklı projeleri öne çıkaran, hızlı ve sade bir kurumsal site tasarladık.', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80', '["Kurumsal","CMS","SEO"]', '[{"label":"Organik trafik","value":"+%120"},{"label":"LCP","value":"1.1s"}]', false, 6)
on conflict (slug) do update set
  title = excluded.title, client = excluded.client, category = excluded.category,
  year = excluded.year, summary = excluded.summary, description = excluded.description,
  cover_url = excluded.cover_url, tags = excluded.tags, metrics = excluded.metrics,
  featured = excluded.featured, order_no = excluded.order_no;

insert into public.posts (slug, title, excerpt, content, cover_url, category, author, published_at) values
('web-sitesi-hizi-neden-onemli', 'Web Sitesi Hızı Neden Dönüşümün En Sessiz Katili?', 'Sayfa yükleme süresindeki her 100 ms gecikmenin satışa etkisini ve pratik optimizasyon adımlarını anlatıyoruz.', E'Kullanıcılar yavaş siteleri terk eder. Core Web Vitals metrikleri (LCP, INP, CLS) yalnızca SEO için değil, doğrudan gelir için de belirleyicidir.\n\nGörselleri modern formatlara çevirmek, kritik olmayan JavaScript''i ertelemek ve sunucu tarafında önbellek kullanmak ilk üç adımdır. Ardından üçüncü parti scriptleri gözden geçirin.\n\nSon olarak ölçün. Gerçek kullanıcı verisi (RUM) olmadan yapılan optimizasyon tahminden ibarettir.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', 'Performans', 'Decha Ekibi', '2026-05-14'),
('tasarim-sistemi-kurmak', 'Küçük Ekipler İçin Tasarım Sistemi Kurma Rehberi', 'Bir tasarım sistemine ne zaman ihtiyaç duyulur, nereden başlanır ve nasıl sürdürülür?', E'Tasarım sistemi bir bileşen kütüphanesinden ibaret değildir; ortak bir dildir. Renk, tipografi ve boşluk ölçeğiyle başlayın.\n\nToken''ları önce anlamsal olarak isimlendirin. Böylece marka değiştiğinde bileşenlere dokunmanız gerekmez.\n\nDokümantasyonu koda yakın tutun. Kullanılmayan bir sistem, olmayan bir sistemdir.', 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80', 'Tasarım', 'Decha Ekibi', '2026-04-02'),
('supabase-ile-hizli-mvp', 'Supabase ile 2 Haftada MVP Çıkarmak', 'Kimlik doğrulama, veritabanı ve dosya depolamayı tek çatı altında toplayarak nasıl hız kazandık?', E'Supabase, Postgres üzerine kurulu açık kaynak bir backend platformu. Row Level Security sayesinde yetkilendirmeyi veritabanı seviyesinde tanımlayabiliyorsunuz.\n\nMVP aşamasında en büyük kazanç, ayrı bir API katmanı yazmadan doğrudan istemciden güvenli sorgu yapabilmek.\n\nYine de tablo tasarımını ve RLS politikalarını ilk günden doğru kurun.', 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=1200&q=80', 'Geliştirme', 'Decha Ekibi', '2026-02-20')
on conflict (slug) do update set
  title = excluded.title, excerpt = excluded.excerpt, content = excluded.content,
  cover_url = excluded.cover_url, category = excluded.category, published_at = excluded.published_at;

insert into public.testimonials (name, role, company, quote, avatar_url, rating, order_no)
select * from (values
  ('Elif Demir', 'Pazarlama Direktörü', 'Nova Bank', 'Decha ile çalışmak bir ajansla değil, kendi ekibimizin bir parçasıyla çalışmak gibiydi. Sonuçlar hedeflerimizin üzerinde geldi.', 'https://i.pravatar.cc/120?img=47', 5::smallint, 1),
  ('Mert Kaya', 'Kurucu Ortak', 'Kite', 'Ürünümüzü baştan kurguladılar. Tasarım sistemi sayesinde artık yeni özellikleri günler içinde çıkarabiliyoruz.', 'https://i.pravatar.cc/120?img=12', 5::smallint, 2),
  ('Selin Aydın', 'E-Ticaret Müdürü', 'Atlas Turizm', 'Rezervasyon akışındaki iyileştirmeler ilk ayda kendini amorti etti. Süreç boyunca iletişim çok şeffaftı.', 'https://i.pravatar.cc/120?img=32', 5::smallint, 3)
) as t(name, role, company, quote, avatar_url, rating, order_no)
where not exists (select 1 from public.testimonials);
