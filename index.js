const baseUrl ="https://my-json-server.typicode.com/joycewamocho/TradeHub/products"
const usersUrl ="https://my-json-server.typicode.com/joycewamocho/TradeHub/users"
let cart =[]
const main = ()=>{
    document.addEventListener("DOMContentLoaded", ()=>{
      postProducts(); 
      getProduct();
      searchProduct();
      displayCart();
    })
}

main()

const postProducts =()=>{
    const productForm = document.getElementById("product-form")
    productForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        console.log(productForm)
        const myProducts ={
            name: productForm["product-name"].value,
            description:productForm["product-description"].value,
            price:productForm["product-price"].value,
            contact:productForm["seller-contact"].value,
            image: productForm["product-image"].value
        }

    fetch(baseUrl,{
        method:"POST",
        headers:{
            "content-type":"application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify(myProducts)

    })
    .then((response)=> response.json())
    .then((product)=>{
        console.log("product posted",product);
        displayProduct(product);
        productForm.reset();
    })
    .catch((error)=>{
        console.error("unable to post product",error);
    })
        
    })
}

const displayProduct=(myProducts)=>{
    const productList =document.getElementById("product-list")
    const productDiv =document.createElement("div")
    productDiv.className = 'col-md-4 mb-4';
    productDiv.innerHTML =`
     <div class="card">
        <img src="${myProducts.image}" class="card-img-top" alt="${myProducts.name}">
        <div class="card-body">
            <h5 class="card-title">${myProducts.name}</h5>
            <p class="card-text">${myProducts.description}</p>
            <p class="card-text">Price: $${myProducts.price}</p>
            <p class="card-text">Contact: ${myProducts.contact}</p>
            <button class="btn btn-success cart-btn" data-id="${myProducts.id}">Add to Cart</button>
            <button class="btn btn-primary buy-btn" data-id="${myProducts.id}">Buy Now</button>
        </div>
    </div>
    `
    productList.appendChild(productDiv)

    //add to cart functionality
    const cartBtn = productDiv.querySelector(".cart-btn")
    cartBtn.addEventListener("click",()=> addToCart(myProducts))
    
    //buy functionality
    const buyBtn =productDiv.querySelector(".buy-btn")
    buyBtn.addEventListener("click",() => buyProduct(myProducts) )

}

const getProduct=()=>{
    fetch(baseUrl)
    .then((response)=>response.json())
    .then((products)=>{
        products.forEach((product)=>displayProduct(product))
    })
}

const searchProduct = () => {
    const searchInput = document.querySelector('input[type="search"]');
    const productList = document.getElementById('product-list');
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const products = productList.querySelectorAll('.card');
  
      products.forEach((product) => {
        const productName = product.querySelector('.card-title').textContent.toLowerCase();
        if (productName.includes(query)) {
          product.style.display = ''; 
        } else {
          product.style.display = 'none';
        }
      });
    });
  }

const addToCart =(product)=>{
    cart.push(product)
    alert(`${product.name} has been added to cart`)
    displayCart()

}

const displayCart =()=>{
   const  cartList =document.getElementById("cart-list")
    cartList.innerHTML = "<h3>Your cart</h3>"

    if(cart.length === 0){
        cartList.innerHTML = "<p>Your cart is empty.</p>";
        return
    }

    cart.forEach((product) => {
        const cartItem = document.createElement("p");
        cartItem.textContent = `${product.name} - $${product.price}`;
        cartList.appendChild(cartItem);
    });
}

const buyProduct =(product)=>{
    const confirmation =confirm(`Do you want to buy ${product.name}?`)
    if(confirmation){
        alert(`Thank you for buying ${product.name} !`)
        cart = cart.filter((item) => item.id !== product.id);
        displayCart();
    }

}