// 2026/01/22 Daisuke Komori
// sendcommand.js


// Firebase SDKのインポート（モジュール版）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
// ページ判定ロジック
// --------------------------------------------------

// 1. 受講生ページ用の処理（送信ボタンがある場合のみ実行）
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const inputField = document.getElementById('inputChar');
        const inputVal = inputField.value.toUpperCase();
        
        // バリデーション：A-Zの1文字かどうか
        if (!inputVal.match(/^[A-Z]$/)) {
            alert("アルファベットを1文字入力してください");
            return;
        }

        // データを送信
        push(ref(db, 'answers'), {
            char: inputVal,
            timestamp: serverTimestamp()
        }).then(() => {
            alert("送信しました！");
            inputField.value = ""; // 入力欄をクリア
            inputField.focus();    // 次の入力のためにフォーカスを戻す
        }).catch((error) => {
            console.error("Error:", error);
            alert("送信に失敗しました");
        });
    });
}

// 2. 講師ページ用の処理（結果表示エリアがある場合のみ実行）
const resultsDiv = document.getElementById('results');
if (resultsDiv) {
    const answersRef = ref(db, 'answers');
    
    // データが追加されるたびに呼ばれる
    onChildAdded(answersRef, (snapshot) => {
        const data = snapshot.val();
        const char = data.char;

        // カード要素を作成
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = char;
        
        // 画面に追加（新しいものが後ろに追加される）
        resultsDiv.appendChild(card);
        
        // 自動スクロール（要素が多くなった場合、一番下を見せる）
        window.scrollTo(0, document.body.scrollHeight);
    });
}