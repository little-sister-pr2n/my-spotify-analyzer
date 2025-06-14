// src/analyzers/timeAnalyzers.js

/**
 * 時間帯別の再生回数を計算する
 * @param {Array} data - 再生履歴データ
 * @returns {Object} - キーが時間(0-23)、値が再生回数のオブジェクト
 */
export function calculatePlaybackByHour(data) {
  const hourCounts = new Array(24).fill(0); // 0時から23時までの配列を0で初期化
  data.forEach(item => {
    const date = new Date(item.ts);
    const hour = date.getHours(); // UTCからローカルタイムゾーンの時間に変換
    if (!isNaN(hour)) {
      hourCounts[hour]++;
    }
  });
  return hourCounts;
}

// 他にも、曜日別、月別などの関数をここに追加していく
