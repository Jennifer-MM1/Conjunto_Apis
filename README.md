# API Hub Dashboard — Plataforma Multi-API con Soporte 3D

Una plataforma web interactiva estilo dashboard construida con **React**, **Vite** y **Tailwind CSS v4**, conectada a **9 APIs públicas diferentes**. El proyecto destaca por implementar un diseño premium centrado en la experiencia de usuario (UI/UX), accesibilidad (a11y) e interactividad visual en tres dimensiones.

---

## Características de UI/UX y Diseño Premium

* **Fondo de Partículas 3D Interactivo**: Un lienzo (Canvas HTML5) optimizado que proyecta una red de nodos tridimensionales flotantes en constante rotación que responden dinámicamente a la posición del cursor.
* **Efecto de Inclinación de Tarjeta 3D (3D Card Tilt)**: Las tarjetas informativas principales del panel y de navegación aplican transformaciones 3D nativas (`perspective`, `rotateX`, `rotateY`) y un destello brillante translúcido (*glare*) controlado por el puntero para simular volumen y profundidad física.
* **Estilo Glassmorphism HSL**: Interfaces construidas con capas semi-transparentes y desenfoques gaussianos (`backdrop-filter`) combinados con acentos de gradiente violeta-cyan.
* **Skeletons de Carga Avanzados**: Skeletons adaptativos con animaciones fluidas de luz (*shimmer*) que anticipan la forma final de los datos para una carga suave.
* **Manejo Resiliente de Errores y Límites**:
  * Si la API externa de CoinGecko sobrepasa su cuota (Error 429 de límite de peticiones), la aplicación activa de forma fluida un mock de respaldo de alta fidelidad para asegurar la visualización ininterrumpida de las criptomonedas.
  * Componentes amigables de `ErrorState` e ilustraciones para búsquedas sin resultados (`EmptyState`).
* **Soporte de Tema Oscuro y Claro**: Alternancia fluida persistida en `localStorage`.

---

## Módulos y APIs Consumidas (10 Secciones)

1. **Dashboard Home**: Módulo de bienvenida con saludo horario dinámico, métricas generales de conexión y atajos con tarjetas 3D interactivas para cada sección.
2. **Anime Explorer (Jikan API)**: Catálogo y buscador de animes populares con filtros por tipo (TV/Peliculas), paginación y modal detallado con sinopsis y trailer oficial incrustado de YouTube.
3. **Pokédex Interactivo (PokéAPI)**: Cuadrícula de Pokémon con filtrado por tipo. Al hacer clic, abre un modal con pestañas que muestra estadísticas base en gráficos de barra interactivos (Chart.js), habilidades y hábitats.
4. **Rick & Morty (Rick and Morty API)**: Explorador de personajes con buscador debounced y filtros rápidos por estado (Alive/Dead/unknown) y especies.
5. **Chuck Norris Jokes (Chuck Norris API)**: Generador interactivo de chistes aleatorios con selector de categorías, animación de transición *flip* e historial persistente de la sesión.
6. **Foro Social (JSONPlaceholder)**: Simulación de foro social para renderizar posts reales, consultar sus comentarios dinámicamente en acordeones y crear posts simulados agregados localmente.
7. **Directorio de Equipo (Random User API)**: Directorio de contactos de equipo con vista intercambiable (Cuadrícula o Lista), buscador, ordenación por nombre/país y carga progresiva (*Load More*).
8. **Clima Local (OpenWeather API)**: Consulta de condiciones meteorológicas actuales y pronóstico semanal. Cuenta con fondos dinámicos y coloridos que se adaptan a la atmósfera del clima buscado.
9. **COVID Analytics (disease.sh)**: Gráficos de tendencias históricas de contagios (LineChart), dona de distribución de estados (DoughnutChart) y desglose en tabla interactiva de países.
10. **Crypto Tracker (CoinGecko API)**: Tabla financiera en tiempo real con logos, buscador, polling automático cada 60 segundos y respaldo de fallos integrado.

---

## Tecnologías Utilizadas

* **Vite** (como entorno de desarrollo rápido)
* **React 18** (para la lógica basada en componentes)
* **Tailwind CSS v4** (sistema de diseño CSS-first de alto rendimiento)
* **Chart.js** & **react-chartjs-2** (para el renderizado interactivo de estadísticas)
* **React Router v6** (para la gestión de rutas limpias)
* **Lucide React** (para la biblioteca de iconos SVG vectoriales)

---

## Instalación y Uso Local

Sigue estos pasos para instalar y arrancar la aplicación en tu entorno local:

### Prerrequisitos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### Pasos de Instalación
1. Clona o copia el directorio del proyecto.
2. Abre la terminal en la raíz del proyecto e instala las dependencias necesarias:
   ```bash
   npm install
   ```

### Ejecutar en Desarrollo
Inicia el servidor local de Vite:
```bash
npm run dev
```
La aplicación estará disponible en la dirección local: **[http://localhost:5173/](http://localhost:5173/)**

### Compilar para Producción
Para verificar la compilación y optimizar el rendimiento antes de desplegar:
```bash
npm run build
```
Los archivos optimizados y minificados se generarán en la carpeta `dist/`.
