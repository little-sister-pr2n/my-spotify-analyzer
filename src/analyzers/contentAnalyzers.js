// src/analyzers/contentAnalyzers.js

/**
 * 再生回数トップNのアーティストを計算する
 * @param {Array} data - 再生履歴データ
 * @param {number} count - 上位何件を取得するか
 * @returns {Array<{name: string, count: number}>}
 */
export function calculateTopArtists(data, count) {
  const artistCounts = data.reduce((acc, item) => {
    const artistName = item.master_metadata_album_artist_name;
    if (artistName) {
      acc[artistName] = (acc[artistName] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, count]) => ({ name, count }));
}

// 他にも、トップトラック、トップアルバムなどの関数をここに追加していく
