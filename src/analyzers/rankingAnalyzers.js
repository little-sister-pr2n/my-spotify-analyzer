// src/analyzers/rankingAnalyzers.js

/**
 * 再生時間に基づいたランキングを計算する
 * @param {Array} data - 期間でフィルタリング済みのデータ
 * @param {string} groupBy - 'artist', 'track', 'album' のいずれか
 * @returns {Array<{name: string, totalMs: number}>} - ランキング結果
 */
export function getRankingByPlaybackTime(data, groupBy) {
  const keyMap = {
    artist: 'master_metadata_album_artist_name',
    track: 'master_metadata_track_name',
    album: 'master_metadata_album_album_name',
  };
  const groupKey = keyMap[groupBy];

  const aggregation = new Map();

  data.forEach(item => {
    const name = item[groupKey];
    const msPlayed = item.ms_played || 0;

    // 名前が存在しないデータはスキップ
    if (!name) return;

    // Mapに既にあれば加算、なければ初期値を設定
    const currentMs = aggregation.get(name) || 0;
    aggregation.set(name, currentMs + msPlayed);
  });

  // Mapを配列に変換し、再生時間でソート
  const sortedRanking = Array.from(aggregation.entries())
    .map(([name, totalMs]) => ({ name, totalMs }))
    .sort((a, b) => b.totalMs - a.totalMs);

  return sortedRanking;
}

/**
 * 再生回数に基づいたランキングを計算する
 * @param {Array} data - 期間でフィルタリング済みのデータ
 * @param {string} groupBy - 'artist', 'track', 'album' のいずれか
 * @returns {Array<{name: string, count: number}>} - ランキング結果
 */
export function getRankingByPlayCount(data, groupBy) {
  const keyMap = {
    artist: 'master_metadata_album_artist_name',
    track: 'master_metadata_track_name',
    album: 'master_metadata_album_album_name',
  };
  const groupKey = keyMap[groupBy];

  const aggregation = new Map();

  // 再生時間が10秒(10000ms)より大きいものだけを対象にする
  const validPlays = data.filter(item => item.ms_played > 10000);

  validPlays.forEach(item => {
    const name = item[groupKey];
    if (!name) return;

    // Mapに既にあればカウントを+1、なければ初期値を1に設定
    const currentCount = aggregation.get(name) || 0;
    aggregation.set(name, currentCount + 1);
  });

  // Mapを配列に変換し、再生回数でソート
  const sortedRanking = Array.from(aggregation.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return sortedRanking;
}
