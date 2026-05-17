// JSONCからコメントを除去する関数
function stripJSONComments(jsoncString) {
    // 単一行コメント（//...）を正規表現で削除
    return jsoncString.replace(/\/\/.*$/gm, '')
}

async function loadData() {
    try {
        const response = await fetch('./data/data.jsonc?v=' + new Date().getTime());
        const jsoncText = await response.text();

        // コメントを消してパース
        const cleanJsonText = stripJSONComments(jsoncText);
        const data = JSON.parse(cleanJsonText);

        // 表示処理
        // 消化試合数
        document.getElementById('digest_game_number1').textContent = data.digest_game_number
        document.getElementById('digest_game_number2').textContent = data.digest_game_number
        document.getElementById('digest_game_number3').textContent = data.digest_game_number
        document.getElementById('digest_game_number4').textContent = data.digest_game_number
        // ランキング1位のチームの成績
        document.getElementById('rank1_tn').textContent = data.rank1_tn;
        document.getElementById('rank1_pt').textContent = data.rank1_pt;
        document.getElementById('rank1_df').textContent = data.rank1_df;
        // ランキング2位のチームの成績
        document.getElementById('rank2_tn').textContent = data.rank2_tn;
        document.getElementById('rank2_pt').textContent = data.rank2_pt;
        document.getElementById('rank2_df').textContent = data.rank2_df;
        // ランキング3位のチームの成績
        document.getElementById('rank3_tn').textContent = data.rank3_tn;
        document.getElementById('rank3_pt').textContent = data.rank3_pt;
        document.getElementById('rank3_df').textContent = data.rank3_df;
        // ランキング4位のチームの成績
        document.getElementById('rank4_tn').textContent = data.rank4_tn;
        document.getElementById('rank4_pt').textContent = data.rank4_pt;
        document.getElementById('rank4_df').textContent = data.rank4_df;

        // 個人スコア 1位の選手の成績
        document.getElementById('rank01_player_nm').textContent = data.rank01_player_nm;
        document.getElementById('rank01_player_pt').textContent = data.rank01_player_pt;
        document.getElementById('rank01_player_df').textContent = data.rank01_player_df;
        document.getElementById('rank01_player_gm').textContent = data.rank01_player_gm;
        // 個人スコア 2位の選手の成績
        document.getElementById('rank02_player_nm').textContent = data.rank02_player_nm;
        document.getElementById('rank02_player_pt').textContent = data.rank02_player_pt;
        document.getElementById('rank02_player_df').textContent = data.rank02_player_df;
        document.getElementById('rank02_player_gm').textContent = data.rank02_player_gm;
        // 個人スコア 3位の選手の成績
        document.getElementById('rank03_player_nm').textContent = data.rank03_player_nm;
        document.getElementById('rank03_player_pt').textContent = data.rank03_player_pt;
        document.getElementById('rank03_player_df').textContent = data.rank03_player_df;
        document.getElementById('rank03_player_gm').textContent = data.rank03_player_gm;
        // 個人スコア 4位の選手の成績
        document.getElementById('rank04_player_nm').textContent = data.rank04_player_nm;
        document.getElementById('rank04_player_pt').textContent = data.rank04_player_pt;
        document.getElementById('rank04_player_df').textContent = data.rank04_player_df;
        document.getElementById('rank04_player_gm').textContent = data.rank04_player_gm;

        /*
        // 個人スコア 5位の選手の成績
        document.getElementById('rank05_player_nm').textContent = data.rank05_player_nm;
        document.getElementById('rank05_player_pt').textContent = data.rank05_player_pt;
        document.getElementById('rank05_player_df').textContent = data.rank05_player_df;
        document.getElementById('rank05_player_gm').textContent = data.rank05_player_gm;
        // 個人スコア 6位の選手の成績
        document.getElementById('rank06_player_nm').textContent = data.rank06_player_nm;
        document.getElementById('rank06_player_pt').textContent = data.rank06_player_pt;
        document.getElementById('rank06_player_df').textContent = data.rank06_player_df;
        document.getElementById('rank06_player_gm').textContent = data.rank06_player_gm;
        // 個人スコア 7位の選手の成績
        document.getElementById('rank07_player_nm').textContent = data.rank07_player_nm;
        document.getElementById('rank07_player_pt').textContent = data.rank07_player_pt;
        document.getElementById('rank07_player_df').textContent = data.rank07_player_df;
        document.getElementById('rank07_player_gm').textContent = data.rank07_player_gm;
        // 個人スコア 8位の選手の成績
        document.getElementById('rank08_player_nm').textContent = data.rank08_player_nm;
        document.getElementById('rank08_player_pt').textContent = data.rank08_player_pt;
        document.getElementById('rank08_player_df').textContent = data.rank08_player_df;
        document.getElementById('rank08_player_gm').textContent = data.rank08_player_gm;
        // 個人スコア 9位の選手の成績
        document.getElementById('rank09_player_nm').textContent = data.rank09_player_nm;
        document.getElementById('rank09_player_pt').textContent = data.rank09_player_pt;
        document.getElementById('rank09_player_df').textContent = data.rank09_player_df;
        document.getElementById('rank09_player_gm').textContent = data.rank09_player_gm;
        // 個人スコア10位の選手の成績
        document.getElementById('rank10_player_nm').textContent = data.rank10_player_nm;
        document.getElementById('rank10_player_pt').textContent = data.rank10_player_pt;
        document.getElementById('rank10_player_df').textContent = data.rank10_player_df;
        document.getElementById('rank10_player_gm').textContent = data.rank10_player_gm;
        // 個人スコア11位の選手の成績
        document.getElementById('rank11_player_nm').textContent = data.rank11_player_nm;
        document.getElementById('rank11_player_pt').textContent = data.rank11_player_pt;
        document.getElementById('rank11_player_df').textContent = data.rank11_player_df;
        document.getElementById('rank11_player_gm').textContent = data.rank11_player_gm;
        // 個人スコア12位の選手の成績
        document.getElementById('rank12_player_nm').textContent = data.rank12_player_nm;
        document.getElementById('rank12_player_pt').textContent = data.rank12_player_pt;
        document.getElementById('rank12_player_df').textContent = data.rank12_player_df;
        document.getElementById('rank12_player_gm').textContent = data.rank12_player_gm;
        */

    } catch(error) {
        console.error('エラーが発生しました:', error);
    }
}

// HTMLの準備ができたら、loadDataを実行
document.addEventListener('DOMContentLoaded', loadData);