# 🚀 Guía de Deployment en Vercel

## 🔍 Problema Actual: Swagger UI no carga

**URL:** https://e-commerce-backend-two-green.vercel.app/api-docs/

**Estado:** ❌ No carga correctamente

---

## ✅ Corrección Aplicada (v1.0.2)

Se han añadido los archivos necesarios para Vercel:

- ✅ `vercel.json` - Configuración de build
- ✅ `.vercelignore` - Archivos a excluir
- ✅ `src/server.js` - Middleware optimizado

**Los cambios ya están en GitHub** (main branch, tag v1.0.2)

---

## 🔄 Paso 1: Hacer Redeploy en Vercel

### Opción A - Redeploy desde Dashboard

1. Ir a **Vercel Dashboard:** https://vercel.com/dashboard

2. Seleccionar el proyecto **eCommerceBackend**

3. Click en la tab **"Deployments"**

4. En el deployment más reciente, click en los **3 puntos (...)** → **"Redeploy"**

5. Esperar a que termine el deploy (1-2 minutos)

### Opción B - Redeploy desde Git

1. Hacer un commit vacío para forzar redeploy:
```bash
git commit --allow-empty -m "chore: trigger Vercel redeploy"
git push origin main
```

2. Vercel detectará el push y hará redeploy automáticamente

---

## 🔐 Paso 2: Verificar Variables de Entorno

**Ir a:** Settings → Environment Variables

Asegurarse de tener configuradas:

```env
MONGODB_URI=mongodb+srv://mongodb_user:8KGrkanPKw6eP7kg@cluster0.p5abetu.mongodb.net/ecommerce-multitenant?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=c38d31ea083d514fc8137c4f8ece57a93d506db968064eb7b6d32e32625e2d1310b1314f5e1e4a0e6eaaae13bde9d44f7c4303e336b163e3036ff9baf033b716

NODE_ENV=production

JWT_EXPIRES_IN=7d

CORS_ORIGIN=*
```

**⚠️ IMPORTANTE:**
- Cada variable debe estar en **Production**, **Preview** y **Development**
- Click en "Save" después de agregar cada una

---

## 🧪 Paso 3: Verificar Deployment

Después del redeploy, probar estos endpoints:

### 1. Health Check (debe responder)
```bash
curl https://e-commerce-backend-two-green.vercel.app/health
```

**Esperado:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

### 2. Swagger JSON (debe funcionar)
```bash
curl https://e-commerce-backend-two-green.vercel.app/api-docs.json
```

**Esperado:** JSON con la especificación OpenAPI

### 3. Swagger UI (puede tener problemas en serverless)
```
https://e-commerce-backend-two-green.vercel.app/api-docs/
```

### 4. Test de API
```bash
curl -X POST https://e-commerce-backend-two-green.vercel.app/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Vercel",
    "slug": "test-vercel"
  }'
```

---

## ⚠️ Si Swagger UI aún NO funciona en Vercel

Swagger UI tiene limitaciones conocidas en plataformas serverless porque sirve archivos estáticos (CSS, JS).

### Alternativa 1: Usar Swagger Editor Online ✅ (Recomendado)

1. Obtener el JSON:
```bash
curl https://e-commerce-backend-two-green.vercel.app/api-docs.json > swagger.json
```

2. Ir a: https://editor.swagger.io/

3. Click en **File** → **Import file**

4. Seleccionar `swagger.json`

5. ¡Listo! Tendrás la documentación interactiva

---

### Alternativa 2: Deshabilitar Swagger en Producción

Si solo quieres Swagger en desarrollo, modifica `src/server.js`:

```javascript
// Solo habilitar Swagger en desarrollo
if (config.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));
}

// JSON spec siempre disponible
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

---

### Alternativa 3: Usar Scalar UI (Más compatible) ⭐

Scalar es una alternativa moderna a Swagger UI que funciona mejor en serverless.

**1. Instalar:**
```bash
npm install @scalar/express-api-reference
```

**2. En `src/server.js`, reemplazar Swagger por Scalar:**

```javascript
const { apiReference } = require('@scalar/express-api-reference');

// Reemplazar la sección de Swagger con:
app.use(
  '/api-docs',
  apiReference({
    spec: {
      url: '/api-docs.json',
    },
    theme: 'purple',
    darkMode: true,
  }),
);

// Mantener el JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
```

**3. Commit y push:**
```bash
git add .
git commit -m "feat: replace Swagger UI with Scalar for better Vercel compatibility"
git push origin main
```

Scalar es más moderno, más rápido y funciona perfectamente en Vercel.

---

## 📊 Logs de Vercel

Para ver errores en tiempo real:

1. Ir al dashboard de Vercel

2. Click en el deployment actual

3. Tab **"Logs"** o **"Functions"**

4. Buscar errores relacionados con `/api-docs`

---

## 🎯 Checklist de Deployment

- [ ] Variables de entorno configuradas en Vercel
- [ ] Redeploy realizado después del push
- [ ] `/health` responde correctamente
- [ ] `/api-docs.json` retorna JSON
- [ ] Endpoints de API funcionan
- [ ] `/api-docs/` carga (o usar alternativa)

---

## 💡 Recomendaciones

### Para Producción:

1. **Usar `/api-docs.json` + Swagger Editor**
   - Más ligero y rápido
   - No consume recursos de Vercel
   - Siempre disponible

2. **O cambiar a Scalar**
   - Diseñado para serverless
   - Mejor rendimiento
   - UI más moderna

3. **O deshabilitar Swagger UI en producción**
   - Solo disponible en desarrollo
   - Documentación en README.md y API-EXAMPLES.md

---

## 📞 Soporte

Si después de seguir estos pasos Swagger aún no funciona:

1. Verificar logs de Vercel
2. Probar `/api-docs.json` (debe funcionar)
3. Usar Swagger Editor online con el JSON
4. Considerar alternativa Scalar

---

## 🔗 Enlaces Útiles

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Swagger Editor:** https://editor.swagger.io/
- **Scalar Docs:** https://github.com/scalar/scalar
- **Vercel Docs:** https://vercel.com/docs

---

## ✅ Estado Actual

- ✅ Código v1.0.2 en GitHub
- ✅ vercel.json creado
- ✅ Configuración optimizada
- ⏳ Esperando redeploy en Vercel
- ✅ Documentación actualizada

