// login
function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('senha').value;
  const lembrarMe = document.getElementById('lembrar-me').checked;
  sessionStorage.setItem('username', username);
  localStorage.setItem('lembrarMe', lembrarMe);
  if ((username === 'admin' || username === 'user') && password === '123') {
    window.location.href = 'Index.html';
  } else {
    showToast('Usuário ou senha incorretos!');
  }
}

function logout() {
  sessionStorage.removeItem('username');
  window.location.href = 'Login.html';
}

// scroll lucas
function scrollToSection(event, sectionId) {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}


//menu 

function renderMenuUser() {
  const loggedUsername = sessionStorage.getItem('username');
  const userLabel = document.querySelector('.username');
  const adminPanel = document.getElementById('admin-panel');
  if (userLabel) userLabel.textContent = loggedUsername ? loggedUsername : 'LOGIN';
  if (adminPanel) adminPanel.style.display = loggedUsername === 'admin' ? 'block' : 'none';
  const avatar = document.querySelector('.avatar');
  if (avatar) avatar.src = loggedUsername === 'admin' ? './images/admin_avatar.png' : './images/user_default.png';
}

function initMenu() {
  renderMenuUser();
  const navUser = document.querySelector('.nav-user');
  const logoutPopup = document.getElementById('logout-popup');
  if (navUser) {
    navUser.addEventListener('click', function (event) {
      event.preventDefault();
      const loggedUsername = sessionStorage.getItem('username');
      if (loggedUsername && logoutPopup) {
        logoutPopup.style.display = logoutPopup.style.display === 'block' ? 'none' : 'block';
      } else if (!loggedUsername) {
        window.location.href = 'Login.html';
      }
    });
  }
  document.addEventListener('click', function (event) {
    if (logoutPopup && navUser && !navUser.contains(event.target) && !logoutPopup.contains(event.target)) {
      logoutPopup.style.display = 'none';
    }
  });
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', logout);
}

//loada produtos padrão do json na local storage no primeiro boot

