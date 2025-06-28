import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportExcel = ({ profesor, savedSelections }) => {
  
  const exportToExcel = () => {
    // Creamos los datos a exportar
    const data = savedSelections.map((sel) => ({
      Profesor: profesor,
      Día: sel.dayLabel,
      "Hora Inicio": sel.startTime,
      "Hora Fin": sel.endTime,
      Actividad: sel.activity
    }));

    // Creamos un workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Declaracion");

    // Guardamos el archivo
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "declaracion_completa.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
    >
      📄 Exportar a Excel
    </button>
  );
};

export default ExportExcel;
