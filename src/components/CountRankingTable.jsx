// src/components/CountRankingTable.jsx

import React from 'react';

const CountRankingTable = ({ results }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white text-center mb-6">再生回数ランキング</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 sticky top-0 bg-gray-700">順位</th>
              <th scope="col" className="px-6 py-3 sticky top-0 bg-gray-700">名前</th>
              <th scope="col" className="px-6 py-3 sticky top-0 bg-gray-700">再生回数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {results.slice(0, 100).map((item, index) => (
              <tr key={`<span class="math-inline">\{item\.name\}\-</span>{index}-count`} className="hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.count.toLocaleString()} 回</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountRankingTable;
