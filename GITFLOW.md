# 🌊 GitFlow Workflow

Este proyecto utiliza **GitFlow** como estrategia de branching para mantener un desarrollo ordenado y profesional.

## 📋 Estructura de Ramas

```
main (producción)
  ↑
develop (integración)
  ↑
feature/* (nuevas características)
hotfix/* (correcciones urgentes)
release/* (preparación de releases)
```

## 🌿 Ramas Principales

### `main`
- **Propósito**: Código en producción
- **Estado**: Siempre estable y desplegable
- **Protección**: Solo recibe merges desde `develop` o `hotfix/*`

### `develop`
- **Propósito**: Rama de integración para desarrollo
- **Estado**: Última versión de desarrollo
- **Protección**: Recibe merges desde `feature/*`

## 🔀 Ramas de Soporte

### `feature/*`
- **Propósito**: Desarrollo de nuevas funcionalidades
- **Nombrado**: `feature/nombre-descriptivo`
- **Origen**: `develop`
- **Destino**: `develop`

### `hotfix/*`
- **Propósito**: Correcciones urgentes en producción
- **Nombrado**: `hotfix/descripcion-del-bug`
- **Origen**: `main`
- **Destino**: `main` y `develop`

### `release/*`
- **Propósito**: Preparación de una nueva versión
- **Nombrado**: `release/v1.0.0`
- **Origen**: `develop`
- **Destino**: `main` y `develop`

---

## 🚀 Flujos de Trabajo

### 1️⃣ Desarrollar una Nueva Característica

```bash
# 1. Asegurarse de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crear rama feature
git checkout -b feature/nombre-de-la-caracteristica

# 3. Desarrollar y hacer commits
git add .
git commit -m "feat: descripción del cambio"

# 4. Probar la funcionalidad
npm test  # Si hay tests
npm start # Verificar que funciona

# 5. Volver a develop
git checkout develop

# 6. Merge con --no-ff (mantener historial)
git merge --no-ff feature/nombre-de-la-caracteristica -m "merge: feature/nombre-de-la-caracteristica into develop"

# 7. Eliminar rama feature
git branch -d feature/nombre-de-la-caracteristica

# 8. Subir a remoto (si existe)
git push origin develop
```

### 2️⃣ Corrección Urgente (Hotfix)

```bash
# 1. Crear hotfix desde main
git checkout main
git checkout -b hotfix/descripcion-del-bug

# 2. Corregir el bug
# ... hacer cambios ...

# 3. Commit
git commit -m "fix: corrección del bug XYZ"

# 4. Merge a main
git checkout main
git merge --no-ff hotfix/descripcion-del-bug

# 5. Tag de versión
git tag -a v1.0.1 -m "Hotfix: descripción"

# 6. Merge a develop también
git checkout develop
git merge --no-ff hotfix/descripcion-del-bug

# 7. Eliminar hotfix branch
git branch -d hotfix/descripcion-del-bug

# 8. Push todo
git push origin main develop --tags
```

### 3️⃣ Preparar Release

```bash
# 1. Crear release desde develop
git checkout develop
git checkout -b release/v1.0.0

# 2. Actualizar versión en package.json
npm version 1.0.0 --no-git-tag-version

# 3. Commit de versión
git commit -am "chore: bump version to 1.0.0"

# 4. Merge a main
git checkout main
git merge --no-ff release/v1.0.0

# 5. Tag de versión
git tag -a v1.0.0 -m "Release v1.0.0"

# 6. Merge de vuelta a develop
git checkout develop
git merge --no-ff release/v1.0.0

# 7. Eliminar release branch
git branch -d release/v1.0.0

# 8. Push todo
git push origin main develop --tags
```

---

## 📝 Convenciones de Commits

