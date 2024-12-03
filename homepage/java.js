const header = document.querySelector("header");
const menuIcon = document.getElementById('menu_icon');
const dropdownMenu = document.getElementById('dropdown_menu');
let menu = document.querySelector('#menu_icon');
let navmenu = document.querySelector('.nav_menu');
let overlay = document.querySelector('.overlay');
let cart_overlay = document.querySelector('.cart_overlay');
let cart_icon = document.querySelector('#cart_icon')
let sidecart = document.querySelector('.sidecart'); 
let cart_close_btn = document.querySelector('.close_btn');
let cart_btn = document.querySelector('.checkout_btn');
const searchBar = document.querySelector('.search_bar');
const searchIcon = document.querySelector('#search_icon');
const closeSearch = document.querySelector('#close_search');
let cart_icon3 = document.querySelector('#cart_icon3')
let cart_overlay3 = document.querySelector('.cart_overlay3');
const cartItemsContainer = document.querySelector(".cart_items");
    const totalPriceElement = document.getElementById("total_price");

const suggestionsData = [
    { name: 'Home', url: 'index.html' },
    { name: 'Shop', url: 'shop.html' },
    { name: 'About Us', url: '#footer_section' },
];

// NAVIGATION BAR CHANGE COLOR WHEN SCROLLING
window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", window.scrollY > 0);
})


// OPEN SIDECART
cart_icon.addEventListener('click', function() {
    sidecart.classList.add('open');
});

// CLOSE SIDECART
cart_close_btn.addEventListener('click', function() {
    sidecart.classList.remove('open');
});


// OPEN MENU ICON
menuIcon.addEventListener('click', function() {
    // Toggle the visibility of the dropdown menu
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

/// Open search bar
searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    searchBar.classList.add('open');
    searchSuggestions.style.display = 'none'; // Hide suggestions initially
    searchInput.focus();
});

// Close search bar
closeSearch.addEventListener('click', () => {
    searchBar.classList.remove('open');
    searchSuggestions.style.display = 'none'; // Hide suggestions when closing search bar
});


// CART CHECKOUT BUTTON
cart_btn.addEventListener('click', () => {
    window.location.href = '/homepage/CheckoutDetails/checkout.html'; 
  });

//OPEN MENU
menu.onclick = () => {
    if (window.innerWidth <= 600) {  // Check if the screen width is 600px or less
        menu.classList.toggle('bx-x');
        navmenu.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}


// OPEN SIDECART
cart_icon.onclick = () =>{
    cart_overlay.classList.toggle('active');
    document.body.classList.add('no-scroll'); // Disable body scroll

}

//CART OVERLAY
cart_overlay.onclick = () =>{
    sidecart.classList.remove('open');
    cart_overlay.classList.remove('active');
    document.body.classList.remove('no-scroll'); // Disable body scroll
    
}

//CLOSE CART OVERLAY
cart_close_btn.onclick = () => {
    sidecart.classList.remove('open');
    cart_overlay.classList.remove('active');
    document.body.classList.remove('no-scroll'); // Disable body scroll

};

//MENU OVERLAY
overlay.onclick = () => {
    navmenu.classList.remove('open');
    overlay.classList.remove('active');
    menu.classList.remove('bx-x'); 
};







