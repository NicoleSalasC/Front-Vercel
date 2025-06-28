// CalendarHeader.jsx
const CalendarHeader = ({ days }) => (
  <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1">
    {days.map((day, index) => (
      <div
        key={index}
        className="text-center font-semibold p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {day}
      </div>
    ))}
  </div>
);

export default CalendarHeader;
