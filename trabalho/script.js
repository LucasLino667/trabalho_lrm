/*function excluir() {
    let numero = prompt("Qual coluna quer excluir? (começa em 1)");

    let tabela = document.querySelector("#tabela table");
  
    let index = parseInt(numero) - 1; // -1 porque começa em 1 no prompt
  
    if (!isNaN(index) && index >= 0) {
      // Apaga a célula de cada linha
      for (let i = 0; i < tabela.rows.length; i++) {
        if (tabela.rows[i].cells[index]) {
          tabela.rows[i].deleteCell(index);
        }
      }
    } else {
      alert("Coluna inválida!");
    }
  }*/

function login(event){
  event.preventDefault();
  let username = document.getElementById("username").value; 
  let password = document.getElementById("senha").value;

  sessionStorage.setItem("username", username);

  if(username === "admin" && password === "123"){
    sessionStorage.setItem("username", username);
    alert("Login bem-sucedido!");
    window.location.href = "Index.html";
  } else if (username === "user" && password === "123"){
    sessionStorage.setItem("username", username);
    alert("Login bem-sucedido!");
    window.location.href = "Index.html";
  } else {
    alert("Username ou senha inválidos!");
  }
}

function renderMenuUser(){
  const loggedUsername = sessionStorage.getItem("username");
  const userLabel = document.querySelector(".username");

  if(!userLabel) return;
  userLabel.textContent = loggedUsername ? loggedUsername : 'USUÁRIO DESCONECTADO';

  if(loggedUsername){
    const avatar = document.querySelector(".avatar");
    if(avatar && loggedUsername === "admin") avatar.src = "./images/admin_avatar.png";
    if(avatar && loggedUsername === "user") avatar.src = "./images/user_default.png";
  }
}

// Chamado pelos scripts das páginas após carregar menu.html
function initMenu(){
  renderMenuUser();
}
