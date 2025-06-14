// src/components/TopNTrendChart.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// グラフの線の色を定義
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const TopNTrendChart = ({ data, keys }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-400">表示するデータがありません。</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white text-center mb-6">トップ5 再生時間推移（分）</h2>
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
            
            {/* keys配列を元に、動的に複数のLineコンポーネントを生成 */}
            {keys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={COLORS[index % COLORS.length]} // 色を順番に割り当て
                strokeWidth={2} 
                dot={false}
              />
            ))}

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopNTrendChart;
