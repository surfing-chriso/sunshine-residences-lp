/**
 * SUNSHINE — Google Apps Script
 * ==============================
 * Paste this into Extensions → Apps Script in your Google Sheet.
 * Then: Deploy → New deployment → Web app → "Anyone" → Deploy.
 * Copy the URL and paste it into script.js as GOOGLE_SCRIPT_URL.
 *
 * Sheet columns (Row 1 headers — create these first):
 * A: Timestamp | B: Name | C: Email | D: Mobile | E: Reservations | F: Event
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),           // Timestamp
      data.name || '',      // Full Name
      data.email || '',     // Email Address
      data.mobile || '',    // Mobile Number
      data.reservations || '', // Number of Reservations
      data.event || ''      // Event Date/Time
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: handle GET requests for testing
function doGet() {
  return ContentService
    .createTextOutput('Sunshine booking endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
