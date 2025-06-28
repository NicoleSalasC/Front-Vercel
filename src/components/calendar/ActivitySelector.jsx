// ActivitySelector.jsx
import { Save } from "lucide-react";

const ActivitySelector = ({ start, end, activityType, setActivityType, saveSelection, hasEvents }) => (
  <div className="mb-4 flex gap-4 items-center flex-wrap">
    <div>
      <label className="block font-medium text-gray-800 dark:text-gray-200">Hora inicio:</label>
      <input className="border px-2 py-1 dark:bg-gray-700 dark:text-gray-200" value={start} readOnly />
    </div>
    <div>
      <label className="block font-medium text-gray-800 dark:text-gray-200">Hora fin:</label>
      <input className="border px-2 py-1 dark:bg-gray-700 dark:text-gray-200" value={end} readOnly />
    </div>
    <div>
      <label className="block font-medium text-gray-800 dark:text-gray-200">Actividad:</label>
      <select
        className="border px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
      >
        <option value="HC">HC</option>
        <option value="AE">AE</option>
        <option value="PYE">PYE</option>
        <option value="OI">OI</option>
      </select>
    </div>
    <button onClick={saveSelection} disabled={!hasEvents} className="ml-4 text-sm text-blue-700 dark:text-blue-400 hover:underline">
      <Save size={20} />
    </button>
  </div>
);

export default ActivitySelector;