function getStoredProducts() {
  const stored = localStorage.getItem('produtos');
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

function setStoredProducts(products) {
  localStorage.setItem('produtos', JSON.stringify(products));
}

function normalizeProducts(products) {
  return products.map((p) => {
    const normalized = { ...p };
    if (typeof normalized.price === 'string') {
      const cleaned = normalized.price
        .replace(/R\$|r\$/g, '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      normalized.price = Number.isNaN(parseFloat(cleaned)) ? 0 : parseFloat(cleaned);
    } else if (typeof normalized.price === 'number') {
      normalized.price = normalized.price;
    } else {
      normalized.price = 0;
    }
    return normalized;
  });
}

function initializeProductStorage() {
  const stored = getStoredProducts();
  if (stored && Array.isArray(stored)) return Promise.resolve(stored);
  return fetch('Products.json').then((r) => r.json()).then((data) => {
    const normalized = normalizeProducts(data);
    setStoredProducts(normalized);
    return normalized;
  }).catch(() => {
    const empty = [];
    setStoredProducts(empty);
    return empty;
  });
}

// CRUD

// só pra nao cagar na edição do preço

function formatarPrecos(value) {
  let number = 0;
  if (typeof value === 'string') {
    let clean = value.replace(/R\$|r\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    number = Number.isNaN(parsed) ? 0 : parsed;
  } else if (typeof value === 'number') {
    number = value;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
}

function carregaTabela(products) {
  let table = '<table class="produtos-tabela">';
  table += '<tr>';
  products.forEach((p) => { table += `<td><img class="produto-img" src="${p.image}" alt="${p.name}"></td>`; });
  table += '</tr>';
  table += '<tr>';
  products.forEach((p) => { table += `<td contenteditable="true"><h3 class="produto-nome">${p.name}</h3></td>`; });
  table += '</tr>';
  table += '<tr>';
  products.forEach((p) => { table += `<td contenteditable="true"><p class="produto-descricao">${p.description}</p></td>`; });
  table += '</tr>';
  table += '<tr>';
  products.forEach((p) => { table += `<td contenteditable="true"><p class="produto-preco">${formatarPrecos(p.price)}</p></td>`; });
  table += '</tr>';
  table += '</table>';
  return table;
}

function renderProductsTable() {
  const container = document.getElementById('tabela');
  if (!container) return;
  initializeProductStorage().then((products) => {
    container.innerHTML = carregaTabela(products);
    apagarLinha();
    editarImagem();
  });
}

function editarTabela() {
  const products = getStoredProducts() || [];
  const tabela = document.querySelector('.produtos-tabela');
  const nameCells = tabela.querySelectorAll('tr:nth-child(2) td');
  const descriptionCells = tabela.querySelectorAll('tr:nth-child(3) td');
  const priceCells = tabela.querySelectorAll('tr:nth-child(4) td');

  //validacao de erro
  if (!products.length) {
    return;
  }

  if (!tabela) {
    showToast('Tabela não carregou');
    return;
  }

  if (nameCells.length !== products.length || descriptionCells.length !== products.length || priceCells.length !== products.length) {
    showToast('Falta alguma linha em algum produto');
    return;
  }
  
  for (let i = 0; i < products.length; i++) {
    const nameEl = nameCells[i].textContent.trim();
    const descriptionEl = descriptionCells[i].textContent.trim();
    const rawPrice = priceCells[i].textContent.trim();
    const cleanedPrice = rawPrice.replace(/R\$|r\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    const priceEl = parseFloat(cleanedPrice) || 0;
    products[i].name = nameEl;
    products[i].description = descriptionEl;
    products[i].price = priceEl;
  }
  setStoredProducts(products);
  renderProductsTable();
  showToast('Alterações feitas!', 'sucesso');
}

function apagarProduto() {
  const products = getStoredProducts() || [];
  if (!products.length) {
    toast('Sem produtos para excluir', 'warning');
    return;
  }
  const dialog = document.getElementById('delete-dialog');
  const input = document.getElementById('delete-position');
  input.max = products.length;
  input.value = '';
  dialog.showModal();
}

function confirmarExclusao() {
  const products = getStoredProducts() || [];
  const position = parseInt(document.getElementById('delete-position').value, 10);

  if (Number.isNaN(position) || position < 1 || position > products.length) {
    toast('Posição inválida, tamanho da lista: ' + products.length, 'error');
    return;
  }

  const removed = products.splice(position - 1, 1)[0];
  setStoredProducts(products);
  renderProductsTable();
  document.getElementById('delete-dialog').close();
  toast(`Produto removido: ${removed.name}`, 'success');
}

function apagarLinha() {
  const tabela = document.querySelector('.produtos-tabela');
  if (!tabela) return;
  tabela.querySelectorAll('td').forEach((td) => {
    td.addEventListener('dblclick', () => {
      const confirmar = confirm('Apagar essa linha?');
      if (!confirmar) return;
      td.textContent = '';
    });
  });
}

function editarImagem() {
  const tabela = document.querySelector('.produtos-tabela');
  if (!tabela) return;
  const products = getStoredProducts() || [];
  tabela.querySelectorAll('.produto-img').forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.title = 'Clique para alterar o link da imagem';
    img.addEventListener('click', () => {
      const novoLink = prompt('Cole aqui o link da nova imagem:', img.src);
      if (!novoLink || !novoLink.trim()) return;
      products[index] = products[index] || {};
      products[index].image = novoLink.trim();
      setStoredProducts(products);
      renderProductsTable();
      showToast('Imagem atualizada!', 'sucesso');
    });
  });
}

function abreFormulario() {
  const modal = document.getElementById('insert-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const inputImagem = document.getElementById('product-image');
  if (inputImagem) {
    inputImagem.addEventListener('input', () => {
      const url = inputImagem.value.trim();
      const container = document.getElementById('preview-img-container');
      const img = document.getElementById('preview-img');
      if (url) {
        img.src = url;
        img.onload = () => container.style.display = 'block';
        img.onerror = () => container.style.display = 'none';
      } else {
        container.style.display = 'none';
      }
    });
  }
}

function fechaFormulario() {
  const modal = document.getElementById('insert-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  const form = document.getElementById('insert-form');
  if (form) form.reset();
}

function handlerTabela(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const name = formData.get('name').trim();
  const description = formData.get('description').trim();
  const priceRaw = formData.get('price').trim();
  const image = formData.get('image').trim();

  if (!name || !description || !priceRaw || !image) {
    showToast('Preencha todos os campos');
    return;
  }   

  const newProduct = {
    name: name,
    description: description,
    price: parseFloat(priceRaw) || 0,
    image: image,
  };

  const products = getStoredProducts() || [];
  products.push(newProduct);
  setStoredProducts(products);
  renderProductsTable();
  showToast('Produto adicionado!', 'sucesso');
  fechaFormulario();
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.insert-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', fechaFormulario);

  const modal = document.getElementById('insert-modal');
  if (modal) modal.addEventListener('click', (event) => { 
    if (event.target === modal) fechaFormulario(); 
  });

  const form = document.getElementById('insert-form');
  if (form) form.addEventListener('submit', handlerTabela);

  initMenu();
  renderProductsTable();
});

function showToast(mensagem, tipo = 'erro') {
  let toast = document.getElementById('toast');
  if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.className = `toast ${tipo} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}