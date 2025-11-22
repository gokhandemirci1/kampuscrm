# Giriş Sorunları Debug Rehberi

## Hızlı Çözüm Adımları

### 1. Database'in Başlatıldığını Kontrol Edin

Health endpoint'ini test edin:
```
GET /api/health
```

Bu endpoint size şunları gösterecek:
- Database bağlantısı durumu
- Toplam kullanıcı sayısı
- Mevcut kullanıcıların listesi

### 2. Test Login Endpoint'ini Kullanın

Login sorunlarını debug etmek için:
```
POST /api/test-login
Body: {
  "email": "gokhan@kampus.com",
  "password": "QWQD$(u~p3"
}
```

### 3. Kullanıcı Bilgileri

Varsayılan kullanıcılar:
- **Email:** `gokhan@kampus.com`
- **Şifre:** `QWQD$(u~p3`

- **Email:** `emre@kampus.com`
- **Şifre:** `Fco6hgVch2`

### 4. Local Development Test

```bash
# Backend'i başlatın
cd api
python -m uvicorn main:app --reload --port 8000

# Yeni terminal'de test edin
curl http://localhost:8000/api/health
```

### 5. Vercel Deployment'ta Test

1. Vercel Dashboard > Functions Logs'u kontrol edin
2. `/api/health` endpoint'ini çağırın
3. Database'in başlatıldığından emin olun

### 6. Yaygın Sorunlar

#### Sorun: "User not found"
**Çözüm:** Database henüz başlatılmamış. İlk API çağrısı database'i başlatacaktır.

#### Sorun: "Incorrect email or password"
**Kontrol:**
- Email doğru mu? (büyük/küçük harf duyarlı değil ama doğru format olmalı)
- Şifre doğru mu? (özel karakterler dahil)
- Database'de kullanıcı var mı? (`/api/health` ile kontrol edin)

#### Sorun: "Sunucuya bağlanılamadı"
**Kontrol:**
- API URL'i doğru mu?
- CORS sorunu var mı?
- Backend çalışıyor mu?

### 7. Browser Console Kontrolleri

1. F12 ile Developer Tools'u açın
2. Console tab'ına gidin
3. Network tab'ında login isteğini kontrol edin:
   - Status code nedir?
   - Response nedir?
   - Request headers doğru mu?

### 8. Manuel Database Başlatma

Eğer database başlatılmamışsa:

```python
# Python terminal'de
from api.database import init_db
init_db()
```

veya

```bash
cd api
python -c "from database import init_db; init_db()"
```

### 9. Password Hash Kontrolü

Şifre hash'inin doğru olduğunu test etmek için:

```python
from api.auth import get_password_hash, verify_password

# Hash oluştur
hash = get_password_hash("QWQD$(u~p3")
print(f"Hash: {hash}")

# Doğrula
result = verify_password("QWQD$(u~p3", hash)
print(f"Verification result: {result}")
```

### 10. Detaylı Log Kontrolü

Backend loglarını kontrol edin:
- Local: Terminal'de çıktıları görebilirsiniz
- Vercel: Dashboard > Functions Logs

Login denemesi sırasında şu loglar görünmeli:
- `Login attempt for email: ...`
- `User found: ...` veya `User not found: ...`
- `Password verification result: ...`
- `Login successful for: ...` veya hata mesajı

