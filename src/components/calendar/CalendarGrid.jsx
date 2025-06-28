// CalendarGrid.jsx
const CalendarGrid = ({ days, hours, getCellClass, handleMouseDown, handleMouseEnter }) => (
  <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1">
    {days.map((_, dayIndex) => (
      <div key={dayIndex} className="flex flex-col">
        {hours.map((hour, hourIndex) => (
          dayIndex === 0 ? (
            <div key={hourIndex} className="border h-8 flex items-center justify-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 select-none">
              {hour}
            </div>
          ) : (
            <div
              key={hourIndex}
              className={`border h-8 flex items-center justify-center text-sm cursor-pointer select-none ${getCellClass(dayIndex, hourIndex)}`}
              onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
              onMouseEnter={() => handleMouseEnter(dayIndex, hourIndex)}
            />
          )
        ))}
      </div>
    ))}
  </div>
);

export default CalendarGrid;
