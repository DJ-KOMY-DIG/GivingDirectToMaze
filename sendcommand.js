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
// 1. 受講生ページ用の処理
// --------------------------------------------------
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const nameField = document.getElementById('inputName');
        const cmdField = document.getElementById('inputCommand');
        
        const nameVal = nameField.value.trim();
        // 入力を大文字に変換して取得
        const cmdVal = cmdField.value.toUpperCase().trim(); 
        
        // バリデーション1: 名前があるか
        if (!nameVal) {
            alert("名前を入力してください");
            return;
        }

        // バリデーション2: F, R, L 以外の文字が含まれていないかチェック
        // ^[FRL]+$ は「先頭から末尾までFかRかLだけが1文字以上続く」という意味
        if (!cmdVal.match(/^[FRL]+$/)) {
            alert("「F」「R」「L」の文字だけで入力してください");
            return;
        }

        // データを送信（名前とコマンドをセットで）
        push(ref(db, 'answers'), {
            name: nameVal,
            command: cmdVal,
            timestamp: serverTimestamp()
        }).then(() => {
            alert("送信しました！");
            cmdField.value = ""; // コマンド欄だけクリア（名前は残すほうが親切）
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
    
    onChildAdded(answersRef, (snapshot) => {
        const data = snapshot.val();
        const name = data.name || "名無し"; // データがない場合の保険
        const command = data.command || "";

        // カード要素を作成
        const card = document.createElement("div");
        card.className = "card";
        
        // 中身のHTMLを組み立て（名前を小さく、コマンドを大きく）
        card.innerHTML = `
            <div class="card-name">${name}</div>
            <div class="card-cmd">${command}</div>
        `;
        
        resultsDiv.appendChild(card);
        window.scrollTo(0, document.body.scrollHeight);
    });
}