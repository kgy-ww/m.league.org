// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

async function loadData() {
    try {
        const [team_response, player_response] = await Promise.all([
            fetch(`${API_URL}?type=team`),
            fetch(`${API_URL}?type=player`)
        ]);

        const teams = await team_response.json();
        const players = await player_response.json();

        // それぞれの描画処理
        renderTeamData(teams);
        renderPlayerData(players);

    } catch (error) {
        alert("データの取得に失敗", error)
    }
}

// 描画処理: チーム
function renderTeamData(teams) {
    // HTMLの <tbody> に設定したIDを取得
    const tbody = document.getElementById("team_data");
    if (!tbody) return;

    // 既存のダミー行をクリア
    tbody.innerHTML = ""

    // ポイントの高い順（降順）に並び替え
    teams.sort((a,b) => b.team_pt - a.team_pt)

    // ポイント差の計算をおこなう際の基準値を定める
    const std_pt = teams[0] ? teams[0].team_pt : 0;

    // 着順に沿って、要素に値を代入
    teams.forEach((team, index) => {
        const rank = index + 1;

        const df = std_pt - team.team_pt;
        const fmt_df = df === 0 ? "-" : df.toFixed(1);

        const tr_class = (index === 0) ? "rank-border-red" : "rank-border-green";
        const ttl_game = "24"
        // 1行分のHTMLを組み立て
        const row_template = `
            <tr class="${tr_class}">
                <td class="has-text-centered">${rank}</td>
                <td class="has-text-centered">${escapeHtml(team.team_name)}</td>
                <td class="has-text-right">${team.team_pt.toFixed(1)}</td>
                <td class="has-text-right">${fmt_df}</td>
                <td class="has-text-centered">${team.game_num}/${ttl_game}</td>
            </tr>
        `;

        // 挿入
        tbody.insertAdjacentHTML("beforeend", row_template);
    });
}

// 描画処理: 選手
function renderPlayerData(players) {
    // HTMLの <tbody> に設定したIDを取得
    const tbody = document.getElementById("player_data");
    if (!tbody) return;

    // 既存のダミー行をクリア
    tbody.innerHTML = "";

    players.sort((a,b) => {
        // ポイントの高い順（降順）に並び替え
        if (b.player_pt !== a.player_pt) {
            return b.player_pt - a.player_pt;
        }
        // ポイントが同じなら、試合数の少ない順（昇順）に並び替え
        if (a.game_num !== b.game_num) {
            return a.game_num - b.game_num;
        }
        // 試合数も同じなら、50音の昇順に並び替え
        return a.player_name.localeCompare(b.player_name, 'ja');
    })

    // ポイント差の計算をおこなう際の基準値を定める
    const std_pt = players[0] ? players[0].player_pt : 0;

    players.forEach((player, index) => {
        const rank = index + 1;

        const df = std_pt - player.player_pt;
        const fmt_df = df === 0 ? "-" : df.toFixed(1);

        const tr_class = (index === 0) ? "rank-border-red" : "rank-border-green";
        // 1行分のHTMLを組み立て
        const row_template = `
            <tr class="${tr_class}">
                <td class="has-text-centered">${rank}</td>
                <td class="has-text-centered">${escapeHtml(player.player_name)}</td>
                <td class="has-text-right">${player.player_pt.toFixed(1)}</td>
                <td class="has-text-right">${fmt_df}</td>
                <td class="has-text-centered">${player.game_num}</td>
            </tr>
        `;

        // 挿入
        tbody.insertAdjacentHTML("beforeend", row_template);

    });

}

// 安全対策: エスケープ対策
function escapeHtml(str) {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}