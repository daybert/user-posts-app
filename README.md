# 📱 User & Posts Explorer — React + TypeScript

Aplicación frontend interactiva desarrollada con **React**, **TypeScript**, **Vite** y **Vitest**, que consume la API pública de [{JSON} Placeholder](https://jsonplaceholder.typicode.com/).

Permite listar usuarios, realizar búsquedas instantáneas por nombre o username, explorar las publicaciones del usuario seleccionado y crear nuevas publicaciones con un formulario validado en tiempo real.

---

## 🚀 Cómo ejecutarlo

### Requisitos previos

- **Node.js** v18 o superior (recomendado v20+)
- **npm** v9 o superior (o pnpm / yarn)

### 1. Clonar o ingresar al proyecto

```bash
cd "c:/Users/Daybert/Desktop/001"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre en tu navegador la URL indicada (usualmente `http://localhost:5173`).

### 4. Ejecutar tests unitarios y de integración

```bash
# Ejecutar los tests una sola vez
npm test

# O ejecutar los tests en modo watch
npm run test:watch
```

### 5. Compilar para producción

```bash
npm run build
npm run preview
```

---

## Decisiones Técnicas Tomadas

El objetivo fue crear una arquitectura limpia, desacoplada, mantenible y escalable, sin sobrecargar una aplicación pequeña con complejidad innecesaria.

### 2. Separación de Responsabilidades con Custom Hooks

- **`useUsers`**: Se encarga del ciclo de vida de la petición a `/users`, el debounce/filtrado en memoria y la gestión de reintentos (`retry`).
- **`useUserPosts`**: Administra la carga de publicaciones según el usuario activo, la invocación de `POST /posts` y la actualización inmutable del estado local.

### 3. Actualización Optimista / Local de Datos

`jsonplaceholder.typicode.com` simula las operaciones `POST` respondiendo con `status: 201 Created` y un identificador mockeado (`id: 101`), pero no persiste los datos en base de datos.

- Para cumplir con la experiencia requerida, la aplicación realiza la petición real `POST` y, tras recibir respuesta satisfactoria del servidor, antepone la nueva publicación en la lista local de posts (`setPosts(prev => [newPost, ...prev])`).
- Se genera una marca temporal `createdAt` y un distintivo visual (`✨ Nueva`) para que el usuario identifique de inmediato su publicación en la sesión actual.

### 4. Validación Rigurosa de Formularios

- Título obligatorio con longitud mínima (3 caracteres tras aplicar `trim()`).
- Contenido/cuerpo obligatorio con longitud mínima (5 caracteres tras aplicar `trim()`).
- Validación inmediata al intentar enviar (`onSubmit`) y corrección dinámica en vivo cuando el campo ha sido marcado como editado (`touched`).
- Soporte de accesibilidad: atributos `aria-invalid`, `aria-describedby` vinculados a los mensajes de error correspondientes y bloqueo de botones (`isSubmitting`) durante la llamada de red.

### 5. Resiliencia y Manejo de Estados

- **Carga visible**: Indicadores de carga (`LoadingSpinner`) tanto a nivel de lista de usuarios como al cambiar de usuario para ver sus posts.
- **Errores visibles con acción de recuperación**: Cada vista de error (`ErrorMessage`) incluye un botón de "Reintentar" (`retry()`) que permite volver a disparar la petición sin recargar la página.
- **Estados vacíos contextuales**: Mensajes claros cuando no se ha seleccionado usuario, cuando un usuario no tiene posts o cuando una búsqueda no arroja coincidencias.

### 6. Sistema de Diseño CSS Nativo (Zero-Dependency)

- Se utilizó un sistema de diseño con **CSS Custom Properties** (tokens para colores, sombras, radios, tipografía y transiciones).
- Layout responsivo: vista de panel dividido (Sidebar + Feed) en pantallas grandes que colapsa naturalmente en dispositivos móviles.
- Estricto respeto a directrices de accesibilidad (contraste WCAG AA, focus rings visibles `:focus-visible` y soporte para navegación con teclado `Enter`/`Space`).

---

## 🔮 Qué se haría con más tiempo

1. **Integración con TanStack Query (React Query)**:
   - Cacheo automático de usuarios y posts con estrategia `stale-while-revalidate`.
   - Mutaciones optimistas con rollback automático en caso de fallo de red.
   - Paginación infinita o virtualización (`@tanstack/react-virtual`) para listas de cientos de usuarios.
2. **Sincronización con la URL (Routing)**:
   - Utilizar React Router o TanStack Router para permitir URLs compartibles (ej. `/users/:userId` o query params `?userId=2&search=leanne`).
3. **Persistencia Local (IndexedDB / LocalStorage)**:
   - Persistir las publicaciones creadas en la sesión actual para que no se pierdan al refrescar la página.
4. **Comentarios de cada Publicación**:
   - Consumir el endpoint `/posts/{id}/comments` con un componente colapsable para ver las respuestas de cada post.
5. **Pruebas End-to-End (E2E)**:
   - Suites con Playwright simulando navegación en navegadores reales bajo condiciones de red lentas (3G throttling).
6. **Internacionalización (i18n)**:
   - Soporte multilingüe (Español / Inglés) mediante `react-i18next`.
7. **Modo Oscuro / Claro**:
   - Soporte automático según las preferencias del sistema (`prefers-color-scheme`) y toggle manual.

---

## 🤖 Uso de la Inteligencia Artificial (Transparencia y Criterio Senior)

Como parte de las buenas prácticas de ingeniería moderna, la IA fue utilizada como un acelerador de productividad y pair programmer. A continuación se desglosa el proceso de colaboración:

### 1. Qué se le pidió a la IA

- Estructurar el scaffolding de la aplicación utilizando Vite con React 18 y TypeScript.
- Proponer una base visual responsiva y limpia sin frameworks CSS pesados.
- Generar casos de prueba representativos para React Testing Library y Vitest.

### 2. Qué se aceptó

- La descomposición en custom hooks desacoplados (`useUsers` y `useUserPosts`), lo cual mantiene los componentes limpios y fáciles de testear.
- La estructura modular de componentes (`UserSearch`, `UserCard`, `PostCard`, `CreatePostForm`).
- El diseño visual moderno basado en tarjetas con tokens CSS y feedback de estado (loaders, alertas, badges).

### 3. Qué se corrigió o refinó (Criterio Humano / Senior)

1. **Conflicto de accesibilidad en Testing Library**:
   - _Problema_: El componente `LoadingSpinner` incluía tanto un `<p>` como un `<span className="sr-only">` con el mismo texto, lo que provocaba que `screen.getByText(/cargando usuarios/i)` fallara por encontrar múltiples elementos en el DOM.
   - _Corrección_: Se eliminó la duplicidad y se mantuvo un único elemento semántico dentro de un contenedor con `role="status"` y `aria-live="polite"`.
2. **Colisión de `key` de React por comportamiento de JSONPlaceholder**:
   - _Problema_: La API de JSONPlaceholder devuelve siempre `id: 101` para cualquier nuevo post. Si el usuario creaba dos publicaciones en la misma sesión, se producían advertencias de React por claves duplicadas (`key="101"`).
   - _Corrección_: Se asignó un `id` único local (`Date.now()`) al guardar la nueva publicación en el estado del cliente.
3. **Persistencia del formulario ante errores de red**:
   - _Problema_: Inicialmente, si la llamada al endpoint fallaba, el estado del formulario podía colapsar o perder el texto introducido.
   - _Corrección_: Se ajustó `CreatePostForm` para que, en caso de error en el backend, permanezca abierto (`isOpen = true`), conserve los datos ingresados por el usuario y muestre un banner de error explícito para permitir el reintento.
4. **Configuración de Vitest en entornos Windows**:
   - _Problema_: Vitest presentaba excepciones de `EPERM realpath` al intentar resolver módulos en el sistema de archivos de Windows.
   - _Corrección_: Se configuró `resolve.preserveSymlinks: true` y se definió el pool adecuado en `vite.config.ts`.
