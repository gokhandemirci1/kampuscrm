# Admin Dashboard

Modern bir admin dashboard uygulaması. Python FastAPI backend ve React frontend ile geliştirilmiştir.

## Özellikler

- **Kullanıcı Yönetimi**: Role-based access control ile detaylı yetkilendirme
- **Müşteri Yönetimi**: Müşteri ekleme, silme ve listeleme
- **Finansal Veriler**: Günlük, haftalık, aylık ve yıllık ciro takibi
- **İş Birliği Kodları**: Kod oluşturma ve yönetimi
- **İstatistikler**: Kod bazlı müşteri sayısı ve gelir analizi

## Teknolojiler

### Backend
- Python 3.9+
- FastAPI
- SQLAlchemy
- SQLite (geliştirme)
- JWT Authentication

### Frontend
- React 18
- React Router
- Tailwind CSS
- Recharts (grafikler)
- Axios

## Kurulum

### Yerel Geliştirme

1. Repository'yi klonlayın:
```bash
git clone <repository-url>
cd adminnnn
```

2. Backend bağımlılıklarını yükleyin:
```bash
cd api
pip install -r requirements.txt
```

3. Frontend bağımlılıklarını yükleyin:
```bash
npm install
```

4. Backend'i başlatın:
```bash
cd api
uvicorn main:app --reload
```

5. Frontend'i başlatın (yeni terminal):
```bash
npm run dev
```

## Vercel Deployment

### Ön Gereksinimler

1. Vercel hesabı oluşturun
2. Vercel CLI'yi yükleyin:
```bash
npm install -g vercel
```

### Deployment Adımları

1. Projeyi Vercel'e bağlayın:
```bash
vercel
```

2. Ortam değişkenlerini ayarlayın (Vercel Dashboard):
   - `SECRET_KEY`: JWT için gizli anahtar (güçlü bir değer kullanın)
   - `DATABASE_URL`: Production database URL (Vercel Postgres kullanabilirsiniz)

3. İlk deployment'dan sonra database'i başlatmak için:
   - Vercel Functions Logs'dan veya API endpoint'lerinden birini çağırarak database'in oluşturulmasını tetikleyin

## Varsayılan Kullanıcılar

Sistem ilk başlatıldığında aşağıdaki kullanıcılar otomatik olarak oluşturulur:

| E-posta | Şifre | Yetkiler |
|---------|-------|----------|
| gokhan@kampus.com | QWQD$(u~p3 | Tüm yetkiler |
| emre@kampus.com | Fco6hgVch2 | Tüm yetkiler |
| irem-kanbay@kampus.com | E6sD47(X[% | Müşteri yönetimi |
| emre-unal@kampus.com | TGFFqCaY]K | Finansal veriler, İş birliği kodları |
| gokce-demirci@kampus.com | gK5iU\|KZBw | Erişim yönetimi |
| burcu-akbas@kampus.com | 2!1q@<y$nf | Dashboard erişimi |
| bilal-acar@kampus.com | &!wtByzkHG | İş birliği istatistikleri |

## API Endpoints

- `POST /api/login` - Kullanıcı girişi
- `GET /api/me` - Kullanıcı bilgileri
- `GET /api/customers` - Müşteri listesi
- `POST /api/customers` - Yeni müşteri ekle
- `DELETE /api/customers/{id}` - Müşteri sil
- `GET /api/financials` - Finansal veriler
- `GET /api/partnership-codes` - İş birliği kodları
- `POST /api/partnership-codes` - Yeni kod ekle
- `GET /api/partnership-stats` - İş birliği istatistikleri
- `GET /api/users` - Kullanıcı listesi
- `POST /api/users` - Yeni kullanıcı ekle
- `PUT /api/users/{id}` - Kullanıcı güncelle
- `DELETE /api/users/{id}` - Kullanıcı sil

## Güvenlik Notları

- Production'da mutlaka güçlü bir `SECRET_KEY` kullanın
- Database şifrelerini ve hassas bilgileri environment variables'da saklayın
- HTTPS kullanın
- Rate limiting ekleyin
- SQL injection ve XSS saldırılarına karşı koruma sağlanmıştır

## Lisans

Bu proje özel kullanım içindir.

