window.onload = function onload() {   
  fetchingProducts();  
};

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);  
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {  
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}



async function fetchingProducts() {
  const fetchPcs = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await fetchPcs.json(); 
  results.forEach((element) => {
    document.querySelector('.items').appendChild(createProductItemElement(element));
  });
  addToCart();
}
const addToCart = async() => {
  const productBtnToAdd = document.querySelectorAll('.item__add');
  productBtnToAdd.forEach((event) => {
      event.addEventListener('click', async (param) => {    
      const resultsId = param.target.parentNode.firstChild.innerText;      
      const selectedToAdd = await fetch(`https://api.mercadolibre.com/items/${resultsId}`);
      const prodJson = await selectedToAdd.json();
      document.querySelector('.cart__items').appendChild(createCartItemElement(prodJson));
    })
  })
}

