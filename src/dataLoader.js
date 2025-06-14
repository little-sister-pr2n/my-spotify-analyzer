// src/dataLoader.js

// 保持したいカラムのリスト
const RETAINED_COLUMNS = [
  'ts', 'platform', 'ms_played', 'conn_country', 'ip_addr',
  'master_metadata_track_name', 'master_metadata_album_artist_name',
  'master_metadata_album_album_name', 'spotify_track_uri',
  'reason_start', 'reason_end', 'shuffle', 'skipped', 'offline',
  'offline_timestamp'
];

/**
 * 1つのレコードから不要なカラムを削除し、データをクリーンにする
 * @param {object} record - 1つの再生履歴
 * @returns {object} - 必要なカラムのみに絞られた再生履歴
 */
const cleanRecord = (record) => {
  const newRecord = {};
  for (const col of RETAINED_COLUMNS) {
    newRecord[col] = record[col];
  }
  return newRecord;
};

/**
 * ユーザーが選択した複数のファイル（FileList）を読み込み、
 * １つの再生履歴配列に統合・前処理して返す。
 * @param {FileList} files - input要素から取得したファイルのリスト
 * @returns {Promise<Array>} - 統合・クリーン化された再生履歴の配列
 */
export const loadAndProcessFiles = async (files) => {
  // 各ファイルの読み込み処理をプロミスの配列にする
  const readPromises = Array.from(files).map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          // 各ファイルが配列であることを確認
          if (Array.isArray(data)) {
            resolve(data);
          } else {
            // 不正なファイル形式の場合は空の配列を返す
            console.warn(`File ${file.name} is not a valid JSON array.`);
            resolve([]); 
          }
        } catch (err) {
          console.error(`Error parsing ${file.name}:`, err);
          reject(new Error(`Failed to parse ${file.name}`));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  });

  // 全てのファイルの読み込みとパースが完了するのを待つ
  const allFilesData = await Promise.all(readPromises);

  // 全ての配列を１つに結合し、各レコードをクリーンにする
  const combinedData = allFilesData.flat().map(cleanRecord);

  // タイムスタンプでソートしておく（時系列処理に便利）
  combinedData.sort((a, b) => new Date(a.ts) - new Date(b.ts));
  
  return combinedData;
};
