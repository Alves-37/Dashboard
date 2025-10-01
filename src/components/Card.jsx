const Card = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      <div className={`${colorClasses[color]} text-white p-3 sm:p-4 rounded-lg text-2xl sm:text-3xl`}>
        {icon}
      </div>
      <div className="text-center sm:text-left">
        <p className="text-gray-500 text-xs sm:text-sm">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Card;
