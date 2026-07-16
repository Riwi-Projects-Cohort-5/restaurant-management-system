# Documentación de la base de datos

## Tabla de contenido
1. Introducción
2. Objetivo del documento
3. Tecnologías y entorno
4. Estructura general del modelo de datos
5. Descripción de tablas principales
6. Relaciones entre entidades
7. Flujo operativo del sistema
8. Scripts de inicialización
9. Principios de diseño
10. Convenciones y buenas prácticas
11. Conclusiones

## 1. Introducción
La base de datos del sistema de gestión del restaurante constituye el componente central de almacenamiento y persistencia de la información operativa. Su función principal es garantizar que los datos generados por el backend permanezcan organizados, consistentes y disponibles para operaciones diarias, reportes y futuras ampliaciones del sistema. En este proyecto, la base de datos se implementa sobre PostgreSQL y se integra con el backend mediante SQLAlchemy.

## 2. Objetivo del documento
El presente documento tiene como finalidad describir de forma formal y estructurada la arquitectura de la base de datos del proyecto, así como las tablas, relaciones, convenciones y reglas de uso que definen su comportamiento. También busca servir como referencia técnica para desarrolladores, analistas y miembros del equipo que necesiten comprender el modelo de datos del sistema.

## 3. Tecnologías y entorno
El entorno de base de datos está basado en las siguientes herramientas y componentes:

- PostgreSQL como motor relacional principal
- Docker Compose para la ejecución del contenedor de base de datos
- SQL scripts de inicialización para crear el esquema base
- SQLAlchemy como ORM del backend para interactuar con la base de datos

El servicio principal de la base de datos se identifica como restaurant-db y se despliega dentro del entorno del proyecto para facilitar la ejecución local y el desarrollo colaborativo.

## 4. Estructura general del modelo de datos
El modelo de datos sigue un enfoque relacional, donde cada entidad del negocio se representa mediante una tabla específica. Estas tablas están conectadas mediante claves foráneas para preservar la integridad referencial y reflejar de manera precisa las relaciones del negocio del restaurante.

Este diseño permite representar procesos como la asignación de mesas, la reserva de espacios, la creación de pedidos, la gestión de pagos, el control de inventario y el seguimiento de la cocina.

## 5. Descripción de tablas principales

### 5.1 users
La tabla users almacena la información relacionada con los usuarios del sistema, incluyendo datos de autenticación, roles, estado de cuenta y marcas de tiempo. Esta tabla es fundamental para controlar el acceso a la aplicación y distinguir entre distintos perfiles operativos como administradores, meseros, cajeros o cocineros.

### 5.2 customers
La tabla customers almacena información básica de los clientes del restaurante. Su propósito principal es servir como referencia para reservas y operaciones de negocio que puedan requerir identificación de clientes en el futuro. Aunque el modelo actual está orientado principalmente a la operación interna del restaurante, esta tabla permite mantener un registro ordenado de los clientes relevantes.

### 5.3 tables
La tabla tables representa las mesas del restaurante. Contiene información como número de mesa, capacidad, ubicación, estado y observaciones. Esta tabla permite determinar de forma clara si una mesa está disponible, ocupada, reservada o en mantenimiento.

### 5.4 reservations
La tabla reservations almacena las reservas realizadas por los clientes. Registra información como fecha, cliente asociado, mesa seleccionada y estado de la reserva. Su uso principal es planificar la ocupación del local y evitar conflictos de disponibilidad.

### 5.5 categories
La tabla categories agrupa los productos del menú en categorías temáticas. Esta estructura mejora la organización del catálogo y facilita operaciones de filtrado, mantenimiento y visualización.

### 5.6 products o menu items
La tabla products, también conocida en el contexto del proyecto como menu items, almacena la información de los productos que pueden venderse en el restaurante. Entre sus datos principales se encuentran el nombre, la descripción, el precio, la disponibilidad y la imagen asociada.

### 5.7 orders
La tabla orders representa los pedidos generados desde mesas y atendidos por usuarios del sistema. En el esquema actual, esta tabla no depende de customers y mantiene relaciones con tables y users. Contiene información financiera básica como subtotal, impuestos y total del pedido.

