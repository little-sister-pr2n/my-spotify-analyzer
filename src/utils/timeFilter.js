// src/utils/timeFilter.js

/**
 * 再生履歴データを指定された期間でフィルタリングする
 * @param {Array} data - 全ての再生履歴データ
 * @param {string} period - "all", "last4weeks", "last6months", "last1year" などの期間指定文字列
 * @returns {Array} - フィルタリングされた再生履歴データ
 */
export function filterDataByPeriod(data, period) {
  if (period === "all") {
    return data; // 'all'の場合は全てのデータを返す
  }

  const now = new Date();
  const targetDate = new Date();

  switch (period) {
    case "last4weeks":
      targetDate.setDate(now.getDate() - 28);
      break;
    case "last6months":
      targetDate.setMonth(now.getMonth() - 6);
      break;
    case "last1year":
      targetDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return data;
  }

  // targetDate以降のデータのみを抽出
  return data.filter(item => new Date(item.ts) >= targetDate);
}
