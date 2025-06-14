// src/components/TimeRankingTable.jsx

import React from 'react';

// App.jsxから持ってきたヘルパー関数
const formatMs = (ms) => {
  if (!ms || ms < 0) return '0秒';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let result = '';
  if (hours > 0) result += `${hours}時間 `;
  if (minutes > 0) result += `${minutes}分 `;
  if (seconds > 0 || result === '') result += `${seconds}秒`;
  return result.trim();
};

const TimeRankingTable = ({ results }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white text-center mb-6">再生時間ランキング</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 sticky top-0 bg-gray-700">順位</th>
              <th scope="col" className="px-6 py-3 sticky top-0 bg-gray-700">名前</th>
              <th scope="col" className="px-6 py-3 sticky top-0 bg-gray-700">合計再生時間</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {results.slice(0, 100).map((item, index) => (
              <tr key={`<span class="math-inline">\{item\.name\}\-</span>{index}-time`} className="hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatMs(item.totalMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeRankingTable;