### 5.8 order_details
La tabla order_details descompone cada pedido en líneas de detalle. Esto permite registrar múltiples productos en un mismo pedido con cantidades y importes individuales, lo que es habitual en entornos de restaurante.

### 5.9 payments
La tabla payments registra los pagos asociados a los pedidos. Aquí se guardan los métodos de pago, montos, fechas y estados de la operación, lo que proporciona trazabilidad de los cobros realizados.

### 5.10 inventory_items y inventory_movements
Estas tablas permiten controlar el inventario del restaurante. inventory_items contiene el estado actual del stock de cada producto o insumo, mientras que inventory_movements registra el historial de entradas y salidas para auditoría y control.

### 5.11 kitchen_status
La tabla kitchen_status permite monitorear el estado de preparación de los pedidos desde la cocina. Registra información operativa como tiempos de inicio, fin y observaciones, lo que facilita la coordinación entre mesas, cocina y servicio.

## 6. Relaciones entre entidades
El diseño relacional de la base de datos se apoya en el uso de claves foráneas para establecer conexiones entre tablas. Algunas de las relaciones principales son:

- orders hace referencia a tables y users
- reservations hace referencia a customers y tables
- order_details hace referencia a orders y products
- payments hace referencia a orders
- inventory_movements hace referencia a inventory_items
- kitchen_status hace referencia a orders y users

Estas relaciones son importantes porque garantizan que la información se mantenga coherente y que no existan referencias inválidas entre tablas.

## 7. Flujo operativo del sistema
Un flujo operativo típico dentro del sistema sigue el siguiente orden:

1. Se registra o actualiza una mesa en la tabla tables.
2. Se crea una reserva en reservations cuando un cliente solicita ocupar una mesa.
3. Se genera un pedido en orders desde una mesa atendida por un usuario.
4. Se agregan los productos del pedido en order_details.
5. Se procesa el pago en payments.
6. Se actualiza el inventario mediante inventory_items e inventory_movements.
7. La cocina monitorea el estado de preparación a través de kitchen_status.

Este flujo demuestra cómo los diferentes módulos del negocio interactúan a través de la base de datos y cómo cada tabla cumple un rol específico dentro del proceso general.

## 8. Scripts de inicialización
El esquema inicial de la base de datos y los datos base del proyecto se almacenan en la carpeta database. Los archivos principales son:

- database/init/01_schema.sql: contiene la definición de las tablas y sus relaciones
- database/seed/: contiene datos de ejemplo o de inicialización para el entorno de desarrollo

Estos scripts se ejecutan automáticamente cuando el contenedor de PostgreSQL se inicializa, lo cual facilita la puesta en marcha del sistema en nuevos entornos.

## 9. Principios de diseño
El diseño de la base de datos busca cumplir con los siguientes criterios:

- ser relacional para representar correctamente las relaciones del negocio
- ser normalizado cuando corresponde para evitar redundancia innecesaria
- ser claro y fácil de consultar para reportes y operaciones diarias
- ser compatible con el ORM SQLAlchemy utilizado por el backend
- ser escalable frente a futuras mejoras del sistema

## 10. Convenciones y buenas prácticas
Para mantener la base de datos consistente y sostenible, se recomienda seguir estas buenas prácticas:

- usar claves primarias UUID cuando sea necesario para evitar colisiones
- mantener los formatos de fecha y hora estandarizados
- evitar inconsistencias entre el esquema SQL y los modelos del backend
- actualizar tanto la base como la documentación al modificar tablas o relaciones
- verificar la integridad referencial antes de desplegar cambios importantes

## 11. Conclusiones
La base de datos del proyecto está diseñada para respaldar las operaciones principales del restaurante de forma ordenada, modular y escalable. Gracias a su estructura relacional y a la organización de tablas por dominio funcional, el sistema puede gestionar reservas, pedidos, pagos, cocina e inventario de manera coherente. Mantener esta documentación actualizada es esencial para asegurar la comprensión del modelo de datos y facilitar el desarrollo continuo del proyecto.
