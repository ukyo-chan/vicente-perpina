# Vicente Perpiñá Giner — Portfolio v1.1

Segunda versión pública del portfolio profesional.

La v1.1 mantiene la estructura técnica sencilla de la v1 (HTML + CSS + JS sin dependencias), pero cambia el equilibrio del contenido para reflejar mejor el perfil híbrido de Vicente: artista, ilustrador, autor/editor de cómic y docente.

## Qué cambia respecto a v1

- `index.html`
  - nueva presentación de portada;
  - la obra pasa a ser el acceso principal;
  - proyectos destacados: Oceanogràfic, 37 Il·lustres y DKV Grand Tour;
  - hitos recientes y mejor equilibrio entre arte y docencia.

- `portfolio.html`
  - deja de ser una página «Próximamente»;
  - pasa a llamarse visualmente **Obra y proyectos**;
  - incluye cuatro bloques:
    - obra y exposiciones;
    - cómic y edición;
    - ilustración editorial;
    - animación y audiovisual.

- `docencia.html`
  - Xirivella actualizado a 2018–actualidad;
  - «Infantil» sustituido por «Niños y jóvenes»;
  - se añade preparación de Dibujo Técnico para selectividad;
  - nuevo bloque sobre cómo la experiencia artística se traslada al aula.

- `trayectoria.html`
  - incorpora una cronología artística y profesional;
  - mantiene formación, idiomas y formación complementaria.

- `contacto.html`
  - copy ampliado para encargos de ilustración, talleres, edición y proyectos docentes.

- `assets/css/styles.css`
  - nuevos componentes de proyectos, cronología, navegación interna y destacados;
  - responsive ampliado;
  - animaciones respetan `prefers-reduced-motion`;
  - el contenido permanece visible si JavaScript no funciona.

- `assets/js/main.js`
  - menú móvil mejorado;
  - cierre con Escape;
  - comportamiento robusto si `IntersectionObserver` no está disponible.

## Qué NO incluye todavía

- PDFs o CV descargable;
- programaciones didácticas;
- trabajos de alumnado;
- imágenes ficticias de portfolio;
- una galería exhaustiva de obra.

La selección visual puede incorporarse posteriormente sin cambiar la arquitectura.

## Despliegue

Copia todo el contenido de este ZIP sobre la raíz del repositorio local y acepta **sobreescribir** los archivos existentes.

No hay que borrar ningún archivo de la v1.

Después:

```bash
git add .
git commit -m "Portfolio v1.1"
git push
```

GitHub Pages publicará el cambio automáticamente.

## URLs

- Web: `https://vicenteperpina.com`
- Blog: `https://blog.vicenteperpina.com`
