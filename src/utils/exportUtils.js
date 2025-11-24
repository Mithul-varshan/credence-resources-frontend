import { saveAs } from "file-saver";

export const exportToCSV = (data, filename = "sales_report.csv") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Define headers
  const headers = [
    "ID",
    "Invoice Date",
    "PO Number",
    "PO Date",
    "Quantity",
    "Rate (USD)",
    "Amount (USD)",
    "FIRC Number",
    "FIRC Date",
    "Containers",
    "Inward Amount",
    "Exchange Rate",
    "INR Value",
    "Balance",
    "Shipping Bill",
    "Shipping Date",
    "Vessel Name",
    "Bill Number",
    "Board Date",
  ];

  // Format data rows
  const rows = data.map((report) => [
    report.id,
    formatDate(report.invoice_date),
    report.purchase_order_number || "",
    formatDate(report.purchase_order_date),
    report.qty || "0",
    report.rate_in_usd || "0",
    report.amount_in_usd || "0",
    report.firc_number || "",
    formatDate(report.firc_date),
    report.no_of_containers_bulk || "0",
    report.inward_amount || "0",
    report.exchange_rate || "0",
    report.inr_value || "0",
    report.balance || "0",
    report.shipping_bill_number || "",
    formatDate(report.shipping_bill_date),
    report.vessel_name || "",
    report.bill_number || "",
    formatDate(report.shipped_on_board_date),
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

export const exportToExcel = (data, filename = "sales_report.xlsx") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // For Excel export, we'll create an HTML table that Excel can open
  const headers = [
    "ID",
    "Invoice Date",
    "PO Number",
    "PO Date",
    "Quantity",
    "Rate (USD)",
    "Amount (USD)",
    "FIRC Number",
    "FIRC Date",
    "Containers",
    "Inward Amount",
    "Exchange Rate",
    "INR Value",
    "Balance",
    "Shipping Bill",
    "Shipping Date",
    "Vessel Name",
    "Bill Number",
    "Board Date",
  ];

  let html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html +=
    "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>";
  html += "<x:Name>Sales Report</x:Name>";
  html +=
    "<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>";
  html += '<body><table border="1">';
  html +=
    '<thead><tr style="background-color: #4472C4; color: white; font-weight: bold;">';
  html += headers.map((h) => `<th>${h}</th>`).join("");
  html += "</tr></thead><tbody>";

  data.forEach((report) => {
    html += "<tr>";
    html += `<td>${report.id}</td>`;
    html += `<td>${formatDate(report.invoice_date)}</td>`;
    html += `<td>${report.purchase_order_number || ""}</td>`;
    html += `<td>${formatDate(report.purchase_order_date)}</td>`;
    html += `<td>${report.qty || "0"}</td>`;
    html += `<td>${report.rate_in_usd || "0"}</td>`;
    html += `<td>${report.amount_in_usd || "0"}</td>`;
    html += `<td>${report.firc_number || ""}</td>`;
    html += `<td>${formatDate(report.firc_date)}</td>`;
    html += `<td>${report.no_of_containers_bulk || "0"}</td>`;
    html += `<td>${report.inward_amount || "0"}</td>`;
    html += `<td>${report.exchange_rate || "0"}</td>`;
    html += `<td>${report.inr_value || "0"}</td>`;
    html += `<td>${report.balance || "0"}</td>`;
    html += `<td>${report.shipping_bill_number || ""}</td>`;
    html += `<td>${formatDate(report.shipping_bill_date)}</td>`;
    html += `<td>${report.vessel_name || ""}</td>`;
    html += `<td>${report.bill_number || ""}</td>`;
    html += `<td>${formatDate(report.shipped_on_board_date)}</td>`;
    html += "</tr>";
  });

  html += "</tbody></table></body></html>";

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  saveAs(blob, filename);
};

export const exportToPDF = async (data, filename = "sales_report.pdf") => {
  // This is a simple implementation. For production, use a library like jsPDF
  alert(
    "PDF export will be available soon. Please use CSV or Excel export for now."
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
