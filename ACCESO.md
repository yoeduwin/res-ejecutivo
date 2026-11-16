# Acceso real — RES-EJECUTIVO

## Qué protege este candado

Antes, cualquiera que abriera la página podía generar resúmenes ejecutivos
y portadas con el membrete de Ejecutiva Ambiental y la acreditación
AL-1973-207/25 a nombre de cualquier empresa, sin login.

Ahora la herramienta exige **login Google + verificación en el servidor**
contra la lista de acceso del equipo:

- Al abrir la página solo se ve el login de Google; el contenido queda
  oculto hasta verificar la cuenta.
- La app no arranca (ni fecha, ni modos) hasta verificar.
- Los puntos de generación (`generarResumen`, `generarSoloPortadas`,
  `descargarPDF`, `imprimirPDFAltaCalidad`, `imprimirPortada`) vuelven a
  exigir sesión verificada: aunque alguien quitara el overlay con DevTools,
  generar pide login primero.

## Cómo funciona

1. Google Identity Services (GIS) emite un `id_token`.
2. `auth.js` (copia del módulo compartido de SEA) lo envía por POST al
   backend de Apps Script de SEA (acción `verificarAcceso`, constante
   `EA_GAS_URL` en `index.html`), que lo valida contra Google (tokeninfo +
   audience) y comprueba el correo en la hoja **USUARIOS_AUTORIZADOS**
   (columna Activo; sin restricción de módulo, porque este generador no
   tiene columna propia).
3. Solo entonces arranca la app.

## Configuración (un solo valor)

- `CLIENT_ID` en `auth.js`: **un solo cliente OAuth de Google** para toda
  la EA Suite (el mismo que SEA). El backend valida el `aud` del token
  contra la Script Property `GOOGLE_CLIENT_ID`.
- La lista de acceso es la hoja **USUARIOS_AUTORIZADOS** del Sheet del
  backend SEA. Para dar o quitar acceso se edita esa hoja; no se toca código.

## Qué NO hace este candado

- El HTML/JS estático de GitHub Pages siempre es descargable por diseño
  (incluidas las plantillas y fondos de las portadas, que viven en el repo).
  Un atacante decidido podría copiar el código y ejecutarlo en local. El
  candado evita el uso casual y el uso con el membrete desde la URL pública,
  que era la amenaza real.
- La sesión en el navegador dura hasta que expira el token de Google
  (~1 h). Si alguien se da de baja en la lista, su sesión abierta sigue
  válida hasta que expire el token, pero cada verificación nueva se le niega.
- Editar el formulario (agregar filas, cambiar campos) no está bloqueado:
  lo protegido es **generar** documentos, no teclear.

## Pendiente (fuera de este PR)

- [ ] Confirmar en Google Cloud Console que el cliente OAuth existe y que
      sus orígenes JavaScript autorizados incluyen
      `https://yoeduwin.github.io` y `https://intranet.ejecutivambiental.com`.
- [ ] Confirmar que la hoja `USUARIOS_AUTORIZADOS` tiene al equipo activo.
- [ ] Revisar este PR, hacer merge y comprobar en producción que la página
      pide login y que solo el equipo puede generar.

## Cómo probarlo (tras el merge)

1. Abrir la página en incógnito: debe aparecer solo el login de Google.
2. Entrar con una cuenta del equipo: la herramienta se muestra y genera.
3. Entrar con una cuenta fuera de la lista: mensaje "no tiene acceso" y la
   herramienta no se muestra.
