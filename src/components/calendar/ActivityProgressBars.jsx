// ActivityProgressBars.jsx
const ActivityProgressBars = ({ maxPerActivity, savedSelections, getActivityColor }) => (
  <div className="space-y-2 mb-4">
    {Object.entries(maxPerActivity).map(([key, max]) => {
      const used = savedSelections
        .filter(sel => sel.activity === key)
        .reduce((sum, sel) => sum + sel.blocks.length, 0);
      const percent = (used / max) * 100;
      return (
        <div key={key}>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{key}: {Math.floor(used / 2)} / {max / 2} horas</div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <div className={`${getActivityColor(key)} h-full`} style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      );
    })}
  </div>
);

export default ActivityProgressBars;
