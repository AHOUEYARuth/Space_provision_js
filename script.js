const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

fetch('data.json')
    .then((res) => res.json())
    .then((response) => {
        let tab = Object.values(response);
        let jsonData = JSON.stringify(tab);
        localStorage.setItem('mesProduits', jsonData);
    });

let productCategorise = document.querySelector('.products_category');
let cart = JSON.parse(localStorage.getItem('monPanier')) || [];
let productList = document.querySelector('.products_list');
let products = JSON.parse(localStorage.getItem('mesProduits'));

if (productCategorise && products[0]) {
    cartCount()
    products[0].forEach((item) => {
        let categoryUrl = window.location.origin + '?category=' + item.id;
        productCategorise.innerHTML += `
        <a href='${categoryUrl}' class="category">
            <div class="image">
                <img src="${item.image}" alt="" id="img">
            </div>
            <p>${item.name}</p>
        </a>`;
    });
}
const currentURL = window.location.href;
const url = new URL(currentURL);
const paramCategory = url.searchParams.get("category")?? null;

if (paramCategory && products[1]) {
    document.addEventListener('DOMContentLoaded', () => {
        let productFiltered = products[1].filter(list => Number(list.categoryId) === Number(paramCategory));
        productCategorise.innerHTML = ``;
        cartCount()
        if (productFiltered.length > 0) {
            productFiltered.forEach((list) => {
                productList.innerHTML += `
                <div class="list" product-id="${list.id}">
                    <img src="${list.productImage}" alt="">
                    <p>${list.productDescription}</p>
                    <p>${list.productName}</p>
                    <div class="prix">
                        <p>${list.reductPrice}</p>
                        <del><p>${list.priceMain}</p></del>
                    </div>
                    <button class="add-to-cart">Ajouter au panier</button>
                </div>`;
            });
        } else {
            productList.innerHTML = `<p>Aucun produit disponible</p>`;
        }

        let allButton = productList.querySelectorAll('.list .add-to-cart');
        allButton.forEach(btn => {
            btn.addEventListener('click', () => {
                const parentElement = btn.parentElement;
                const image = parentElement.querySelector('img').src;
                const description = parentElement.querySelector('p').textContent;
                const productName = parentElement.querySelector('p:nth-child(3)').textContent;
                const reductPrice = parentElement.querySelector('.prix p').textContent;
                const productId = parentElement.getAttribute('product-id')
                const produit = {
                    id: productId ,
                    image: image,
                    description: description,
                    name: productName,
                    price: reductPrice,
                    qte: 1,
                    totalPrice: reductPrice 
                };
                addToCart(produit);
                
            });
        });
    });
}

function addToCart(produit) {
    const existProduit = cart.find(item => item.id === produit.id);
    if (existProduit) {
        existProduit.qte += 1;
        existProduit.totalPrice = `${existProduit.qte * parseFloat(existProduit.price.split('€')[0])}€`;
    } else {
        cart.push(produit);
    }
    localStorage.setItem('monPanier', JSON.stringify(cart));
    cartCount()
    updateCart()
}

function cartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.length;
}

 cart = JSON.parse(localStorage.getItem('monPanier')) || [];
const cartItemContainer = document.querySelector('#cart-items');
if (cart.length === 0) {
    cartItemContainer.innerHTML = '<h2>Votre panier est vide.</h2>';
} else {
    cart.forEach(produit => {
        const productId = produit.id
        const element = document.createElement('div');
        element.className = 'product';
        element.innerHTML = `
        <div>
            <img src="${produit.image}" alt="${produit.name}">
        </div>
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <p>Nom : ${produit.name}</p>
            <p>Description: ${produit.description}</p>
            <p style="color: red;">Prix: ${produit.price}</p>
            <div class="quantity-container" style="display: flex; gap: 10px; align-items: center; font-size:20px;">
                <button data-action='decrement'>-</button>
                <div class='data-qty' data-qty=${produit.qte}>${produit.qte}</div>
                <button data-action='increment'>+</button>
            </div>
            <div class="total-price">${produit.totalPrice}</div>
            <button data-action='delete'>Supprimer</button>
        </div>`;
        cartItemContainer.appendChild(element);

        const boutons = element.querySelectorAll('button')
        if(boutons){
            boutons.forEach(bout =>{
                bout.addEventListener('click', e=>{
                    e.preventDefault()
                    let dataQtyTag = element.querySelector('.data-qty')
                    let dataQty = parseInt(dataQtyTag.getAttribute('data-qty'))
                    const productPrice = parseFloat(produit.price.split('€')[0])
                    let totalPriceTag = element.querySelector('.total-price')
                    let boutAttributeValue = bout.getAttribute('data-action')
                    let productItem = cart.find(p=>p.id==productId)
                    switch (boutAttributeValue) {
                        case 'increment':
                            dataQty += 1    
                            dataQtyTag.innerHTML = dataQty 
                            dataQtyTag.setAttribute('data-qty', dataQty)

                            const total = dataQty * productPrice
                            totalPriceTag.innerHTML = `${total}€`

                            productItem.qte = dataQty
                            productItem.totalPrice = `${total}€`
                            localStorage.setItem('monPanier', JSON.stringify(cart))
                            calculAmount()

                            break;
                        case 'decrement':
                            dataQty -= 1
                            if(dataQty == 1){
                                dataQtyTag.innerHTML = 1
                                dataQtyTag.setAttribute('data-qty', 1)
                                totalPriceTag.innerHTML = produit.price
                                productItem.qte = dataQty
                                productItem.totalPrice = produit.price
                                localStorage.setItem('monPanier', JSON.stringify(cart))
                                //calculAmount()
                                updateCart()
                            }else if (dataQty>1) {
                                dataQtyTag.innerHTML = dataQty
                                dataQtyTag.setAttribute('data-qty', dataQty)
                                const total = dataQty * productPrice
                                totalPriceTag.innerHTML = `${total}€`
    
                                productItem.qte = dataQty
                                productItem.totalPrice = `${total}€`
                                localStorage.setItem('monPanier', JSON.stringify(cart))
                                //calculAmount()
                                updateCart()
                            } 
                            break;
                        default:
                            cart = cart.filter(p => p.id != productId);
                            localStorage.setItem('monPanier', JSON.stringify(cart));
                            element.remove();
                            if (cart.length === 0) {
                                cartItemContainer.innerHTML = '<h2>Votre panier est vide.</h2>';
                            }
                            //calculAmount()
                            updateCart()
                            break;
                    }
                    
                })
            })
        }

    });
}

function calculAmount() {
    let displayAmount = document.querySelector('#montant')
    let totalAmount = cart.reduce((a, c) => a + parseFloat(c.totalPrice), 0)
    displayAmount.innerHTML = `${totalAmount.toFixed(2)} €`
    localStorage.setItem('monPanier', JSON.stringify(cart));  
}
function updateCart() {
    localStorage.setItem('monPanier', JSON.stringify(cart)); 
    calculAmount()
}
const proceedToCheckout = document.querySelector('#bouton')
proceedToCheckout.addEventListener('click', () =>{
    window.open("/connexion.html", '_parent')
})


calculAmount()

