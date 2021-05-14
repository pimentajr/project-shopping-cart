function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const idPromise = async (item) => {
  const itemPromise = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const result = await itemPromise.json();
  return result;
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

  function cartItemClickListener() {
    //  coloque seu código aqui
    //  event as parameter
  }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const cartContainer = document.querySelector('.cart__items');
  const itemId = await getSkuFromProductItem(event.target.parentElement);
  const item = await idPromise(itemId);
  const { id: sku, title: name, price: salePrice } = item;
  cartContainer.appendChild(createCartItemElement({ sku, name, salePrice }));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
  
  return section;
}

const fetchProduct = () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const fetchItem = new Promise(() => fetch(URL)
  .then((response) => response.json())
    .then((data) => data.results)
    .then((product) => {
      product.forEach((item) => {
        const { id: sku, title: name, thumbnail: image } = item;
        const newItem = createProductItemElement({ sku, name, image });
        document.querySelector('.items').appendChild(newItem);
      });
    }));
    return fetchItem;
  };

window.onload = function onload() {
fetchProduct();
};
