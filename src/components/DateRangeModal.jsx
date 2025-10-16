import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangeModal.css';

function DateRangeModal({ isOpen, onClose, onApply, initialStartDate, initialEndDate, minDate, maxDate }) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  if (!isOpen) return null;

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
      onClose();
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // カスタムヘッダーコンポーネント
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    decreaseYear,
    increaseYear,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const months = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    const year = date.getFullYear();
    const month = months[date.getMonth()];

    return (
      <div className="flex items-center justify-between px-2 py-2">
        <button
          onClick={decreaseYear}
          className="text-gray-300 hover:text-white px-2 py-1 text-lg font-bold"
          type="button"
        >
          {'<<'}
        </button>
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="text-gray-300 hover:text-white px-2 py-1 disabled:text-gray-600"
          type="button"
        >
          {'<'}
        </button>
        <span className="text-gray-100 font-semibold text-base">
          {year}年 {month}
        </span>
        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="text-gray-300 hover:text-white px-2 py-1 disabled:text-gray-600"
          type="button"
        >
          {'>'}
        </button>
        <button
          onClick={increaseYear}
          className="text-gray-300 hover:text-white px-2 py-1 text-lg font-bold"
          type="button"
        >
          {'>>'}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">期間をカスタム選択</h2>

        <div className="flex justify-center mb-6">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="yyyy/MM/dd"
            renderCustomHeader={CustomHeader}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateRangeModal;
