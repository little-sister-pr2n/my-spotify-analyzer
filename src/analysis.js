// src/analysis.js

// analyzersディレクトリの窓口(index.js)から、全ての分析関数をまとめてインポート
import * as Analyzers from './analyzers';

/**
 * 再生履歴データの配列を受け取り、分析結果のオブジェクトを返すメイン関数
 * @param {Array} data - Spotifyの再生履歴データ
 * @returns {{stats: object, error: string|null}} - 分析結果とエラー情報
 */
export const performAnalysis = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { stats: null, error: "エラー: JSONファイルに再生履歴データが含まれていないようです。" };
  }

  // --- ここで、インポートした各分析器を呼び出す ---
  const totalTracks = data.length;
  const totalHoursPlayed = (data.reduce((sum, item) => sum + (item.ms_played || 0), 0) / (1000 * 60 * 60)).toFixed(2);
  const top10Artists = Analyzers.calculateTopArtists(data, 10);
  const playbackByHour = Analyzers.calculatePlaybackByHour(data);

  // 分析結果を一つのオブジェクトにまとめる
  const stats = {
    totalTracks,
    totalHoursPlayed,
    top10Artists,
    playbackByHour,
  };

  return { stats, error: null };
};
