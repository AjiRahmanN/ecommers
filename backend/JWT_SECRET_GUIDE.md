# JWT_SECRET Configuration Guide

## Apa itu JWT_SECRET?

JWT_SECRET adalah kunci rahasia yang digunakan untuk menandatangani (sign) dan memverifikasi token JWT (JSON Web Token) dalam aplikasi ini. Token JWT digunakan untuk autentikasi pengguna dan proteksi endpoint API.

## Cara JWT_SECRET Digunakan

1. **Login**: Saat user login, server membuat token JWT yang ditandatangani dengan JWT_SECRET
2. **Autentikasi**: Setiap request ke endpoint yang dilindungi harus menyertakan token JWT
3. **Verifikasi**: Server memverifikasi token menggunakan JWT_SECRET yang sama

## Cara Mendapatkan JWT_SECRET

### Metode 1: Generate dengan Command Line

```bash
# Gunakan Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Atau gunakan OpenSSL
openssl rand -base64 64
```

### Metode 2: Generate dengan Online Tool

- Gunakan https://jwtsecret.com/generate
- Atau https://randomkeygen.com/

### Metode 3: Untuk Production (Recommended)

- AWS Secrets Manager
- AWS Parameter Store
- Environment variable di deployment platform

## Contoh JWT_SECRET yang Aman

```
JWT_SECRET=your-super-secure-random-string-here-at-least-32-characters-long
```

## Cara Menggunakan di Project

### 1. Local Development

Tambahkan ke file `.env`:

```
JWT_SECRET=your-generated-secret-key-here
```

### 2. Docker Compose

Sudah dikonfigurasi di `docker-compose.yml` dengan fallback:

```yaml
JWT_SECRET=${JWT_SECRET:-your-secret-key-here}
```

### 3. Production Deployment

Gunakan environment variable di platform deployment:

- **Vercel**: Settings > Environment Variables
- **AWS ECS**: Task Definition > Environment
- **Docker**: docker run -e JWT_SECRET=your-secret

## Security Best Practices

1. **Panjang minimal**: 32 karakter
2. **Gunakan karakter acak**: kombinasi huruf, angka, dan simbol
3. **Jangan share**: Jangan commit ke repository
4. **Rotate regularly**: Ganti setiap 3-6 bulan
5. **Gunakan secrets management**: Untuk production

## Testing JWT_SECRET

Untuk test apakah JWT_SECRET bekerja:

1. Register user baru
2. Login dengan user tersebut
3. Akses endpoint yang membutuhkan autentikasi
4. Verifikasi token di response header

## Contoh Implementasi di Code

```javascript
// Generate token
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
