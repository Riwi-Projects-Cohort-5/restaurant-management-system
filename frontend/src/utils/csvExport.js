export function exportToCSV(data, filename, columns) {
  if (!data || data.length === 0) {
    return;
  }

  var headers = columns
    ? columns.map(function (c) { return c.label || c.key; })
    : Object.keys(data[0]);

  var rows = data.map(function (row) {
    return columns
      ? columns.map(function (c) { return escapeCSVField(row[c.key]); })
      : Object.values(row).map(function (v) { return escapeCSVField(v); });
  });

  var csvContent = "\uFEFF";
  csvContent += headers.map(function (h) { return escapeCSVField(h); }).join(",") + "\n";
  csvContent += rows.map(function (r) { return r.join(","); }).join("\n");

  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);

  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename + ".csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 100);
}

function escapeCSVField(value) {
  if (value === null || value === undefined) {
    return "";
  }

  var str = String(value);

  if (str.indexOf(",") !== -1 || str.indexOf('"') !== -1 || str.indexOf("\n") !== -1) {
    return '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
}
