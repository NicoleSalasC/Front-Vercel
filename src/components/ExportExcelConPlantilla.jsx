import React from "react";

const ExportExcelConPlantilla = ({ profesor, correo, savedSelections }) => {
    
 const API_URL = import.meta.env.VITE_API_URL;
 const convertirHoraAMPM = (horaString) => {
    let [h, m] = horaString.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12; // 0 debería ser 12
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const sumar30Minutos = (horaString) => {
    let [h, m] = horaString.split(":" ).map(Number);
    m += 30;
    if (m >= 60) {
      m = m - 60;
      h = h + 1;
    }
    return `${h}:${m.toString().padStart(2, '0')}`;
  };
  

  const exportToExcel = async () => {
    try {
        const processedSelections = savedSelections.map(sel => {
            const endSumado = sumar30Minutos(sel.endTime);
            return {
              ...sel,
              startTimeDecimal: convertirHoraAMPM(sel.startTime),
              endTimeDecimal: convertirHoraAMPM(endSumado)
            };
          });
      console.log(processedSelections)
      const response = await fetch(`${API_URL}/reportes/generar-declaracion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profesor, correo, savedSelections: processedSelections }),
      });

      if (!response.ok) throw new Error("Error generando el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "declaracion_completa.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error("Error exportando Excel:", error);
      alert("Error generando el archivo.");
    }
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
    >
      📄 Exportar Declaración
    </button>
  );
};

export default ExportExcelConPlantilla;
