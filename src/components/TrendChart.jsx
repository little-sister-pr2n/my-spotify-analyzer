// src/components/TrendChart.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-400">表示するデータがありません。</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white text-center mb-6">日別 再生時間（分）</h2>
      {/* ResponsiveContainerでグラフのサイズを親要素に追従させる */}
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
            <YAxis stroke="#A0AEC0" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0' }}/>
            <Line type="monotone" dataKey="totalMinutes" name="再生時間 (分)" stroke="#4299E1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
