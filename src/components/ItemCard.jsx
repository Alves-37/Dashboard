const ItemCard = ({ children, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default ItemCard;
