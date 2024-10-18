const baseUrl = "http://localhost:3000/products"
const cartUrl = "http://localhost:3000/cart"
let totalPrice = 0;

const main = () => {
    document.addEventListener("DOMContentLoaded", () => {
        postProducts();
        getProduct();
        searchProduct();
        displayCart();
        toggleLoginForm();
    });
}

main();
//toggle login form
const toggleLoginForm = () => {
    const toggleButton = document.getElementById("toggle-login");
    const loginSection = document.getElementById("login");

    console.log(toggleButton);
    toggleButton.addEventListener("click", () => {
        if (loginSection.style.display === "none" || loginSection.style.display === "") {
            loginSection.style.display = "block";
        } else {
            loginSection.style.display = "none";
        }
    });
}

//post product to database
const postProducts = () => {
    const productForm = document.getElementById("product-form");
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(productForm);
        const myProducts = {
            name: productForm["product-name"].value,
            description: productForm["product-description"].value,
            price: productForm["product-price"].value,
            contact: productForm["seller-contact"].value,
            image: productForm["product-image"].value
        }

        fetch(`${baseUrl}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(myProducts)
        })
        .then((response) => response.json())
        .then((product) => {
            console.log("product posted", product);
            displayProduct(product);
            productForm.reset();
        })
        .catch((error) => {
            console.error("unable to post product", error);
        })
    });
}

//display products to UI
const displayProduct = (myProducts) => {
    const productList = document.getElementById("product-list");
    const productDiv = document.createElement("div");
    productDiv.className = 'col-md-4 mb-4';
    productDiv.innerHTML = `
     <div class="card">
        <img src="${myProducts.image}" class="card-img-top" alt="${myProducts.name}">
        <div class="card-body">
            <h5 class="card-title">${myProducts.name}</h5>
            <p class="card-text">${myProducts.description}</p>
            <p class="card-text">Price: $${myProducts.price}</p>
            <p class="card-text">Contact: ${myProducts.contact}</p>
            <button class="btn btn-success cart-btn" data-id="${myProducts.id}">Add to Cart</button>
        </div>
    </div>
    `;
    productList.appendChild(productDiv);

    const cartBtn = productDiv.querySelector(".cart-btn");
    cartBtn.addEventListener("click", () => addToCart(myProducts));
}

//gretrieve product from the database
const getProduct = () => {
    fetch(baseUrl)
    .then((response) => response.json())
    .then((products) => {
        products.forEach((product) => displayProduct(product));
    });
}

//search functionality
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

const addToCart = (product) => {
    totalPrice += parseFloat(product.price); 

    fetch(`${cartUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(() => {
        alert(`${product.name} has been added to cart`);
        displayCart(); 
    })
    .catch(error => {
        console.error("Error adding to cart:", error);
    });
}
//display products that has been added to cart
const displayCart = () => {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "<h3>Your cart</h3>";

    fetch(cartUrl)
    .then(response => response.json())
    .then((cartItems) => {
        if (cartItems.length === 0) {
            cartList.innerHTML += "<p>Your cart is empty.</p>"; 
            document.getElementById("total").textContent = "Total: $0.00"; 
            return;
        }

        let totalCartPrice = 0; 

        cartItems.forEach((product) => {
            const cartItem = document.createElement("p");
            cartItem.textContent = `${product.name} - $${product.price}`;
            cartList.appendChild(cartItem);

            totalCartPrice += parseFloat(product.price); 
        });

        const totalPriceDiv = document.getElementById("total");
        console.log(totalPriceDiv);
        totalPriceDiv.textContent = `Total: $${totalCartPrice.toFixed(2)}`;

        
        const existingBuyButton = document.querySelector('.btn-primary');
        if (existingBuyButton) {
            existingBuyButton.remove();
        }

        
        const buyButton = document.createElement("button");
        buyButton.textContent = "Buy All";
        buyButton.className = "btn btn-primary"; 
        buyButton.addEventListener("click", buyAllProducts);

        
        totalPriceDiv.parentElement.appendChild(buyButton);
    })
    .catch(error => {
        console.error("Error displaying cart:", error);
    });
}
//buy functionality
const buyAllProducts = () => {
    if (confirm("Do you want to purchase all the items in your cart?")) {
        fetch(cartUrl)
        .then(response => response.json())
        .then((cartItems) => {
            const deletePromises = cartItems.map(item =>
                fetch(`${cartUrl}/${item.id}`, { method: "DELETE" })
            );

            Promise.all(deletePromises)
            .then(() => {
                alert("Thank you for your purchase!");
                totalPrice = 0; 
                displayCart(); 
            })
            .catch(error => {
                console.error("Error clearing cart:", error);
            });
        });
    }
}
