const main = ()=>{
    document.addEventListener("DOMContentLoaded", ()=>{
      postProducts(); 
      getProduct();

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

    fetch("http://localhost:3000/products",{
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
    })
    .catch((error)=>{
        console.error("unable to post product",error);
    })
        
    })
}

const displayProduct=(myProducts)=>{
    const productList =document.getElementById("product-list")
    console.log(productList)
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
            <button class="btn btn-success buy-btn" data-id="${myProducts.id}">Buy</button>
        </div>
    </div>
    `
    productList.appendChild(productDiv)


}

const getProduct=()=>{
    fetch("http://localhost:3000/products")
    .then((response)=>response.json())
    .then((products)=>{
        products.forEach((product)=>displayProduct(product))
    })
}
