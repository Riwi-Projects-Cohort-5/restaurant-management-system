# Documentación general del backend

## Tabla de contenido
1. Introducción
2. Objetivo del documento
3. Alcance del sistema
4. Arquitectura general
5. Módulos funcionales
6. Tecnologías utilizadas
7. Flujo de una solicitud
8. Estructura del proyecto
9. Buenas prácticas de desarrollo
10. Conclusiones

## 1. Introducción
El backend del sistema de gestión del restaurante es la capa responsable de procesar la lógica de negocio, exponer servicios a través de una API y coordinar la interacción con la base de datos. Su propósito es permitir la gestión integral de operaciones diarias del restaurante, tales como autenticación de usuarios, manejo de mesas, reservas, pedidos, pagos, inventario y reportes.

## 2. Objetivo del documento
Este documento tiene como finalidad describir de forma formal la arquitectura, los componentes y el funcionamiento general del backend del proyecto. También sirve como referencia técnica para comprender cómo está organizado el sistema y cómo se integran sus diferentes capas.

## 3. Alcance del sistema
El backend está diseñado para cubrir los procesos principales de operación de un restaurante, incluyendo:

- autenticación y control de acceso
- administración de usuarios
- gestión de mesas y reservas
- administración del menú
- creación y seguimiento de pedidos
- procesamiento de pagos
- control de inventario
- gestión de cocina
- generación de reportes

## 4. Arquitectura general
El backend sigue una arquitectura modular y por capas, lo que permite separar claramente responsabilidades y facilitar el mantenimiento del sistema. Su estructura general se organiza de la siguiente manera:

- app/main.py: punto de entrada de la aplicación
- app/api/: definición de rutas y endpoints expuestos por la API
- app/core/: configuración, seguridad y utilidades compartidas
- app/db/: conexión a la base de datos, modelos ORM y esquemas Pydantic
- app/repositories/: acceso a datos y operaciones de persistencia
- app/services/: lógica de negocio y validaciones del sistema
- app/utils/: funciones auxiliares reutilizables

Esta organización permite que cada capa cumpla una función específica, reduciendo la complejidad del código y facilitando su evolución.

## 5. Módulos funcionales
El sistema está dividido en módulos funcionales que responden a las necesidades del negocio del restaurante:

- Auth: autenticación de usuarios y gestión de sesiones
- Users: administración de personal y perfiles del sistema
- Locations: gestión de ubicaciones del restaurante
- Inventory: manejo de stock e inventario
- Kitchen: procesamiento de órdenes y seguimiento de cocina
- Menu: administración de categorías y productos del menú
- Orders: creación, actualización y gestión de pedidos
- Payments: registro y procesamiento de pagos
- Reservations: administración de reservas
- Tables: control de mesas y su disponibilidad
- Reports: generación de reportes y análisis operativos

## 6. Tecnologías utilizadas
El backend utiliza un conjunto de herramientas modernas y ampliamente adoptadas:

- Python como lenguaje principal
- FastAPI para el desarrollo de la API REST
- SQLAlchemy como ORM para la interacción con PostgreSQL
- Pydantic para validación de datos de entrada y salida
- PostgreSQL como motor de base de datos relacional
- Docker y Docker Compose para contenedorización del entorno

## 7. Flujo de una solicitud
Un flujo típico de una petición dentro del sistema sigue este recorrido:

1. El cliente envía una solicitud a una ruta de la API.
2. La ruta delega la tarea al servicio correspondiente.
3. El servicio ejecuta la lógica de negocio necesaria.
4. El repositorio interactúa con la base de datos mediante SQLAlchemy.
5. El resultado se transforma en un modelo de respuesta y se devuelve al cliente.

Este modelo de flujo permite mantener el código ordenado y facilita la incorporación de nuevas funcionalidades sin afectar directamente otras capas.

## 8. Estructura del proyecto
La organización del proyecto responde a una separación clara entre responsabilidades:

- La capa de API expone los servicios del sistema.
- La capa de servicios contiene la lógica de negocio.
- La capa de repositorios encapsula las operaciones de acceso a datos.
- La capa de modelos define las entidades del sistema.
- La capa de esquemas valida y estructura las entradas y salidas.

Esta estructura mejora la mantenibilidad, la prueba del sistema y la colaboración entre desarrolladores.

## 9. Buenas prácticas de desarrollo
Para mantener el backend escalable y fácil de mantener, se recomienda seguir estas prácticas:

- mantener la separación entre API, servicios y repositorios
- evitar lógica de negocio en las rutas directamente
- usar modelos y esquemas para validar datos de forma consistente
- documentar cambios en la estructura de la base de datos
- mantener la base de datos alineada con los modelos del backend
- escribir pruebas cuando sea posible para garantizar estabilidad del sistema

## 10. Conclusiones
El backend del proyecto está diseñado como una solución modular, clara y extensible para cubrir las necesidades operativas de un restaurante. Gracias a su arquitectura por capas, su integración con PostgreSQL y su enfoque en la separación de responsabilidades, el sistema es adecuado para crecer y evolucionar conforme se agregan nuevas funciones o módulos.
