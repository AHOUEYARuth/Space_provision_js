const header = document.querySelector('.header')
window.addEventListener('scroll', () =>{
    if (window.scrollY > 120) {
        header.classList.add('scrolled')
    }else{
        header.classList.remove('scrolled')
    }
})
fetch('data.json')
    .then((res) =>{
        return res.json()
    }).then((response) =>{
        let tab =[]
        Object.keys(response).forEach(key =>{
         tab.push(response[key])
        })
        let jsonData = JSON.stringify(tab)
        localStorage.setItem('mesProduits', jsonData)   
    })
let productCategorise = document.querySelector('.products_category')
let cart = [] 
let productList = document.querySelector('.products_list')
//productList.innerHTML = ``
let products = JSON.parse(localStorage.getItem('mesProduits'))
if(productCategorise){
    
    products[0].map((item) =>{
        let categoryUrl = window.location.origin+'?category='+item.id
        productCategorise.innerHTML += `
        <a href='${categoryUrl}' class="category">
            <div class="image">
                <img src="${item.image}"  alt="" id="img">
            </div>
            <p>${item.name}</p>
        </a>
        `
    })   
}
const currentURL = window.location.href
const url = new URL(currentURL)
const paramCategory = url.searchParams.get("category")??null
//console.log(paramCategory);

if(paramCategory){
    document.addEventListener('DOMContentLoaded', () =>{
        let productFiltered = products[1].filter(list => Number(list.categoryId) == Number(paramCategory))
        //console.log(productFiltered);
        productCategorise.innerHTML=``
        
        if(productFiltered.length >0) {
            productFiltered.map((list) =>{
                productList.innerHTML += `
                <div class="list">
                    <img src="${list.productImage}" alt="">
                    <p>${list.productDescription}</p>
                    <p>${list.productName}</p>
                    <div class="prix">
                        <p >${list.reductPrice}</p>
                        <del><p>${list.priceMain}</p></del>
                    </div>
                    <button class="add-to-cart">${list.cart}</button>
                </div>
                `
            })
        }else{
            productList.innerHTML = `<p>Aucun produits disponibe</p>`
        }
        let allButton = productList.querySelectorAll('.list .add-to-cart')
        allButton.forEach(btn =>{
            btn.addEventListener('click', () =>{
                const parentElement = btn.parentElement
                const image = parentElement.querySelector('img').src;
                const description = parentElement.querySelector('p').textContent;
                const productName = parentElement.querySelector('p:nth-child(3)').textContent;
                const reductPrice = parentElement.querySelector('.prix p').textContent;
                const produit = {
                    image: image ,
                    description: description,
                    name: productName,
                    price: reductPrice,
                    qte: 1 ,
                    totalPrice: reductPrice
                } 
                addToCart(produit)
            })
        })
    })
}

function addToCart(produit) {
    cart.push(produit);
    localStorage.setItem('monPanier', JSON.stringify(cart));
}
let cartContent = JSON.parse(localStorage.getItem('monPanier'))
const cartItemContainer = document.querySelector('#cart-items') 
if (cartContent.length === 0) {
    cartItemContainer.innerHTML = '<h2>Votre panier est vide.</h2>'
}
