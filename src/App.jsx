import React, { useState, useEffect } from 'react';

// 必要なモジュールとコンポーネントをインポート
import { loadAndProcessFiles } from './dataLoader';
import { filterDataByPeriod } from './utils/timeFilter';
import { getRankingByPlaybackTime, getRankingByPlayCount, getPlaybackTimeTrendByDay, getTopNTimeTrend } from './analyzers';

import TimeRankingTable from './components/TimeRankingTable';
import CountRankingTable from './components/CountRankingTable';
import TrendChart from './components/TrendChart';
import TopNTrendChart from './components/TopNTrendChart';

function App() {
  // --- State定義 ---
  // 生データとUIの状態
  const [masterData, setMasterData] = useState([]);
  const [fileNames, setFileNames] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 分析条件のState
  const [groupBy, setGroupBy] = useState('artist'); // ランキングタブ用
  const [period, setPeriod] = useState('all');       // 全タブ共通の期間
  const [activeTab, setActiveTab] = useState('time');  // 表示中タブ
  const [topNGroupBy, setTopNGroupBy] = useState('artist'); // トップ5推移タブ用

  // 分析結果のState
  const [timeRankingResults, setTimeRankingResults] = useState([]);
  const [countRankingResults, setCountRankingResults] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [topNTrendData, setTopNTrendData] = useState([]);
  const [topNKeys, setTopNKeys] = useState([]);

  // --- ファイル読み込み処理 ---
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setFileNames(Array.from(files).map(f => f.name).join(', '));
    setMasterData([]);
    setTimeRankingResults([]);
    setCountRankingResults([]);
    setTrendData([]);
    setTopNTrendData([]);
    setTopNKeys([]);
    setError('');

    try {
      const data = await loadAndProcessFiles(files);
      setMasterData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 分析実行の副作用フック ---
  useEffect(() => {
    if (masterData.length === 0) return;
    
    // 期間でデータをフィルタリング (全ての分析で共通)
    const filteredData = filterDataByPeriod(masterData, period);

    // 各タブ用の計算をそれぞれ実行
    setTimeRankingResults(getRankingByPlaybackTime(filteredData, groupBy));
    setCountRankingResults(getRankingByPlayCount(filteredData, groupBy));
    setTrendData(getPlaybackTimeTrendByDay(filteredData));

    const { trendData: newTopNTrendData, keys: newTopNKeys } = getTopNTimeTrend(filteredData, topNGroupBy, 5);
    setTopNTrendData(newTopNTrendData);
    setTopNKeys(newTopNKeys);

  }, [masterData, period, groupBy, topNGroupBy]); // 依存配列に全ての条件を追加

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl font-bold text-white">Spotify 再生履歴アナライザー</h1>
        <p className="text-gray-400 mt-2">複数選択可能です。`StreamingHistory...json` ファイルをアップロードしてください。</p>
        
        <div className="mt-6">
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            multiple 
            disabled={isLoading}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        {isLoading && <p className="mt-4">読み込み中...</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
        {fileNames && !error && <p className="mt-2 text-sm text-gray-500">読み込みファイル: <strong>{fileNames}</strong></p>}
      </header>

      {masterData.length > 0 && (
        <main className="px-4 md:px-8 lg:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <button onClick={() => setActiveTab('time')} className={`${ activeTab === 'time' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>再生時間ランキング</button>
                <button onClick={() => setActiveTab('count')} className={`${ activeTab === 'count' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>再生回数ランキング</button>
                <button onClick={() => setActiveTab('trend')} className={`${ activeTab === 'trend' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>全体推移グラフ</button>
                <button onClick={() => setActiveTab('topNtrend')} className={`${ activeTab === 'topNtrend' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>トップ5推移</button>
              </nav>
            </div>

            <div className="mt-6">
              {(activeTab === 'time' || activeTab === 'count') && (
                <div>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-6 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="control-group">
                      <label htmlFor="group-by-select" className="mr-2 text-sm font-medium text-gray-300">集計単位:</label>
                      <select id="group-by-select" value={groupBy} onChange={e => setGroupBy(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="artist">アーティスト</option>
                        <option value="track">曲</option>
                        <option value="album">アルバム</option>
                      </select>
                    </div>
                    <div className="control-group">
                      <label htmlFor="period-select" className="mr-2 text-sm font-medium text-gray-300">集計期間:</label>
                      <select id="period-select" value={period} onChange={e => setPeriod(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">全期間</option>
                        <option value="last4weeks">直近4週間</option>
                        <option value="last6months">直近6ヶ月</option>
                        <option value="last1year">直近1年</option>
                      </select>
                    </div>
                  </div>
                  {activeTab === 'time' && <TimeRankingTable results={timeRankingResults} />}
                  {activeTab === 'count' && <CountRankingTable results={countRankingResults} />}
                </div>
              )}

              {activeTab === 'trend' && (
                <div>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-6 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                     <div className="control-group">
                      <label htmlFor="period-select-graph" className="mr-2 text-sm font-medium text-gray-300">集計期間:</label>
                      <select id="period-select-graph" value={period} onChange={e => setPeriod(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">全期間</option>
                        <option value="last4weeks">直近4週間</option>
                        <option value="last6months">直近6ヶ月</option>
                        <option value="last1year">直近1年</option>
                      </select>
                    </div>
                  </div>
                  <TrendChart data={trendData} />
                </div>
              )}

              {activeTab === 'topNtrend' && (
                <div>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-6 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="control-group">
                      <label htmlFor="topN-group-by-select" className="mr-2 text-sm font-medium text-gray-300">トップ5対象:</label>
                      <select id="topN-group-by-select" value={topNGroupBy} onChange={e => setTopNGroupBy(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="artist">アーティスト</option>
                        <option value="track">曲</option>
                        <option value="album">アルバム</option>
                      </select>
                    </div>
                    <div className="control-group">
                      <label htmlFor="period-select-topN" className="mr-2 text-sm font-medium text-gray-300">集計期間:</label>
                      <select id="period-select-topN" value={period} onChange={e => setPeriod(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">全期間</option>
                        <option value="last4weeks">直近4週間</option>
                        <option value="last6months">直近6ヶ月</option>
                        <option value="last1year">直近1年</option>
                      </select>
                    </div>
                  </div>
                  <TopNTrendChart data={topNTrendData} keys={topNKeys} />
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
