window.onload = function onload() { };

// inicio
const cartItems = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function storage() {
  const cartStorage = document.querySelector(cartItems);
  localStorage.setItem('shopCart', cartStorage.innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Percorrer todas as LIs do carrinho com for each, usar o split com o $, somar a ultima posição do array com parseInt

function calculatePriceTotal() {
  const items = document.querySelectorAll('.cart__item');
  let sum = 0;
  items.forEach((item) => {
    sum += parseFloat(item.innerHTML.split('$')[1]);
    console.log(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = sum;
}

// Feito em sala com Nikolas,Alberto e outros rsrs
function cartItemClickListener(event) {
  // coloque seu código aqui
  const delItem = document.querySelector(cartItems);
  delItem.removeChild(event.target);
  calculatePriceTotal();
  storage();
}

// Feito em sala com Nikolas,Alberto e outros rsrs
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const itemsCart = document.querySelector(cartItems);
  itemsCart.appendChild(li);
  return li;
}

// Feito em sala com Nikolas,Alberto e outros rsrs
function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    createCartItemElement({ sku, name, salePrice });
    calculatePriceTotal();
    storage();
  });

  return section;
}

 // Feito em sala com Nikolas,Alberto e outros rsrs
function getProducts(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const element = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
        salePrice: item.price,
      });
      document.querySelector('.items').appendChild(element);
    });
  });
}

function clearList() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    localStorage.clear();
    const liCart = document.querySelector(cartItems);
    while (liCart.firstChild) {
      liCart.removeChild(liCart.firstChild);
    }
  });
}

window.onload = function onload() {
  getProducts('computador');
  if (localStorage.shopCart) {
    document.querySelector(cartItems).innerHTML = localStorage.getItem('shopCart');
    document.querySelectorAll(cartItems).forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
  clearList();
};

// utilizar na função fetch e passar como segundo parametro da api
// const myHeaders = { method: 'GET',
// headers: 'application/json',
// cache: 'default' }; 
// Requisito 5
// // // Percorrer todas as LIs do carrinho com for each, usar o split com o $, somar a ultima posição do array com parseInt
// // <p> innerHTML =  soma da função acima </p> 