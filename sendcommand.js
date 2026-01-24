// 2026/01/22 Daisuke Komori
// sendcommand.js


// Firebase SDKのインポート（モジュール版）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRrHyv_BrsJib_sc7uuGzAoFosbyy1DT8",
  authDomain: "digital-training-pa010.firebaseapp.com",
  databaseURL: "https://digital-training-pa010-default-rtdb.firebaseio.com",
  projectId: "digital-training-pa010",
  storageBucket: "digital-training-pa010.firebasestorage.app",
  messagingSenderId: "110190854767",
  appId: "1:110190854767:web:216cc1cac94ac6338f039a",
  measurementId: "G-Y9LNQEHJV1"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --------------------------------------------------
// 1. 受講生ページ用の処理
// --------------------------------------------------
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    const cmdField = document.getElementById('inputCommand');
    
    // ★入力制限のロジック
    // 日本語入力中などを考慮し、inputイベントで監視
    const validateInput = (e) => {
        // 現在の入力値
        const val = e.target.value;
        // F,R,L (大文字小文字) 以外を空文字に置換
        const cleanVal = val.replace(/[^fFrRlL]/g, '');
        
        // 変化があった場合のみ値を書き換える（無限ループ防止）
        if (val !== cleanVal.toUpperCase()) {
            e.target.value = cleanVal.toUpperCase();
        }
    };

    cmdField.addEventListener('input', validateInput);
    cmdField.addEventListener('blur', validateInput); // 入力欄から離れた時も念のため実行

    sendBtn.addEventListener('click', () => {
        const nameField = document.getElementById('inputName');
        const nameVal = nameField.value.trim();
        const cmdVal = cmdField.value.toUpperCase().trim(); // 大文字化
        
        if (!nameVal) {
            alert("名前を入力してください！");
            return;
        }
        if (!cmdVal) {
            alert("指示（F、R、L）を入力してください！");
            return;
        }

        // データ送信
        push(ref(db, 'answers'), {
            name: nameVal,
            command: cmdVal,
            timestamp: serverTimestamp()
        }).then(() => {
            alert("送信しました！");

            // 送信後に入力欄をクリア
            // cmdField.value = ""; 

        }).catch((error) => {
            console.error("Error:", error);
            alert("送信に失敗しました");
        });
    });
}

// --------------------------------------------------
// 2. 講師ページ用の処理
// --------------------------------------------------
const resultsDiv = document.getElementById('results');
if (resultsDiv) {
    const answersRef = ref(db, 'answers');
    
    // データ追加時の処理
    onChildAdded(answersRef, (snapshot) => {
        const data = snapshot.val();
        if (!data.name || !data.command) return; 

        const card = document.createElement("div");
        card.className = "card";

        // 安全のためにHTMLエスケープ（名前に入力されたタグなどが動かないように）
        // ※簡易的なXSS対策として textContent を使うか、このようにサニタイズするのが望ましい
        const safeName = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeCmd = data.command.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        card.innerHTML = `
            <div class="card-name">${safeName}</div>
            <div class="card-cmd">${safeCmd}</div>
        `;
        
        resultsDiv.appendChild(card);
        window.scrollTo(0, document.body.scrollHeight);
    });

    // リセットボタンの処理
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("データをすべて消去します。\nよろしいですか？")) {
                // データベースの 'answers' フォルダを削除
                remove(ref(db, 'answers'))
                    .then(() => {
                        // alert("データをリセットしました");
                        // 画面に残っているカードを消すためにリロード
                        location.reload();
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("リセットに失敗しました");
                    });
            }
        });
    }
}