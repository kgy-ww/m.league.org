// GASのアプリケーションURL
const API_URL = "https://script.google.com/macros/s/AKfycbyaLrQdHY3TzYa23RBApxJ-Z4UCjsumhgU9InGaoFQqbF8sKWChOVrbzFzGDoj_Gd8/exec"




// マスタデータを保持するグローバル変数
let master_data = { teams: [], players: [] }; 
// ==========================================
// 1. ページ読み込み時の初期化処理
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // 認証処理
    let api_key = "";

    switch (true) {
        // 設定ファイルが存在すれば
        case (typeof CONFIG !== 'undefined' && !! CONFIG.API_KEY):
            api_key = CONFIG.API_KEY;
            break;
        // 設定ファイルが存在しなければ
        default:
            api_key = prompt("API_KEYを入力してください");
            break;
    }

    switch (!api_key) {
        case true:
            window.location.href = "index.html";
            // 処理を止める
            return
    }

    try {
        const response = await fetch(`${API_URL}?type=admin&key=${encodeURIComponent(api_key)}`);
        const result = await response.json();

        if (!result.is_admin) {
            window.location.href = "index.html";
            return;
        }

        const overlay = document.getElementById('org_overlay');
        if (overlay) {
            overlay.classList.add('org_hidden');
        }

    } catch (error) {
        window.location.href = "index.html";
        return;
    }


    // マスタ（チーム・選手）を取得・プルダウンを構築
    await loadMasterData();

    // フォームの送信イベントを監視
    const form = document.getElementById('game_form') || document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

// ==========================================
// 2. マスタデータ取得 ＆ プルダウン構築
// ==========================================
async function loadMasterData() {
    try {
        const [team_response, player_response] = await Promise.all([
            fetch(`${API_URL}?type=team`),
            fetch(`${API_URL}?type=player`)
        ]);

        if (!team_response.ok || !player_response.ok) {
            throw new Error("ネットワークレスポンスが正常ではありません");
        }

        const team_data = await team_response.json();
        const player_data = await player_response.json();

        // オブジェクトに格納
        master_data.teams = team_data;
        master_data.players = player_data;
        
        // チームプルダウンを初期化
        for (let i = 1; i <= 4; i++) {
            const team_select = document.getElementById(`t${i}_name`);
            if (!team_select) continue;
            
            // チームの選択肢を作り直す
            rebuildTeamOptions(team_select, "");

            // 初期状態では未選択・ロック状態にしておく
            updatePlayerSelect(i, "");
            
            // チームが選択時のイベント
            team_select.addEventListener('change', (e) => {
                const selected_team_id = e.target.value;
                
                // チーム選択完了時に、所属選手だけで上書きする
                updatePlayerSelect(i, selected_team_id);
                
                // チームプルダウンの状態をリアルタイム同期
                syncTeamSelections();
            });
        }
    } catch (error) {
        console.error("マスタデータの読み込みに失敗しました:", error);
    }
}

