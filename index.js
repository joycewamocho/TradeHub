const baseUrl = "https://my-json-server.typicode.com/joycewamocho/TradeHub/products";
const usersUrl = "https://my-json-server.typicode.com/joycewamocho/TradeHub/users";
const cartUrl = "http://localhost:3000/cart"; 
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

//post products to database
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

        fetch("http://localhost:3000/products", {
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

//Display product
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

    // Add to cart functionality
    const cartBtn = productDiv.querySelector(".cart-btn");
    cartBtn.addEventListener("click", () => addToCart(myProducts));
}

const getProduct = () => {
    fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
        products.forEach((product) => displayProduct(product));
    });
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

const addToCart = (product) => {
    totalPrice += parseFloat(product.price); // Ensure price is treated as a number

    fetch(cartUrl, {
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
        displayCart(); // Update the cart display
    })
    .catch(error => {
        console.error("Error adding to cart:", error);
    });
}

const displayCart = () => {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "<h3>Your cart</h3>"; // Header for the cart items

    fetch(cartUrl)
    .then(response => response.json())
    .then((cartItems) => {
        if (cartItems.length === 0) {
            cartList.innerHTML += "<p>Your cart is empty.</p>"; // Display message if no items in cart
            document.getElementById("total").textContent = "Total: $0.00"; // Reset total price
            return;
        }

        let totalCartPrice = 0; // Initialize total price based on cart items

        cartItems.forEach((product) => {
            const cartItem = document.createElement("p");
            cartItem.textContent = `${product.name} - $${product.price}`;
            cartList.appendChild(cartItem);

            totalCartPrice += parseFloat(product.price); // Accumulate total price
        });

        // Update the total price
        const totalPriceDiv = document.getElementById("total");
        console.log(totalPriceDiv);
        totalPriceDiv.textContent = `Total: $${totalCartPrice.toFixed(2)}`;

        // Remove previous Buy button if it exists
        const existingBuyButton = document.querySelector('.btn-primary');
        if (existingBuyButton) {
            existingBuyButton.remove();
        }

        // Create and append the "Buy All" button
        const buyButton = document.createElement("button");
        buyButton.textContent = "Buy All";
        buyButton.className = "btn btn-primary"; // Add Bootstrap button style
        buyButton.addEventListener("click", buyAllProducts);

        // Append the button after total price
        totalPriceDiv.parentElement.appendChild(buyButton);
    })
    .catch(error => {
        console.error("Error displaying cart:", error);
    });
}

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
                totalPrice = 0; // Reset total price after purchase
                displayCart(); // Refresh cart display
            })
            .catch(error => {
                console.error("Error clearing cart:", error);
            });
        });
    }
}
