import React, { useState, useEffect } from 'react';

// 必要なモジュールとコンポーネントをインポート
import { loadAndProcessFiles } from './dataLoader';
import { filterDataByPeriod } from './utils/timeFilter';
import { getRankingByPlaybackTime, getRankingByPlayCount, getTopNTimeTrend } from './analyzers';

import TimeRankingTable from './components/TimeRankingTable';
import CountRankingTable from './components/CountRankingTable';
import TopNTrendChart from './components/TopNTrendChart';
import DateRangeModal from './components/DateRangeModal';

function App() {
  // --- State定義 ---
  // 生データとUIの状態
  const [masterData, setMasterData] = useState([]);
  const [fileNames, setFileNames] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 分析条件のState
  const [groupBy, setGroupBy] = useState('artist'); // 全タブ共通の集計単位
  const [customStartDate, setCustomStartDate] = useState(new Date(2024, 5, 1)); // 2024年6月1日
  const [customEndDate, setCustomEndDate] = useState(new Date(2025, 5, 30));    // 2025年6月30日
  const [activeTab, setActiveTab] = useState('time');  // 表示中タブ
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 分析結果のState
  const [timeRankingResults, setTimeRankingResults] = useState([]);
  const [countRankingResults, setCountRankingResults] = useState([]);
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

  // データの最小日付・最大日付を計算
  const getDataDateRange = () => {
    if (masterData.length === 0) return { minDate: null, maxDate: null };
    const dates = masterData.map(item => new Date(item.ts));
    return {
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates))
    };
  };

  // カスタム期間の適用
  const handleCustomDateApply = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  // 日付のフォーマット
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // --- 分析実行の副作用フック ---
  useEffect(() => {
    if (masterData.length === 0) return;

    // 期間でデータをフィルタリング (カスタム期間で固定)
    const filteredData = filterDataByPeriod(masterData, 'custom', customStartDate, customEndDate);

    // 各タブ用の計算をそれぞれ実行
    setTimeRankingResults(getRankingByPlaybackTime(filteredData, groupBy));
    setCountRankingResults(getRankingByPlayCount(filteredData, groupBy));

    const { trendData: newTopNTrendData, keys: newTopNKeys } = getTopNTimeTrend(filteredData, groupBy, 5);
    setTopNTrendData(newTopNTrendData);
    setTopNKeys(newTopNKeys);

  }, [masterData, groupBy, customStartDate, customEndDate]); // 依存配列に全ての条件を追加

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
            {/* 共通コントロールエリア */}
            <div className="mb-8 bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
                <div className="control-group">
                  <label htmlFor="group-by-select" className="mr-2 text-sm font-medium text-gray-300">集計単位:</label>
                  <select
                    id="group-by-select"
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="artist">アーティスト</option>
                    <option value="track">曲</option>
                    <option value="album">アルバム</option>
                  </select>
                </div>
                <div className="control-group">
                  <label className="mr-2 text-sm font-medium text-gray-300">集計期間:</label>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {formatDate(customStartDate)} - {formatDate(customEndDate)}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <button onClick={() => setActiveTab('time')} className={`${ activeTab === 'time' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>再生時間ランキング</button>
                <button onClick={() => setActiveTab('count')} className={`${ activeTab === 'count' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>再生回数ランキング</button>
                <button onClick={() => setActiveTab('topNtrend')} className={`${ activeTab === 'topNtrend' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>トップ5推移</button>
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === 'time' && <TimeRankingTable results={timeRankingResults} />}
              {activeTab === 'count' && <CountRankingTable results={countRankingResults} />}
              {activeTab === 'topNtrend' && <TopNTrendChart data={topNTrendData} keys={topNKeys} />}
            </div>
          </div>
        </main>
      )}

      {/* DateRangeModal */}
      <DateRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleCustomDateApply}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
        minDate={getDataDateRange().minDate}
        maxDate={getDataDateRange().maxDate}
      />
    </div>
  );
}

export default App;
