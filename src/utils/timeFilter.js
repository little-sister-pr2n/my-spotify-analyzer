// src/utils/timeFilter.js

/**
 * 再生履歴データを指定された期間でフィルタリングする
 * @param {Array} data - 全ての再生履歴データ
 * @param {string} period - "all", "last7days", "last30days", "last3months", "last1year", "custom" などの期間指定文字列
 * @param {Date|null} customStartDate - カスタム期間の開始日
 * @param {Date|null} customEndDate - カスタム期間の終了日
 * @returns {Array} - フィルタリングされた再生履歴データ
 */
export function filterDataByPeriod(data, period, customStartDate = null, customEndDate = null) {
  if (period === "all") {
    return data; // 'all'の場合は全てのデータを返す
  }

  // カスタム期間の場合
  if (period === "custom" && customStartDate && customEndDate) {
    return data.filter(item => {
      const itemDate = new Date(item.ts);
      // 開始日の00:00:00から終了日の23:59:59までを含む
      const startOfDay = new Date(customStartDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(customEndDate);
      endOfDay.setHours(23, 59, 59, 999);

      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  }

  const now = new Date();
  const targetDate = new Date();

  switch (period) {
    case "last7days":
      targetDate.setDate(now.getDate() - 7);
      break;
    case "last30days":
      targetDate.setDate(now.getDate() - 30);
      break;
    case "last3months":
      targetDate.setMonth(now.getMonth() - 3);
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
