document.getElementById("Ref_Login").addEventListener("click", function () {
    window.location.href = "Login.html";
});


function inicio(){
    alert("oi");
    console.log("Inicio");
}
function excluir() {
    let numero = prompt("Qual linha quer excluir? (começa em 1)");

    let tabela = document.getElementById("tabela");
  
    // +1 porque a linha 0 é o cabeçalho
    let index = parseInt(numero);
  
    if (!isNaN(index) && tabela.rows[index]) {
      tabela.deleteRow(index);
    } else {
      alert("Linha inválida!");
    }
  }


function mostrarSucesso(event) {
    event.preventDefault();
    document.getElementById('modal-sucesso').style.display = 'block';
}

