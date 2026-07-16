/**
 * Generate and trigger a CSV file download in the browser.
 *
 * @param {string} filename - Desired filename (without .csv extension).
 * @param {string[]} headers - Array of column header strings.
 * @param {Array<Object>} rows - Array of data objects. Keys should match headers.
 * @param {Object} [options] - Optional configuration.
 * @param {string} [options.delimiter=','] - Field delimiter.
 * @param {string} [options.lineEnding='\r\n'] - Line ending sequence.
 * @param {boolean} [options.includeBOM=false] - Prepend UTF-8 BOM for Excel.
 */
export function exportToCsv(filename, headers, rows, options = {}) {
  const { delimiter = ",", lineEnding = "\r\n", includeBOM = false } = options;

  function escapeCell(value) {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (
      str.includes(delimiter) ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r") ||
      str.startsWith(" ") ||
      str.endsWith(" ")
    ) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  const csvRows = [];

  csvRows.push(headers.map(escapeCell).join(delimiter));

  for (const row of rows) {
    const values = headers.map((h) => escapeCell(row[h]));
    csvRows.push(values.join(delimiter));
  }

  const csvContent = csvRows.join(lineEnding);
  const blobContent = includeBOM ? "\uFEFF" + csvContent : csvContent;
  const blob = new Blob([blobContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : filename + ".csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
