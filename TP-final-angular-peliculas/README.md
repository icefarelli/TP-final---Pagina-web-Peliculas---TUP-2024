
# Cinemax UTN 🎥

¡Bienvenido a **Cinemax UTN**!  
Una aplicación web que ofrece una experiencia cinematográfica única. Puedes explorar detalles de películas, agregar tus favoritas, escribir reseñas, calificar películas y disfrutar de un divertido juego de preguntas y respuestas sobre cine.

---

## 🚀 Características

- **Explorar películas**: Consulta información detallada de tus películas favoritas.
- **Favoritos**: Agrega películas a tu lista de favoritos personalizada.
- **Reseñas y puntuaciones**: Da tu opinión y califica las películas.
- **Actores**: Consulta informacion sobre los actores de tu pelicula favorita y ve en que otras peliculas han participado.
- **Trivia de cine**: Demuestra cuánto sabes de cine con nuestro juego de preguntas y respuestas.

---

## 🛠️ Tecnologías utilizadas

- **Angular**: Framework principal para la construcción de la aplicación.
- **JSON Server**: Servidor simulado para la gestión de datos de usuarios y películas.
- **Node.js**: Entorno para ejecutar dependencias y scripts del proyecto.

---

## 📦 Requisitos previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [Angular CLI](https://angular.io/cli)

---

## 📖 Instalación y configuración

Sigue estos pasos para configurar y ejecutar el proyecto:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu_usuario/cinemax-utn.git
   cd cinemax-utn
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta el servidor JSON**:
   Inicia el servidor simulado para manejar usuarios y datos:
   ```bash
   npm run json-server-usuario
   ```

4. **Inicia el servidor Angular**:
   Ejecuta el servidor de desarrollo para la aplicación:
   ```bash
   ng serve
   ```

5. **Accede a la aplicación**:
   Abre tu navegador y ve a [http://localhost:4200](http://localhost:4200).

---

## 🧩 Estructura del proyecto

```
cinemax-utn/
├── src/
│   ├── app/               # Componentes principales
│   ├── assets/            # Imágenes y recursos estáticos
│   ├── environments/      # Configuraciones de entorno
│   ├── styles.css         # Estilos globales
│   └── index.html         # Página principal
├── package.json           # Dependencias y scripts
├── angular.json           # Configuración de Angular CLI
├── db.json                # Base de datos simulada
└── README.md              # Documentación del proyecto
```

---

## 🎮 Funcionalidades principales

1. **Ver películas**:
   Navega por una lista de películas, consulta detalles como sinopsis, reparto y más.

2. **Agregar a favoritos**:
   Inicia sesión y guarda tus películas favoritas para acceso rápido.

3. **Escribir reseñas**:
   Comparte tus pensamientos sobre una película y califícala en una escala de 1 a 5 estrellas.

4. **Juego de trivia**:
   Participa en un entretenido cuestionario sobre cine y reta tus conocimientos.

---

¡Gracias por visitar **Cinemax UTN**! 🎬