Seguimos **Conventional Commits**:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Tipos de Commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, espacios, etc. (no afecta código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento
- `ci`: Cambios en CI/CD
- `build`: Cambios en sistema de build

### Ejemplos

```bash
git commit -m "feat(auth): add JWT refresh token functionality"
git commit -m "fix(cart): resolve item duplication bug"
git commit -m "docs: update API documentation for products endpoint"
git commit -m "refactor(user): simplify user validation logic"
git commit -m "chore: update dependencies"
```

---

## 🎯 Nomenclatura de Ramas

### Features
```
feature/user-authentication
feature/product-search
feature/payment-integration
feature/email-notifications
```

### Hotfixes
```
hotfix/cart-calculation-error
hotfix/login-timeout-issue
hotfix/security-vulnerability
```

### Releases
```
release/v1.0.0
release/v1.1.0
release/v2.0.0-beta
```

---

## 🔄 Workflow Completo (Ejemplo)

### Escenario: Añadir Sistema de Cupones

```bash
# 1. Crear feature branch
git checkout develop
git checkout -b feature/coupon-system

# 2. Crear modelo de Coupon
# Editar: src/models/Coupon.js
git add src/models/Coupon.js
git commit -m "feat(coupon): add Coupon model with validation"

# 3. Crear controlador
# Editar: src/controllers/couponController.js
git add src/controllers/couponController.js
git commit -m "feat(coupon): add CRUD operations controller"

# 4. Crear rutas
# Editar: src/routes/couponRoutes.js
git add src/routes/couponRoutes.js
git commit -m "feat(coupon): add API routes for coupon management"

# 5. Integrar con órdenes
# Editar: src/controllers/orderController.js
git add src/controllers/orderController.js
git commit -m "feat(coupon): integrate coupon discount in order creation"

# 6. Añadir validadores
# Editar: src/utils/validators.js
git add src/utils/validators.js
git commit -m "feat(coupon): add input validation for coupons"

# 7. Actualizar documentación
# Editar: README.md
git add README.md
git commit -m "docs: add coupon system documentation"

# 8. Probar funcionalidad
npm start
# ... hacer pruebas manuales ...

# 9. Merge a develop
git checkout develop
git merge --no-ff feature/coupon-system -m "merge: feature/coupon-system into develop

Implementación completa del sistema de cupones de descuento:
- Modelo Coupon con validaciones
- CRUD completo de cupones (solo admin)
- Integración con proceso de checkout
- Validación de cupones activos y vigentes
- Aplicación automática de descuentos"

# 10. Eliminar feature branch
git branch -d feature/coupon-system

# 11. Push (si hay remoto)
git push origin develop
```

---

## 📊 Visualización del Historial

```bash
# Ver historial en formato gráfico
git log --oneline --graph --all

# Ver solo últimos 10 commits
git log --oneline --graph --all -10

# Ver branches
git branch -a

# Ver tags
git tag -l
```

---

## ✅ Checklist Antes de Merge

- [ ] Código probado localmente
- [ ] Sin errores de linting
- [ ] Commits con mensajes descriptivos
- [ ] Documentación actualizada
- [ ] Variables de entorno documentadas en .env.example
- [ ] Sin credenciales hardcodeadas
- [ ] README actualizado si es necesario

---

## 🚫 Qué NO Hacer

❌ Hacer commits directamente en `main`
❌ Hacer commits directamente en `develop`
❌ Usar fast-forward merge (usar `--no-ff`)
❌ Dejar ramas feature sin eliminar
❌ Commits genéricos ("fix", "update", etc.)
❌ Mezclar múltiples funcionalidades en una feature
❌ Push de archivos .env con credenciales

---

## 🎓 Comandos Útiles

```bash
# Ver en qué rama estás
git branch

# Ver diferencias antes de commit
git diff

# Ver estado de archivos
git status

# Deshacer cambios no commiteados
git checkout -- <file>

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Ver historial de un archivo
git log --follow <file>

# Crear tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Listar tags
git tag -l

# Ver cambios de un commit
git show <commit-hash>
```

---

## 🔗 Referencias

- [GitFlow Original](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## 📞 Dudas

Si tienes dudas sobre qué tipo de rama usar:

- **¿Es una nueva funcionalidad?** → `feature/*`
- **¿Es un bug en producción?** → `hotfix/*`
- **¿Vamos a hacer release?** → `release/*`
- **¿Es documentación?** → `feature/docs-*`
- **¿Es refactorización?** → `feature/refactor-*`

