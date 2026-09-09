# Vicente Perpiñá — migración a Astro · Slice 1

Este slice introduce el esqueleto de Astro y el nuevo despliegue por GitHub Actions **sin retirar todavía las páginas estáticas de la v1.1**.

## Qué cambia en este slice

- La portada (`/`) ya se genera con Astro.
- Se crean `BaseLayout`, `Header` y `Footer` reutilizables.
- Se añade configuración de Astro para `https://vicenteperpina.com`.
- Se añade el workflow de GitHub Pages con GitHub Actions.
- Las páginas `portfolio.html`, `docencia.html`, `trayectoria.html` y `contacto.html` se copian temporalmente a `public/` para que sigan funcionando exactamente como en la v1.1 mientras se migran en el Slice 2.
- Los CSS, JS y la imagen actual también se mantienen temporalmente en `public/assets/`.

## Importante: no borres todavía los HTML antiguos de raíz

En el Slice 1 pueden coexistir los HTML antiguos de raíz con el nuevo proyecto Astro. Cuando GitHub Pages use GitHub Actions, el despliegue se construye desde Astro y esos HTML de raíz dejan de intervenir. Se eliminarán de forma ordenada en el Slice 2.

## Publicación

Después de copiar este slice encima del repositorio:

```bash
git add .
git commit -m "Migración Astro - Slice 1"
git push
```

Luego, una sola vez en GitHub:

1. `Settings` → `Pages`.
2. En `Build and deployment`, cambia `Source` a **GitHub Actions**.
3. Comprueba que `Custom domain` sigue siendo `vicenteperpina.com`.
4. Comprueba que `Enforce HTTPS` permanece activado.
5. En `Actions`, abre **Deploy to GitHub Pages** y verifica que termina correctamente.

A partir de ese momento cada push a `main` compilará y publicará Astro automáticamente.

## Desarrollo local (opcional)

Con Node instalado:

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Estructura temporal del Slice 1

```text
.github/workflows/deploy.yml
public/
  CNAME
  portfolio.html
  docencia.html
  trayectoria.html
  contacto.html
  assets/
src/
  components/
    Header.astro
    Footer.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
astro.config.mjs
package.json
tsconfig.json
.gitignore
```

## Próximo slice

El Slice 2 migrará las cuatro páginas estáticas restantes a `src/pages/`, trasladará estilos/scripts al árbol fuente cuando convenga, cambiará las URLs a rutas limpias y retirará los HTML legacy.
