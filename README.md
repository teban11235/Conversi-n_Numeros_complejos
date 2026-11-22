# Números Complejos Interactivos

Aplicación web interactiva desarrollada con **React**, **TypeScript**, **Tailwind CSS** y **Vite** para visualizar números complejos en el plano complejo y realizar conversiones en tiempo real entre su **forma rectangular** ($z = a + bj$) y su **forma polar** ($z = r \angle \theta^\circ$).

## Características

- **Plano Complejo Interactivo (SVG)**: Arrastra el vector directamente sobre la cuadrícula (compatible con ratón y pantallas táctiles) para actualizar sus coordenadas y ángulo de fase en tiempo real.
- **Entrada Manual Bidireccional**:
  - **Modo Rectangular**: Ingresa la parte real ($a$) y la parte imaginaria ($b$).
  - **Modo Polar**: Ingresa la magnitud ($r$) y el ángulo de fase ($\theta^\circ$).
- **Conversión Dinámica**: Visualiza paso a paso las fórmulas aplicadas ($\sqrt{a^2 + b^2}$, $\tan^{-1}(b/a)$, $r\cos\theta$, $r\sin\theta$).
- **Notas Educativas**: Incluye recordatorios sobre validación de cuadrantes (II y III) y conceptos de ingeniería eléctrica (fasores e impedancia).

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- `npm` (incluido con Node.js)

## Instalación y Ejecución en Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Luego abre en tu navegador la URL indicada en la consola (por defecto `http://localhost:5173`).

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

4. **Previsualizar la versión de producción:**
   ```bash
   npm run preview
   ```
