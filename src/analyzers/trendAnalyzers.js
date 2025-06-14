// src/analyzers/trendAnalyzers.js

/**
 * 日毎の総再生時間を計算し、グラフ用のデータ配列を返す
 * @param {Array} data - 期間でフィルタリング済みの再生履歴
 * @returns {Array<{date: string, totalMinutes: number}>}
 */
export function getPlaybackTimeTrendByDay(data) {
  const aggregation = new Map();
  data.forEach(item => {
    const date = new Date(item.ts).toISOString().split('T')[0];
    const msPlayed = item.ms_played || 0;
    if (!date) return;
    const currentMs = aggregation.get(date) || 0;
    aggregation.set(date, currentMs + msPlayed);
  });
  const sortedTrend = Array.from(aggregation.entries())
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, totalMs]) => ({
      date,
      totalMinutes: Math.round(totalMs / (1000 * 60)),
    }));
  return sortedTrend;
}

/**
 * 指定された期間のトップNアイテムの【累計】再生時間推移を計算する
 * @param {Array} data - 期間でフィルタリング済みの再生履歴
 * @param {string} groupBy - 'artist', 'track', 'album'
 * @param {number} topN - 上位何件を取得するか
 * @returns {{trendData: Array, keys: Array<string>}}
 */
export function getTopNTimeTrend(data, groupBy, topN = 5) {
  const keyMap = {
    artist: 'master_metadata_album_artist_name',
    track: 'master_metadata_track_name',
    album: 'master_metadata_album_album_name',
  };
  const groupKey = keyMap[groupBy];

  // Pass 1: トップNのリストを特定
  const rankingAggregation = new Map();
  data.forEach(item => {
    const name = item[groupKey];
    if (!name) return;
    const currentMs = rankingAggregation.get(name) || 0;
    rankingAggregation.set(name, currentMs + (item.ms_played || 0));
  });
  const topNKeys = Array.from(rankingAggregation.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(item => item[0]);

  // Pass 2: トップNだけの【日毎の】再生時間データを生成
  const dailyAggregation = new Map();
  const dataForTopN = data.filter(item => topNKeys.includes(item[groupKey]));
  dataForTopN.forEach(item => {
    const date = new Date(item.ts).toISOString().split('T')[0];
    const name = item[groupKey];
    const msPlayed = item.ms_played || 0;
    if (!dailyAggregation.has(date)) {
      dailyAggregation.set(date, { date });
    }
    const dayData = dailyAggregation.get(date);
    dayData[name] = (dayData[name] || 0) + msPlayed;
  });
  const dailyTrend = Array.from(dailyAggregation.values())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // ★★★ Pass 3: 日毎のデータを【累計】に変換 ★★★
  const runningTotals = {};
  topNKeys.forEach(key => {
    runningTotals[key] = 0;
  });

  const cumulativeTrend = dailyTrend.map(dayData => {
    const cumulativeDayData = { date: dayData.date };
    for (const key of topNKeys) {
      if (dayData[key]) {
        runningTotals[key] += dayData[key];
      }
      // グラフで見やすいように分単位に変換
      cumulativeDayData[key] = Math.round(runningTotals[key] / (1000 * 60));
    }
    return cumulativeDayData;
  });

  return { trendData: cumulativeTrend, keys: topNKeys };
}
