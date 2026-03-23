// ============================================================
// Code.gs — Resúmenes Ejecutivos · Ejecutiva Ambiental
// Google Apps Script — Backend y servidor HTML
// ============================================================

// --- Correos autorizados ---
const ALLOWED_EMAILS = [
  'eduwin.ejecutiva@gmail.com',        // Eduwin — Admin
  'operaciones.ejecutivamx@gmail.com', // Martín — Operaciones
  'calidad.ejecutivamx@gmail.com'      // Eduardo — Calidad
];

// --- ID del Google Sheet de log ---
const SPREADSHEET_ID = '1X_tYOgrR5OOYvZw8RgzHq24SCnAXHaVftG032WwU23k';

// ============================================================
// doGet() — Punto de entrada de la Web App
// ============================================================
function doGet() {
  const usuario = Session.getActiveUser().getEmail();

  // Verificar acceso
  if (!ALLOWED_EMAILS.includes(usuario)) {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: sans-serif; display: flex; align-items: center;
                 justify-content: center; min-height: 100vh; margin: 0;
                 background: #f5f5f5; }
          .caja { background: #fff; padding: 40px; border-radius: 8px;
                  border-left: 6px solid #005600; max-width: 480px; }
          h2 { color: #005600; margin-top: 0; }
          p { color: #444; line-height: 1.6; }
          a { color: #005600; }
        </style>
      </head>
      <body>
        <div class="caja">
          <h2>Acceso denegado</h2>
          <p>Tu cuenta <strong>${usuario}</strong> no tiene acceso a esta aplicación.</p>
          <p>Contacta a:
            <a href="mailto:direccion.general@ejecutivambiental.com">
              direccion.general@ejecutivambiental.com
            </a>
          </p>
        </div>
      </body>
      </html>
    `);
  }

  // Servir la aplicación principal
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Resúmenes Ejecutivos — Ejecutiva Ambiental')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// include() — Patrón de inclusión de archivos HTML (CSS / JS)
// ============================================================
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
// registrarLog() — Escribe una entrada en el Sheet de log
// Llamada desde el cliente con google.script.run
// ============================================================
function registrarLog(datos) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let hoja = ss.getSheetByName('Log');

  // Crear hoja "Log" si no existe
  if (!hoja) {
    hoja = ss.insertSheet('Log');
  }

  // Insertar encabezados si la hoja está vacía
  if (hoja.getLastRow() === 0) {
    hoja.appendRow([
      'Fecha y hora',
      'Generado por',
      'Razón Social',
      'Dirigido a',
      'Puesto',
      'NOMs incluidas',
      'Total puntos evaluados'
    ]);

    // Formatear fila de encabezados
    const rangoEncabezado = hoja.getRange(1, 1, 1, 7);
    rangoEncabezado.setBackground('#005600');
    rangoEncabezado.setFontColor('#FFFFFF');
    rangoEncabezado.setFontWeight('bold');
    hoja.setFrozenRows(1);
  }

  // Registrar la entrada del log
  hoja.appendRow([
    new Date(),
    Session.getActiveUser().getEmail(),
    datos.razonSocial   || '',
    datos.dirigidoA     || '',
    datos.puesto        || '',
    (datos.noms || []).join(', '),
    datos.totalPuntos   || 0
  ]);
}