// チームの選択肢を作り直す
function rebuildTeamOptions(selectElement, currentValue) {
    selectElement.innerHTML = '<option value="">---</option>';
    master_data.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.team_id;
        option.textContent = team.team_name;
        if (String(team.team_id) === String(currentValue)) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

// チーム選択完了時に、所属選手だけで上書きする
function updatePlayerSelect(playerIndex, teamId) {
    const playerSelect = document.getElementById(`p${playerIndex}_name`);
    if (!playerSelect) return;
    
    playerSelect.innerHTML = '';
    
    // チームが未選択になった場合
    if (!teamId) {
        playerSelect.innerHTML = '<option value="">---</option>';
        // ロックする
        playerSelect.disabled = true;
        return;
    }
    
    // 選手マスタから、選ばれたチームIDに所属する選手だけをフィルター抽出
    const filteredPlayers = master_data.players.filter(p => String(p.team_id) === String(teamId));
    
    playerSelect.innerHTML = '<option value="">---</option>';
    filteredPlayers.forEach(player => {
        const option = document.createElement('option');
        option.value = player.player_id;
        option.textContent = player.player_name;
        playerSelect.appendChild(option);
    });
    
    // ロック解除
    playerSelect.disabled = false;
}

// チームプルダウンの状態をリアルタイム同期
function syncTeamSelections() {
    // 現在の選択状況をリスト化
    const selectedTeams = [];
    for (let i = 1; i <= 4; i++) {
        const val = document.getElementById(`t${i}_name`)?.value;
        if (val) selectedTeams.push(val);
    }

    // プルダウンの選択肢を一つずつ操作
    for (let i = 1; i <= 4; i++) {
        const teamSelect = document.getElementById(`t${i}_name`);
        if (!teamSelect) continue;
        
        const currentVal = teamSelect.value;

        Array.from(teamSelect.options).forEach(option => {
            if (option.value === "") return;

            // 「他の誰かがすでに選んでいる」かつ「自分が今選んでいるやつではない」チームを隠す
            if (selectedTeams.includes(option.value) && option.value !== currentVal) {
                option.disabled = true;
                option.style.display = 'none';
            } else {
                option.disabled = false;
                option.style.display = 'block';
            }
        });
    }
}

// ==========================================
// 3. フォーム送信処理 ＆ バリデーション
// ==========================================
async function handleSubmit(event) {
    // ページのリロードを阻止
    event.preventDefault();

    // ボタンの多重販促（連打）を防ぐ
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
        const form_data = new FormData(event.target);
        
        // --------------------------------------------------
        // 空欄（未入力）なら自動的に 0 pt とする安全処理 (|| 0)
        // --------------------------------------------------
        const payload = {
            password: document.getElementById('admin_password')?.value || "",

            game_id: "",
            // 対局日
            game_date: document.getElementById('game_date')?.value || "",
            // 選手1.            
            p1_id: form_data.get('p1_name'), 
            p1_tasu_pt: parseFloat(form_data.get('p1_tasu_pt')) || 0,
            p1_hiku_pt: parseFloat(form_data.get('p1_hiku_pt')) || 0,
            // 選手2.
            p2_id: form_data.get('p2_name'),
            p2_tasu_pt: parseFloat(form_data.get('p2_tasu_pt')) || 0,
            p2_hiku_pt: parseFloat(form_data.get('p2_hiku_pt')) || 0,            
            // 選手3.
            p3_id: form_data.get('p3_name'),
            p3_tasu_pt: parseFloat(form_data.get('p3_tasu_pt')) || 0,
            p3_hiku_pt: parseFloat(form_data.get('p3_hiku_pt')) || 0,
            // 選手4.
            p4_id: form_data.get('p4_name'),
            p4_tasu_pt: parseFloat(form_data.get('p4_tasu_pt')) || 0,
            p4_hiku_pt: parseFloat(form_data.get('p4_hiku_pt')) || 0
        };

        // 送信前チェック
        if (!payload.p1_id || !payload.p2_id || !payload.p3_id || !payload.p4_id) {
            alert('[入力不正]:選手が4名でありません')
            if (submitButton) submitButton.disabled = false;
            return;
        }

        const ttl_net_score = payload.p1_tasu_pt + payload.p2_tasu_pt + payload.p3_tasu_pt + payload.p4_tasu_pt;
        // 小数計算の誤差対策として、小数点第1位で丸めて、"0.0"か判定
        if (ttl_net_score.toFixed(1) !== "0.0" && ttl_net_score.toFixed(1) !== "-0.0") {
            alert('[入力不正]:スコア合計が0になりません')
            if (submitButton) submitButton.disabled = false;
            return;
        }

        // --------------------------------------------------
        // GASへデータを非同期送信 (POST)
        // --------------------------------------------------
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("送信成功");
            // 登録成功したらフォームをリセットし、プルダウンの状態も初期状態に戻す
            event.target.reset();
            for (let i = 1; i <= 4; i++) {
                updatePlayerSelect(i, "");
            }
            syncTeamSelections();
        } else {
            alert("送信失敗: " + result.message);
        }

    } catch (error) {
        alert("エラー");
    } finally {
        // 処理が終わったらボタンを再度有効化
        if (submitButton) submitButton.disabled = false;
    }
}
