let tab = localStorage.getItem('customer')
if(! tab) localStorage.setItem('customer', JSON.stringify([]))
const form = document.querySelector('#field')
let customerList = JSON.parse(tab)
if (form) {
    form.addEventListener('submit', e=>{
        e.preventDefault()
        let customerName = form.querySelector('#name').value
        let customerEmail = form.querySelector('#mail').value
        let customerPassword = form.querySelector('#init-password').value
        let customerConfirmPassword = form.querySelector('#re-password').value
        if (customerName == "" || customerEmail == "" || customerPassword == "" || customerConfirmPassword == "") {
            let erreur_msg = document.getElementById('erreur_msg')
            erreur_msg.innerHTML = "veuillez saisir tous les champs"
            erreur_msg.style.display = "block" 
        }else if (customerPassword != customerConfirmPassword) {
            let error = document.querySelector('.confirm')
            error.innerHTML =  "mot de passe erroné"
            error.style.display = "block"
            const input = form.querySelector('#re-password')
            input.addEventListener('input', () =>{
                error.style.display = "none"
            })
        } else {
            const customer = {
                name: customerName ,
                emailOrNumber: customerEmail,
                password: customerPassword
            }
            customerList.push(customer)
            localStorage.setItem('customer', JSON.stringify(customerList))
            displayModal()
        }
    })
}
function  displayModal() {
    const modal = document.querySelector('.modal')
    const user = document.querySelector('#user')
    modal.style.display = "flex"
    customerList = JSON.parse(localStorage.getItem('customer'))
    customerList.forEach(item => {
        user.innerHTML = `${item.name}`
    });
    const body = document.querySelector('#body')
    body.style.backgroundColor = "#00000033"
    const champ = document.querySelector('.form')
    champ.style.display = "none"
    const logo = document.querySelector('a h2')
    logo.style.display = "none"

    const closeBtn = document.querySelector('#button')
    if (closeBtn) {
        closeBtn.addEventListener('click', () =>{
            modal.style.display = "none"
            body.style.backgroundColor = "#fff"
            champ.style.display = "block"
            logo.style.display = "block"
        }) 
    }
}

const connectForm = document.querySelector('#connect')
if (connectForm) {
    customerList = JSON.parse(localStorage.getItem('customer'))
    connectForm.addEventListener('submit', e=>{
        e.preventDefault()
        const emailNumber = document.querySelector('#email').value
        customerList.forEach(item =>{
            if (emailNumber != item.emailOrNumber) {
                connectForm.innerHTML += `<h3 style: color: red;>Votre compte n'est pas trouvé,créez en un</h3>`
            }
        })
    })
}