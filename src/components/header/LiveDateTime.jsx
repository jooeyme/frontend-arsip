import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale"; 

const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-md text-gray-900 dark:text-white">
      {format(dateTime, "eeee, dd MMMM yyyy - HH:mm:ss", { locale: id })}
    </div>
  );
};

export default LiveDateTime;
