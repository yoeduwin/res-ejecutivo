# Resúmenes Ejecutivos — Ejecutiva Ambiental

Web App de Google Apps Script para generar resúmenes ejecutivos de mediciones NOM (NOM-011, NOM-022, NOM-025). Reemplaza el proceso de macros en Excel con una aplicación web con autenticación Google nativa, log automático en Google Sheets y exportación a PDF.

**Empresa:** Solución en Ingeniería Ejecutiva Ambiental S.A. de C.V.
**Acreditación EMA:** AL-1973-207/25

---

## Arquitectura

| Capa | Tecnología |
|------|-----------|
| Backend / Hosting | Google Apps Script (`Code.gs`) |
| Frontend | HTML + CSS + JS vanilla (archivos `.html` en GAS) |
| Autenticación | `Session.getActiveUser().getEmail()` — nativa de Google |
| Log | Google Sheets (`1X_tYOgrR5OOYvZw8RgzHq24SCnAXHaVftG032WwU23k`) |
| PDF | jsPDF + html2canvas (CDN) |
| Versionado | GitHub + clasp |

---

## Prerrequisitos

- Cuenta Google con acceso al Drive del proyecto
- [Node.js](https://nodejs.org/) instalado (para clasp)
- clasp instalado globalmente:
  ```bash
  npm install -g @google/clasp
  clasp login
  ```

---

## Setup inicial

### 1. Crear el proyecto de Google Apps Script

1. Ve a [script.google.com](https://script.google.com) → **Nuevo proyecto**
2. Renómbralo: `Resúmenes Ejecutivos — Ejecutiva Ambiental`
3. Anota el **Script ID** que aparece en **Configuración del proyecto** (ícono de engranaje)

### 2. Vincular este repositorio con clasp

```bash
# Clonar el repo
git clone <url-del-repo>
cd res-ejecutivo

# Vincular con el proyecto GAS existente
clasp clone <SCRIPT_ID>
# Esto crea el archivo .clasp.json con el rootDir
```

O si prefieres inicializar desde cero:

```bash
clasp create --title "Resúmenes Ejecutivos EA" --type webapp
```

### 3. Verificar `.clasp.json`

```json
{
  "scriptId": "<TU_SCRIPT_ID>",
  "rootDir": "."
}
```

### 4. Configurar el Google Sheet de log

El Sheet de log ya está configurado en `Code.gs`:

```javascript
const SPREADSHEET_ID = '1X_tYOgrR5OOYvZw8RgzHq24SCnAXHaVftG032WwU23k';
```

Si necesitas usar otro Sheet, reemplaza ese ID. La hoja `Log` y sus encabezados se crean automáticamente en el primer uso.

### 5. Subir el código a GAS

```bash
clasp push
```

---

## Desplegar como Web App

1. En el editor de GAS: **Implementar → Nueva implementación**
2. Tipo: **Aplicación web**
3. Configuración:
   - **Ejecutar como:** Yo (`<tu-email>`)
   - **Quién tiene acceso:** Cualquier persona con cuenta de Google
4. Haz clic en **Implementar** y copia la URL generada

> El control de acceso lo maneja el código (`ALLOWED_EMAILS` en `Code.gs`), no la configuración de GAS.

---

## Agregar un usuario autorizado

Edita el array `ALLOWED_EMAILS` en `Code.gs`:

```javascript
const ALLOWED_EMAILS = [
  'eduwin.ejecutiva@gmail.com',
  'operaciones.ejecutivamx@gmail.com',
  'calidad.ejecutivamx@gmail.com',
  'nuevo.usuario@gmail.com'   // ← Agregar aquí
];
```

Luego:

```bash
clasp push
```

Y en GAS: **Implementar → Gestionar implementaciones → Nueva versión**.

---

## Agregar una nueva NOM en el futuro

1. **`Index.html`** — Agregar un checkbox nuevo en la sección "NOMs aplicables" y una nueva `<section id="seccion-NXX">` con sus tablas y botones de fila.

2. **`JavaScript.html`** — Agregar:
   - El párrafo de carta en el objeto `PARRAFOS_NOM['NXX']`
   - La lógica de conteos en la función `renderizarTablaResumen()` para el nuevo caso `nom === 'NXX'`
   - El array de tbodyIds en `tablasPorNom` dentro de `validarFormulario()` y `restaurarFormulario()`

3. **`Stylesheet.html`** — No suelen requerirse cambios; los estilos de tabla y NOM son genéricos.

4. **`Code.gs`** — No requiere cambios; `registrarLog()` recibe el array de NOMs dinámicamente.

---

## Flujo de desarrollo GitHub → GAS

```
Editar archivos localmente (VS Code, etc.)
        ↓
git add . && git commit -m "descripción"
git push origin main
        ↓
clasp push            ← Sube los cambios a GAS
        ↓
GAS: Implementar → Gestionar implementaciones → Nueva versión
        ↓
Probar la nueva URL de la Web App
```

---

## Estructura del repositorio

```
/
├── Code.gs              ← Backend: doGet(), registrarLog(), include()
├── Index.html           ← UI principal (formulario + vista previa)
├── Stylesheet.html      ← CSS completo
├── JavaScript.html      ← Lógica del cliente (vanilla ES6+)
├── appsscript.json      ← Manifest de GAS
└── README.md            ← Este archivo
```

---

## Usuarios autorizados

| Usuario | Correo | Rol |
|---------|--------|-----|
| Eduwin | eduwin.ejecutiva@gmail.com | Admin |
| Martín | operaciones.ejecutivamx@gmail.com | Usuario |
| Eduardo | calidad.ejecutivamx@gmail.com | Usuario |

---

*Ejecutiva Ambiental — uso interno — marzo 2026*
