// HTML側でタグ要
// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
// <script src="message.js"></script>

// icon: success, error, warning, info, question
function showAlert(title, text, icon) {
  Swal.fire({
    title: title, //'完了しました！',
    text: text, //'GitHubのドメイン名は表示されません。',
    icon: icon, //'success', // success, error, warning, info, question
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  });
}