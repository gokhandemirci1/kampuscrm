# Vercel Deployment Guide

## Ön Gereksinimler

1. Vercel hesabı oluşturun: https://vercel.com
2. Vercel CLI'yi yükleyin:
   ```bash
   npm install -g vercel
   ```

## Deployment Adımları

### 1. Projeyi Hazırlama

Projenin root dizininde olduğunuzdan emin olun.

### 2. Vercel'e Deploy Etme

#### Yöntem 1: Vercel CLI ile

```bash
# Vercel'e giriş yapın
vercel login

# Projeyi deploy edin
vercel

# Production'a deploy edin
vercel --prod
```

#### Yöntem 2: GitHub Entegrasyonu ile

1. Projeyi GitHub'a push edin
2. Vercel Dashboard'a gidin: https://vercel.com/dashboard
3. "Add New Project" butonuna tıklayın
4. GitHub repository'nizi seçin
5. Vercel otomatik olarak projeyi tanıyacaktır

### 3. Environment Variables Ayarlama

Vercel Dashboard'da veya CLI ile environment variables ekleyin:

```bash
vercel env add SECRET_KEY
# Güçlü bir secret key girin (örn: openssl rand -hex 32)

vercel env add DATABASE_URL
# Production database URL'inizi girin (örn: Vercel Postgres)
```

**Önemli Environment Variables:**
- `SECRET_KEY`: JWT token'ları için gizli anahtar (mutlaka güçlü bir değer kullanın)
- `DATABASE_URL`: Production database URL (SQLite yerine PostgreSQL önerilir)

### 4. Production Database Kurulumu

Vercel Postgres kullanmak için:

1. Vercel Dashboard'da projenize gidin
2. "Storage" sekmesine tıklayın
3. "Create Database" > "Postgres" seçin
4. Database'inizi oluşturun
5. Connection string'i `DATABASE_URL` environment variable olarak ekleyin

### 5. Database Initialization

İlk deployment'dan sonra database'i başlatmak için:

1. Vercel Dashboard > Functions Logs'a gidin
2. Herhangi bir API endpoint'ini çağırın (örn: `/api/`)
3. Database otomatik olarak başlatılacaktır

Veya manuel olarak:

```bash
# Local'de database'i başlatmak için
cd api
python -c "from database import init_db; init_db()"
```

### 6. Build Ayarları

Vercel otomatik olarak şunları yapacaktır:
- Frontend: `npm run build` komutunu çalıştırır
- Backend: Python bağımlılıklarını yükler (`requirements.txt`)

## Sorun Giderme

### API çalışmıyor

1. Vercel Dashboard > Functions Logs'u kontrol edin
2. Environment variables'ın doğru ayarlandığından emin olun
3. API routes'ların doğru çalıştığını kontrol edin

### Database bağlantı hatası

1. `DATABASE_URL` environment variable'ın doğru ayarlandığından emin olun
2. Production'da SQLite yerine PostgreSQL kullanın
3. Vercel Postgres kullanıyorsanız connection string'i kontrol edin

### Frontend build hatası

1. `package.json` ve `vite.config.js` dosyalarını kontrol edin
2. Vercel build logs'u inceleyin
3. `build` klasörünün oluşturulduğundan emin olun

## Post-Deployment Checklist

- [ ] Environment variables ayarlandı
- [ ] Database bağlantısı test edildi
- [ ] API endpoints çalışıyor
- [ ] Frontend düzgün görüntüleniyor
- [ ] Login işlemi çalışıyor
- [ ] Yetkilendirme doğru çalışıyor
- [ ] SSL sertifikası aktif (otomatik)

## Domain Ayarlama

Vercel otomatik olarak bir domain verir. Özel domain eklemek için:

1. Vercel Dashboard > Project Settings > Domains
2. Domain'inizi ekleyin
3. DNS kayıtlarını yapılandırın

## Güncellemeler

Kodunuzu güncelledikten sonra:

```bash
git add .
git commit -m "Update"
git push

# Vercel otomatik olarak yeniden deploy edecektir
```

veya

```bash
vercel --prod
```

