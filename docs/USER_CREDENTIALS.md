# Usuarios del Sistema - Restaurant Management System

## Usuarios Demo (Por Defecto)

| ID | Usuario | Email | Contraseña | Rol |
|----|---------|-------|------------|-----|
| usr_001 | admin | admin@restaurant.com | admin123 | admin |
| usr_003 | waiter | waiter@restaurant.com | waiter123 | waiter |
| usr_004 | chef | chef@restaurant.com | chef123 | chef |
| usr_005 | cashier | cashier@restaurant.com | cashier123 | cashier |

**Patrón de contraseñas demo:** `{rol}123`

---

## Puntos Importantes para el Equipo de Base de Datos

### 1. Estructura de Usuarios
- **ID formato:** `usr_` + timestamp en base 36 + random (ej: `usr_lxk5m8a2`)
- **Campos requeridos:** `id`, `username`, `email`, `password`, `role`, `createdAt`

### 2. Roles Válidos
```
admin    → Administrator (acceso total)
waiter   → Waiter (toma ordenes, mesas, estado de reservas)
chef     → Chef (gestion de cocina)
cashier  → Cashier (procesar pagos)
```

### 3. Restricciones de Integridad
- **Username único:** No se permite duplicar nombres de usuario
- **Email único:** No se permite duplicar correos electrónicos
- **Admin mínimo:** Siempre debe existir al menos 1 usuario con rol `admin` (no se puede eliminar el último admin)
- **Contraseña:** Mínimo 6 caracteres en el registro

### 4. Campos de Auditoría
```javascript
{
  id: string,          // Identificador único generado
  username: string,    // Nombre de usuario único
  email: string,       // Correo único
  password: string,    // Contraseña (en BD real: HASHEAR, nunca en texto plano)
  role: enum,          // admin | waiter | chef | cashier
  createdAt: ISO8601   // Fecha de creación
}
```

### 5. Recomendaciones para Producción
- ⚠️ **NUNCA** guardar contraseñas en texto plano → usar bcrypt/argon2
- Implementar rate limiting en endpoint de login
- Agregar campo `updatedAt` para auditoría
- Considerar agregar campo `isActive` para deshabilitar usuarios
- Los usuarios demo son solo para desarrollo (localStorage)

### 6. Endpoints API Esperados
```
POST /auth/login        → { username, password } → { success, user }
POST /auth/register     → { username, email, password, role }
GET  /auth/users        → Lista de usuarios (sin passwords)
PUT  /auth/users/:id    → Actualizar usuario
DELETE /auth/users/:id  → Eliminar usuario (no el último admin)
```

### 7. Notas de Seguridad
- La contraseña nunca se retorna en las respuestas API
- La sesión solo guarda datos del usuario (sin password)
- Implementar tokens JWT para autenticación en producción
