import React, { useState, useEffect } from 'react';
import VoiceCommand from '../VoiceCommand';
import ExportExcel from "../ExportExcel";
import ExportExcelConPlantilla from "../ExportExcelConPlantilla";
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import ActivitySelector from './ActivitySelector';
import ActivityProgressBars from './ActivityProgressBars';
import SavedSelectionsList from './SavedSelectionsList';

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const days = [' ', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const Calendar = () => {
  const maxHoursPerDay = 10;
  const maxPerActivity = { HC: 16, AE: 8, PYE: 16, OI: 40 };
  const [events, setEvents] = useState([]);
  const [selectionDay, setSelectionDay] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activityType, setActivityType] = useState('HC');
  const [savedSelections, setSavedSelections] = useState([]);
  const [totalHours, setTotalHours] = useState(40);

  const procesarComando = (transcript) => {
    const dias = { lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábado: 6 };
    const actividades = ["hc", "ae", "pye", "oi"];

    let diaEncontrado = Object.keys(dias).find(dia => transcript.includes(dia));
    let actividadEncontrada = actividades.find(act => transcript.includes(act));
    const horas = transcript.match(/de (\d{1,2}) a (\d{1,2})/);

    if (diaEncontrado && horas && actividadEncontrada) {
      const inicio = parseInt(horas[1]);
      const fin = parseInt(horas[2]);
      if (inicio >= fin) {
        alert("La hora de inicio debe ser menor a la de fin.");
        return;
      }
      registrarHorarioPorVoz(dias[diaEncontrado], inicio, fin, actividadEncontrada.toUpperCase());
    } else {
      alert("No se pudo interpretar el comando. Intenta decir: 'Registra horario para el lunes de 9 a 12 en HC'");
    }
  };

  const registrarHorarioPorVoz = (dayIndex, startHour, endHour, activity) => {
    const startIndex = (startHour - 7) * 2;
    const endIndex = (endHour - 7) * 2;

    const nuevosBloques = [];
    for (let i = startIndex; i < endIndex; i++) {
      nuevosBloques.push({ day: dayIndex, hour: i, activity });
    }
    setSelectionDay(dayIndex);
    setActivityType(activity);
    setEvents(prev => [...prev, ...nuevosBloques]);
  };

  useEffect(() => {
    const storedSelections = localStorage.getItem('calendarSelections');
    if (storedSelections) {
      setSavedSelections(JSON.parse(storedSelections));
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEvents([]);
        setSelectionDay(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isContiguous = (newHourIndex) => {
    const selectedHours = events.map(e => e.hour).sort((a, b) => a - b);
    if (selectedHours.length === 0) return true;
    return Math.abs(newHourIndex - selectedHours[selectedHours.length - 1]) === 1;
  };

  const toggleEvent = (dayIndex, hourIndex) => {
    const existing = events.find(e => e.day === dayIndex && e.hour === hourIndex);
    if (existing) {
      const updatedEvents = events.filter(e => !(e.day === dayIndex && e.hour === hourIndex));
      setEvents(updatedEvents);
      if (updatedEvents.length === 0) setSelectionDay(null);
    } else {
      setEvents([...events, { day: dayIndex, hour: hourIndex, activity: activityType }]);
    }
  };

  const handleMouseDown = (dayIndex, hourIndex) => {
    if (dayIndex === 0) return;
    const isBlocked = savedSelections.some(sel => sel.day === dayIndex && sel.blocks.some(b => b.hour === hourIndex));
    if (isBlocked) return;
    setEvents([{ day: dayIndex, hour: hourIndex, activity: activityType }]);
    setSelectionDay(dayIndex);
    setIsDragging(true);
  };

  const handleMouseEnter = (dayIndex, hourIndex) => {
    if (dayIndex === 0) return;
    if (isDragging && selectionDay === dayIndex && isContiguous(hourIndex)) {
      toggleEvent(dayIndex, hourIndex);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'AE': return 'bg-blue-300 text-black';
      case 'HC': return 'bg-blue-600 text-white';
      case 'PYE': return 'bg-sky-500 text-black';
      case 'OI': return 'bg-amber-300 text-black';
      default: return 'bg-gray-200';
    }
  };

  const getCellClass = (dayIndex, hourIndex) => {
    const current = events.find(e => e.day === dayIndex && e.hour === hourIndex);
    if (current) return getActivityColor(current.activity);
    const saved = savedSelections.find(sel => sel.day === dayIndex && sel.blocks.some(b => b.hour === hourIndex));
    if (saved) return getActivityColor(saved.activity);
    return 'bg-white dark:bg-gray-800';
  };

  const getTimeRange = () => {
    if (events.length === 0) return { start: '', end: '' };
    const sorted = [...events].sort((a, b) => a.hour - b.hour);
    return {
      start: hours[sorted[0].hour],
      end: hours[sorted[sorted.length - 1].hour]
    };
  };

  const deleteSelection = (index) => {
    const updated = savedSelections.filter((_, i) => i !== index);
    setSavedSelections(updated);
    localStorage.setItem('calendarSelections', JSON.stringify(updated));
  };

  const saveSelection = () => {
    if (events.length === 0) return;
    const dayBlockCount = savedSelections.filter(sel => sel.day === selectionDay).reduce((sum, sel) => sum + sel.blocks.length, 0) + events.length;
    if (dayBlockCount > maxHoursPerDay * 2) {
      alert(`No puede superar las ${maxHoursPerDay} horas permitidas por día.`);
      return;
    }
    const currentActivityCount = savedSelections.filter(sel => sel.activity === activityType).reduce((sum, sel) => sum + sel.blocks.length, 0) + events.length;
    if (currentActivityCount > maxPerActivity[activityType]) {
      alert(`No puede superar el máximo permitido de ${maxPerActivity[activityType] / 2} horas para la actividad ${activityType}.`);
      return;
    }
    const totalSelectedHours = savedSelections.reduce((sum, sel) => sum + sel.blocks.length, 0) + events.length;
    if (totalSelectedHours > totalHours) {
      alert(`No puede superar el máximo de ${totalHours} horas asignadas.`);
      return;
    }
    const selection = {
      day: selectionDay,
      dayLabel: days[selectionDay],
      startTime: getTimeRange().start,
      endTime: getTimeRange().end,
      activity: activityType,
      blocks: [...events]
    };
    const newSelections = [...savedSelections, selection];
    setSavedSelections(newSelections);
    localStorage.setItem('calendarSelections', JSON.stringify(newSelections));
    setEvents([]);
    setSelectionDay(null);
  };

  const { start, end } = getTimeRange();

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" onMouseUp={handleMouseUp}>
      <VoiceCommand onVoiceCommand={procesarComando} />
      <ExportExcel profesor={"Juan Gamboa"} savedSelections={savedSelections} />
      <ExportExcelConPlantilla profesor="Juan Gamboa Abarca" correo="juan@ejemplo.com" savedSelections={savedSelections} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div>
          <CalendarHeader days={days} />
          <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1">
            {days.map((_, dayIndex) => (
              <div key={dayIndex} className="text-center text-xs text-gray-600 dark:text-gray-400 p-1 border-t">
                {dayIndex === 0 ? '' : (() => {
                  const blocksUsed = savedSelections.filter(sel => sel.day === dayIndex).reduce((sum, sel) => sum + sel.blocks.length, 0);
                  const hoursUsed = Math.floor(blocksUsed / 2);
                  const percent = Math.floor((blocksUsed / (maxHoursPerDay * 2)) * 100);
                  return `${hoursUsed}h / ${maxHoursPerDay}h (${percent}%)`;
                })()}
              </div>
            ))}
          </div>
          <CalendarGrid
            days={days}
            hours={hours}
            getCellClass={getCellClass}
            handleMouseDown={handleMouseDown}
            handleMouseEnter={handleMouseEnter}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <ActivitySelector
            start={start}
            end={end}
            activityType={activityType}
            setActivityType={setActivityType}
            saveSelection={saveSelection}
            hasEvents={events.length > 0}
          />
          <ActivityProgressBars
            maxPerActivity={maxPerActivity}
            savedSelections={savedSelections}
            getActivityColor={getActivityColor}
          />
          <SavedSelectionsList
            savedSelections={savedSelections}
            deleteSelection={deleteSelection}
            totalHours={totalHours}
            getActivityColor={getActivityColor}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
