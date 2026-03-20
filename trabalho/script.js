document.getElementById("Ref_Login").addEventListener("click", function () {
    window.location.href = "Login.html";
});

function mostrarSucesso(event) {
    event.preventDefault();
    document.getElementById('modal-sucesso').style.display = 'block';
}
