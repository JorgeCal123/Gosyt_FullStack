#   Gosyt Backend

 API REST para la gestión de órdenes o tareas a empleados, permitiendo a las empresas dar seguimiento y gestionar el avance de las tareas asignadas dentro de consultas o reportes de consultas que permitan visualizar el estado de las tareas asignadas.

---

## 🛠️ Tecnologías Utilizadas

### Backend & Entorno de Ejecución
- **[Node.js](https://nodejs.org/):** Entorno de ejecución para JavaScript en el servidor.
- **[Express](https://expressjs.com/):** Framework web rápido y minimalista para la creación de la API REST.
- **[TypeScript](https://www.typescriptlang.org/):** Superset tipado de JavaScript para un código más robusto y escalable.
- **[pnpm](https://pnpm.io/):** Gestor de paquetes rápido y eficiente en uso de espacio en disco.

### Bases de Datos & ORM / ODM
- **[PostgreSQL (`pg` & `pg-hstore`)](https://www.postgresql.org/):** Base de datos relacional.
- **[Sequelize](https://sequelize.org/):** ORM (Object-Relational Mapping) para la gestión y modelado en PostgreSQL.
- **[MongoDB & Mongoose](https://mongoosejs.com/):** Base de datos NoSQL y ODM para el modelado de datos flexible.

### Seguridad & Autenticación
- **[JSON Web Tokens (`jsonwebtoken`)](https://jwt.io/):** Generación y validación de tokens de sesión para autenticación segura.
- **[Bcrypt.js (`bcryptjs`)](https://www.npmjs.com/package/bcryptjs):** Hasheo y encriptación de contraseñas de usuarios.
- **[Dotenv](https://www.npmjs.com/package/dotenv):** Gestión y carga segura de variables de entorno (`.env`).

### Herramientas de Desarrollo
- **`ts-node-dev`:** Reinicio automático del servidor de desarrollo al detectar cambios en archivos TypeScript.
- **Definiciones de Tipos (`@types/*`):** Tipado estático para Node.js, Express y JWT.
