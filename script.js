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

const removeItemLocalstorage = (id) => {
  localStorage.removeItem(id);
};

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => removeItemLocalstorage(sku));
  
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
}

const addItemToLocalStorage = () => {
  if (localStorage.length > 0) {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      const value = localStorage.getItem(key);
      const object = JSON.parse(value);
      createCartItemElement(object);
    }
  } // No requisito 4 esse artigo me ajudou bastante (https://warcontent.com/localstorage-javascript/)
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const searchItemId = (idItem) => {
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
  .then((response) => response.json())
  .then((json) => {
    createCartItemElement(json);
    localStorage.setItem(json.id, JSON.stringify(json));
  })
  .catch((error) => error);
};

const buttonAddCartItemListener = () => {
  const buttonItemAdd = document.querySelectorAll('.item__add');
  buttonItemAdd.forEach((button, index) => button.addEventListener('click', () => {
    const sectionItems = document.querySelectorAll('.item');
    const item = sectionItems[index];
    searchItemId(getSkuFromProductItem(item));
  }));
};

const createSpanLoading = () => {
  const span = document.createElement('span');
  span.classList.add('loading');
  span.innerText = 'loading...';
  const container = document.querySelector('.container');
  container.appendChild(span);
};

const removeSpanLoading = () => {
  const container = document.querySelector('.container');
  container.lastChild.remove();
};

const createProductList = () => {
  createSpanLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results)
    .then((results) => results.forEach((value) => createProductItemElement(value)))
    .then((__) => removeSpanLoading())
    .then((__) => buttonAddCartItemListener())
    .catch((error) => error);
};

const buttonCartListener = () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const liCartItems = document.querySelectorAll('.cart__item');
    liCartItems.forEach((value) => value.remove());
    
    localStorage.clear();
  });
};

window.onload = function onload() {
  addItemToLocalStorage();
  createProductList();
  buttonCartListener();
};