# Estructura del Repositorio

El proyecto **Restaurant Management System** adopta una estructura de monorepositorio (*monorepo*), en la que todos los componentes que conforman la solución se encuentran centralizados en un único repositorio Git. Esta organización permite administrar de forma unificada el código fuente, la documentación, la infraestructura y las herramientas de automatización, facilitando el trabajo colaborativo, el control de versiones y la integración continua.

La estructura está organizada siguiendo el principio de **separación de responsabilidades (Separation of Concerns)**, donde cada directorio cumple un propósito específico dentro de la arquitectura del sistema.

---

# Directorio `.github/`

Este directorio almacena la configuración de **GitHub Actions**, el servicio de Integración y Despliegue Continuo (CI/CD) utilizado por el proyecto.

Dentro de la carpeta **workflows/** se encuentran los flujos de automatización que permiten validar el código y ejecutar procesos de despliegue cada vez que se realizan cambios en el repositorio.

## `backend.yml`

Automatiza todas las tareas relacionadas con el backend, entre ellas:

- Instalación de dependencias.
- Verificación del código.
- Ejecución de pruebas unitarias.
- Validación de la construcción del proyecto.
- Preparación para el despliegue.

## `frontend.yml`

Gestiona el flujo de integración del frontend.

Entre sus responsabilidades se encuentran:

- Instalación de paquetes mediante npm.
- Compilación del proyecto Vite.
- Ejecución de verificaciones del código.
- Validación de la generación de la aplicación estática.

## `deploy.yml`

Centraliza el proceso de despliegue del sistema hacia el proveedor de infraestructura seleccionado.

Dependiendo del entorno, este flujo puede encargarse de:

- Construcción de imágenes Docker.
- Publicación de contenedores.
- Actualización de los servicios desplegados.
- Ejecución de tareas posteriores al despliegue.

---

# Directorio `backend/`

Este módulo contiene toda la implementación del servidor desarrollada utilizando **Python** y **FastAPI**.

Su responsabilidad principal consiste en exponer la API REST del sistema, aplicar las reglas de negocio y administrar el acceso a la base de datos.

La estructura interna está diseñada siguiendo una arquitectura por capas, desacoplando la lógica de presentación, negocio y persistencia.

---

## `app/`

Es el núcleo del backend.

Aquí se encuentra la totalidad del código fuente de la aplicación.

---

## `api/`

Implementa la capa de presentación de la API.

Su función consiste en recibir solicitudes HTTP provenientes del frontend, validar los datos recibidos y delegar el procesamiento hacia la capa de servicios.

No contiene lógica de negocio compleja.

### `v1/`

Agrupa los endpoints correspondientes a la primera versión de la API.

Cada archivo representa un módulo funcional independiente.

### [`auth.py`](http://auth.py)

Gestiona el proceso de autenticación y autorización.

Incluye funcionalidades como:

- Inicio de sesión.
- Cierre de sesión.
- Registro de usuarios.
- Generación de tokens JWT.
- Validación de credenciales.
- Control de permisos y roles.

---

### [`users.py`](http://users.py)

Gestiona toda la información relacionada con los usuarios del sistema.

Entre sus responsabilidades se encuentran:

- Consulta de usuarios.
- Creación de nuevos usuarios.
- Actualización de perfiles.
- Cambio de contraseñas.
- Asignación de roles.

---

### [`reservations.py`](http://reservations.py)

Implementa todas las operaciones relacionadas con las reservas.

Incluye:

- Registrar reservas.
- Consultar disponibilidad.
- Modificar reservas.
- Cancelar reservas.
- Confirmar reservas.
- Consultar historial.

---

### [`tables.py`](http://tables.py)

Administra las mesas del restaurante.

Permite:

- Crear mesas.
- Editar información.
- Cambiar estados.
- Consultar disponibilidad.
- Asignar mesas a reservas.

---

### [`menu.py`](http://menu.py)

Gestiona el menú ofrecido por el restaurante.

Permite administrar:

- Categorías.
- Productos.
- Disponibilidad.
- Precios.
- Descripciones.

---

### [`orders.py`](http://orders.py)

Implementa el procesamiento de pedidos.

Entre sus funciones se encuentran:

- Crear pedidos.
- Actualizar estados.
- Agregar productos.
- Eliminar productos.
- Consultar pedidos activos.
- Consultar historial.

---

### [`kitchen.py`](http://kitchen.py)

Administra el flujo operativo de cocina.

Incluye funcionalidades como:

- Recepción de pedidos.
- Cambio de estados.
- Priorización.
- Seguimiento de preparación.
- Notificación de pedidos listos.

---

### [`inventory.py`](http://inventory.py)

Gestiona el inventario del restaurante.

Permite:

- Registrar ingredientes.
- Actualizar existencias.
- Registrar movimientos.
- Controlar stock mínimo.
- Consultar disponibilidad.

---

### [`payments.py`](http://payments.py)

Administra el procesamiento de pagos.

Incluye:

- Registro de pagos.
- Consulta de transacciones.
- Estados de pago.
- Métodos de pago.
- Cierre de cuentas.

---

### [`reports.py`](http://reports.py)

Genera la información estadística del sistema.

Entre los reportes disponibles se incluyen:

- Ventas.
- Reservas.
- Inventario.
- Productos más vendidos.
- Ingresos.
- Desempeño operativo.

---

### [`router.py`](http://router.py)

Centraliza todas las rutas de la API.

Su objetivo es registrar cada módulo bajo un prefijo común, simplificando la configuración del servidor y permitiendo mantener una estructura organizada conforme el sistema crece.

---

# `core/`

Contiene la configuración global utilizada por toda la aplicación.

Los archivos de este módulo son utilizados transversalmente por todos los componentes del backend.

## [`config.py`](http://config.py)

Gestiona las variables de configuración del sistema.

Entre ellas:

- Variables de entorno.
- Configuración de PostgreSQL.
- Claves secretas.
- URLs de servicios.
- Parámetros generales.

---

## [`security.py`](http://security.py)

Implementa todas las funciones relacionadas con la seguridad.

Incluye:

- Hash de contraseñas.
- Generación de JWT.
- Verificación de tokens.
- Cifrado.
- Políticas de autenticación.

---

## [`dependencies.py`](http://dependencies.py)

Centraliza las dependencias reutilizables de FastAPI.

Permite compartir componentes como:

- Conexión a base de datos.
- Usuario autenticado.
- Validaciones.
- Control de permisos.

---

# `db/`

Implementa la capa de persistencia.

Toda la interacción con PostgreSQL se organiza dentro de este módulo.

---

## [`database.py`](http://database.py)

Inicializa la conexión con PostgreSQL.

Administra:

- Sesiones.
- Pool de conexiones.
- Configuración del ORM.

---

## `models/`

Contiene las entidades que representan las tablas de la base de datos.

Cada modelo describe:

- Columnas.
- Relaciones.
- Restricciones.
- Llaves primarias y foráneas.

---

## `schemas/`

Define los esquemas utilizados para validar los datos que ingresan y salen de la API.

Estos esquemas garantizan que toda la información cumpla con las reglas del negocio antes de ser procesada.

---

## `migrations/`

Almacena las migraciones de la base de datos.

Permite versionar los cambios del esquema sin perder consistencia entre los diferentes entornos.

---

# `services/`

Implementa la lógica de negocio.

Representa la capa donde se ejecutan las reglas funcionales del sistema.

Los servicios reciben solicitudes desde los endpoints y coordinan el trabajo entre repositorios, modelos y componentes auxiliares.

De esta manera, la lógica del negocio permanece desacoplada de la API.

---

# `repositories/`

Implementa el patrón Repository.

Su objetivo es encapsular todas las operaciones de acceso a datos.

Gracias a este patrón, los servicios no necesitan conocer cómo se realizan las consultas SQL ni interactuar directamente con el ORM.

Esto mejora la mantenibilidad y facilita la realización de pruebas unitarias.

---

# `utils/`

Agrupa funciones auxiliares reutilizadas por distintos módulos del backend.

Por ejemplo:

- Formateo de fechas.
- Validaciones comunes.
- Conversión de datos.
- Utilidades generales.

---

# [`main.py`](http://main.py)

Es el punto de entrada de la aplicación.

Aquí se crea la instancia de FastAPI y se registran:

- Rutas.
- Middleware.
- Configuración CORS.
- Eventos de inicio y cierre.
- Documentación automática.

---

# `tests/`

Contiene las pruebas automatizadas del backend.

Su finalidad es verificar el correcto funcionamiento de:

- Endpoints.
- Servicios.
- Repositorios.
- Reglas de negocio.
- Integraciones.

---

# `frontend/`

Este directorio contiene la aplicación cliente desarrollada como una **Single Page Application (SPA)** utilizando **Vite**.

Su responsabilidad es proporcionar la interfaz gráfica que utilizan los distintos actores del sistema para interactuar con la API.

La aplicación se comunica exclusivamente mediante solicitudes HTTP hacia el backend.

---

## `public/`

Contiene recursos públicos servidos directamente por el servidor web.

Generalmente incluye:

- favicon
- manifest
- imágenes estáticas
- archivos públicos

---

## `src/`

Contiene todo el código fuente del frontend.

Es el núcleo de la aplicación.

### `assets/`

Agrupa todos los recursos gráficos utilizados por la interfaz.

Se organiza en:

- icons/
- images/
- logos/
- illustrations/
- fonts/
- animations/

Esta separación facilita la reutilización de recursos visuales y mantiene una estructura ordenada.

---

### `components/`

Contiene componentes reutilizables de la interfaz.

Se clasifican según su propósito:

- **common/**: componentes compartidos por múltiples módulos.
- **layout/**: estructura visual de la aplicación (navbar, sidebar, footer, header).
- **forms/**: formularios reutilizables.
- **ui/**: componentes básicos de interfaz como botones, tablas, modales, tarjetas y campos de entrada.

Esta organización favorece la reutilización y evita la duplicación de código.

---

### `views/`

Cada carpeta representa una pantalla completa de la aplicación.

Cada vista agrupa los componentes, lógica y servicios asociados a un módulo funcional específico, como autenticación, reservas, mesas, pedidos, cocina, inventario, pagos, reportes y configuración.

Esta organización modular facilita el mantenimiento y permite escalar la aplicación incorporando nuevas funcionalidades sin afectar las existentes.

---

### `router/`

Define el sistema de navegación de la SPA.

Configura las rutas públicas y protegidas, la carga de vistas y los mecanismos de control de acceso según el rol del usuario.

---

### `services/`

Implementa la comunicación con el backend mediante solicitudes HTTP.

Centraliza las llamadas a la API, el manejo de respuestas y el tratamiento de errores.

---

### `store/`

Administra el estado global de la aplicación.

Permite compartir información entre diferentes componentes sin necesidad de propagar datos manualmente mediante propiedades.

---

### `utils/`

Contiene funciones auxiliares reutilizadas por el frontend.

---

### `styles/`

Agrupa los estilos globales, variables CSS, tipografías y temas visuales utilizados en toda la interfaz.

---

### `App.js`

Componente raíz de la aplicación.

Orquesta el montaje de las vistas y el funcionamiento general del frontend.

---

### `main.js`

Punto de entrada de Vite.

Inicializa la aplicación y monta el componente principal sobre el DOM.

---

# `database/`

Este directorio reúne los recursos relacionados con la administración de PostgreSQL.

Su contenido complementa al backend y facilita la preparación de distintos entornos.

- **init/**: scripts ejecutados durante la creación inicial de la base de datos.
- **seed/**: datos de prueba utilizados durante el desarrollo.
- **backups/**: respaldos y copias de seguridad.
- **Dockerfile**: definición del contenedor de PostgreSQL.

---

# `docs/`

Centraliza toda la documentación del proyecto.

Puede incluir:

- Documento de Visión.
- Especificación de Requerimientos.
- Documento de Arquitectura.
- Diagramas C4.
- Diagramas UML.
- Manuales técnicos.
- Manuales de usuario.
- ADR (Architecture Decision Records).

Mantener la documentación junto al código garantiza que ambas evolucionen de forma sincronizada.

---

# `scripts/`

Contiene scripts de automatización para facilitar tareas repetitivas durante el desarrollo.

- [**dev.sh**](http://dev.sh) inicia el entorno de desarrollo.
- [**build.sh**](http://build.sh) compila los componentes del sistema.
- [**deploy.sh**](http://deploy.sh) ejecuta el proceso de despliegue.

---

# Archivos raíz

## `.gitignore`

Define los archivos y directorios que no deben ser versionados por Git, como dependencias, archivos temporales y variables de entorno.

## `docker-compose.yml`

Orquesta los servicios que conforman el sistema, permitiendo iniciar el backend y la base de datos mediante un único comando.

## `LICENSE`

Especifica los términos de uso y distribución del proyecto.

## [`README.md`](http://README.md)

Documento principal del repositorio.

Proporciona información general sobre el sistema, instrucciones de instalación, configuración y ejecución.

## `.env.example`

Plantilla de variables de entorno necesarias para configurar el proyecto en diferentes ambientes sin exponer información sensible.

---

# Resumen arquitectónico

La organización del repositorio refleja la arquitectura lógica del sistema:

- El **backend** concentra la lógica de negocio, la exposición de servicios REST y la interacción con la base de datos.
- El **frontend** implementa la interfaz de usuario como una SPA modular y desacoplada del servidor.
- El directorio **database** contiene los recursos necesarios para inicializar y mantener PostgreSQL.
- **docs** reúne toda la documentación funcional y técnica del proyecto.
- **scripts** automatiza tareas comunes del ciclo de desarrollo.
- **.github/workflows** implementa la integración y el despliegue continuo, asegurando procesos consistentes y repetibles.

Esta estructura favorece la mantenibilidad, la escalabilidad y el desarrollo colaborativo, permitiendo que los distintos equipos trabajen de manera independiente sobre cada capa de la aplicación sin generar dependencias innecesarias.