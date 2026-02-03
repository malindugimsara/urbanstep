export function GetCart() {
    let cart = localStorage.getItem("cart");
    if (cart==null) {
        cart = []
        localStorage.setItem("cart", JSON.stringify(cart));
        return [];
    } 

    cart = JSON.parse(cart);
    return cart;
}

export function AddToCart(product, qty) {
    let cart = GetCart();
    console.log(cart);

    const productIndex = cart.findIndex((prdct) => prdct.productId === product.productId);
    if (productIndex===-1) {
        cart.push({
            productId: product.productId,
            name : product.name,
            altname: product.altName,
            price : product.price,
            lableprice : product.lablePrice,
            image : product.images[0],
            quantity : qty
        });
    } else{
        cart[productIndex].quantity += qty;
        if (cart[productIndex].quantity <= 0){
            cart = cart.filter((product) => product.productId !== product.productId)
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

export function RemoveFromCart(productId) {
    let cart = GetCart();
    cart = cart.filter((prdct) => prdct.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

export function GetTotal(){
    let cart = GetCart();
    let total = 0;
    cart.forEach((product) => {
        total += product.price * product.quantity;
    });
    return total;
}

export function GetTotalForLablePrice(){
    let cart = GetCart();
    let lablePrice = 0;
    cart.forEach((product) => {
        lablePrice += product.lableprice * product.quantity;
    }); 
    return lablePrice;
} 