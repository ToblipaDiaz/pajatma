import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { isSameMonth } from 'date-fns';

interface MonthHeaderProps {
  months: Date[];
  days: Date[];
}

export const MonthHeader: React.FC<MonthHeaderProps> = ({ months, days }) => {
  const cells: React.ReactNode[] = [];
  let currentMonthStart = 0;

  months.forEach((month) => {
    const daysInThisMonth = days.filter(day => isSameMonth(day, month)).length;
    cells.push(
      <div
        key={month.toISOString()}
        className="border-l border-gray-200 bg-gray-50 text-center text-sm font-medium py-2"
        style={{ 
          gridColumn: `${currentMonthStart + 2} / span ${daysInThisMonth}`,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        {format(month, 'MMMM yyyy', { locale: es })}
      </div>
    );
    currentMonthStart += daysInThisMonth;
  });

  return <>{cells}</>;
};