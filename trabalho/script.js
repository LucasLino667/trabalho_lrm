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
  userLabel.textContent = loggedUsername ? loggedUsername : 'LOGIN';

  if(loggedUsername){
    const avatar = document.querySelector(".avatar");
    if(avatar && loggedUsername === "admin") avatar.src = "./images/admin_avatar.png";
    if(avatar && loggedUsername === "user") avatar.src = "./images/user_default.png";
  }
}

function initMenu(){
  renderMenuUser();
}

function generateTable(products) {
  let table = '<table class="produtos-tabela">';
  
  // Row for images
  table += '<tr>';
  products.forEach(product => {
    table += `<td><img class="produto-img" src="${product.image}" alt="${product.name}"></td>`;
  });
  table += '</tr>';
  
  // Row for names
  table += '<tr>';
  products.forEach(product => {
    table += `<td contenteditable="true"><h3 class="produto-nome">${product.name}</h3></td>`;
  });
  table += '</tr>';
  
  // Row for descriptions
  table += '<tr>';
  products.forEach(product => {
    table += `<td contenteditable="true"><p class="produto-descricao">${product.description}</p></td>`;
  });
  table += '</tr>';
  
  // Row for prices
  table += '<tr>';
  products.forEach(product => {
    table += `<td contenteditable="true"><p class="produto-preco">${product.price}</p></td>`;
  });
  table += '</tr>';
  
  table += '</table>';
  return table;
}

function scrollToSection(event, sectionId) {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function enableDeleteCell() {
    const tabela = document.querySelector('.produtos-tabela');
    if (!tabela) return;

    tabela.querySelectorAll('td').forEach(td => {
        td.addEventListener('dblclick', () => {
            const confirmar = confirm('Deseja excluir esta célula?');
            if (!confirmar) return;

            td.remove();
        });
    });
}
