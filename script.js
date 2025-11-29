//burger toggle

const burger = document.getElementById("burger");
const navLinks = document.getElementById("nav-links");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  navLinks.classList.toggle("show");
});

// this is the onload animation po
// Select all content elements in section-1 and section-2
const contents = document.querySelectorAll(
  ".section-1 .content, .section-2 .content.title, .about-image,.p-1,.p-2,.p-3"
);
let thresholdValue = window.innerWidth < 400 ? 0.2 : 0.5;
// Create an Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
          // Stop observing this element if you only want the animation once
          observer.unobserve(entry.target);
        }, 300); // 0.5 second delay
      } else {
        entry.target.classList.remove("show"); // remove when out of view
      }
    });
  },
  { threshold: thresholdValue } // triggers when 50% of the element is visible
);

// Observe each content element
contents.forEach((content) => {
  observer.observe(content);
});

// ----------------- Cart Functions -----------------

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll("#cart-count").forEach((el) => (el.textContent = cart.length));
}

// ----------------- Menu Page -----------------

function displayMenu() {
  const menu = [
    { name: "Lumpia Shanghai", price: 5, img: "image/lumpia shanghai.jpg" },
    { name: "Lumpia Vegetable", price: 4, img: "image/lumpia vegetable.jpg" },
    { name: "Lumpia Special", price: 6, img: "image/lumpia special.jpg" },
    { name: "Lumpia Sweet", price: 5, img: "image/lumpia sweet.jpg" },
    { name: "Lumpia Beef", price: 7, img: "image/lumpia beef.jpg" },
    { name: "Lumpia Cheese", price: 6, img: "image/lumpia cheese.jpg" },
  ];

  const menuContainer = document.getElementById("menu-items");
  if (!menuContainer) return;

  menuContainer.innerHTML = "";

  menu.forEach((item) => {
    let quantity = 1;

    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
  <div class="menu-img-wrapper">
    <img src="${item.img}" alt="${item.name}" class="menu-img" />
  </div>

  <h3 class="menu-name">${item.name}</h3>

  <div class="menu-price-qty">
    <p class="menu-price">₱${item.price}</p>

    <div class="menu-controls">
      <button class="minus">-</button>
      <span class="quantity">${quantity}</span>
      <button class="plus">+</button>
    </div>
  </div>

  <div class="button-wrapper">
  <button class="add-to-cart">Add to Cart</button>
  </div>
`;

    menuContainer.appendChild(div);

    const minusBtn = div.querySelector(".minus");
    const plusBtn = div.querySelector(".plus");
    const qtySpan = div.querySelector(".quantity");
    const addBtn = div.querySelector(".add-to-cart");

    minusBtn.addEventListener("click", () => {
      if (quantity > 1) quantity--;
      qtySpan.textContent = quantity;
    });

    plusBtn.addEventListener("click", () => {
      quantity++;
      qtySpan.textContent = quantity;
    });

    addBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      for (let i = 0; i < quantity; i++) {
        cart.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(`${item.name} x${quantity} added to cart!`);
    });
  });
}

// ----------------- Cart Page -----------------

function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty">
    <img src="image/box.png"  alt="" /> 
    <p>Your cart is empty.  </p>
    </div>`;
    return;
  }

  // Aggregate items by name
  const aggregated = {};
  cart.forEach((item) => {
    if (aggregated[item.name]) {
      aggregated[item.name].quantity += 1;
    } else {
      aggregated[item.name] = { ...item, quantity: 1 };
    }
  });

  cartContainer.innerHTML = "";

  Object.values(aggregated).forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` 
      <img src="${item.img}" alt="${item.name}" class="cart-img" />
      <span>${item.name} - ₱${item.price} Total (${item.quantity} item): ₱${item.price * item.quantity}</span>
      <button onclick="removeFromCartItem('${item.name}')">Remove</button>
    `;
    cartContainer.appendChild(div);
  });
}

// Remove all of a specific item from cart
function removeFromCartItem(itemName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.name !== itemName);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}
function orderNow() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({ items: cart, date: new Date().toLocaleString() });
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");
  updateCartCount();
  displayCart();
  alert("Order placed successfully!");
}
// ----------------- History Page -----------------

function displayHistory() {
  const historyContainer = document.getElementById("history-container");
  if (!historyContainer) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    historyContainer.innerHTML = `
    <div class="empty">
    <img src="image/box.png"  alt="" /> 
    <p>No orders yet.  </p>
    </div>`;
    return;
  }

  historyContainer.innerHTML = "";

  orders.forEach((order, orderIndex) => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.innerHTML = `<strong>Order #${orderIndex + 1} - ${order.date}</strong>`;

    // Aggregate items by name
    const aggregated = {};
    order.items.forEach((item) => {
      if (aggregated[item.name]) {
        aggregated[item.name].quantity += 1;
      } else {
        aggregated[item.name] = { ...item, quantity: 1 };
      }
    });

    Object.values(aggregated).forEach((item) => {
      const p = document.createElement("p");
      p.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="history-img" />
        ${item.name} - ₱${item.price} Total (${item.quantity} item): ₱${item.price * item.quantity}
      `;
      div.appendChild(p);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel Order";
    cancelBtn.addEventListener("click", () => cancelOrder(orderIndex));
    div.appendChild(cancelBtn);

    historyContainer.appendChild(div);
  });
}

function cancelOrder(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (index >= 0 && index < orders.length) {
    if (confirm("Are you sure you want to cancel this order?")) {
      orders.splice(index, 1);
      localStorage.setItem("orders", JSON.stringify(orders));
      displayHistory();
      alert("Order canceled.");
    }
  }
}

// ----------------- Initialization -----------------

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayMenu();
  displayCart();
  displayHistory();

  const orderBtn = document.getElementById("order-now");
  if (orderBtn) orderBtn.addEventListener("click", orderNow);
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");

  if (window.scrollY > 150) {
    // change 50 to control scroll threshold
    nav.style.backgroundColor = "rgba(51, 39, 39, 0.9)";
  } else {
    nav.style.backgroundColor = "transparent"; // hide background
  }
});

// ----------------- section-2 content -----------------
// Data for items
const items = [
  {
    title: "Lumpia Classic",
    description:
      "Our signature lumpia is freshly made with savory pork, crisp vegetables, and a perfect blend of spices. Each bite delivers a deliciously balanced taste that’s both crunchy on the outside and tender on the inside, ideal for lunch, dinner, or any special occasion.",
    image: "image/lumpia shanghai.jpg",
  },
  {
    title: "Cheese Lumpia",
    description:
      "Delight in our Cheese Lumpia, filled with gooey, melted cheese and lightly seasoned vegetables. Crispy on the outside, creamy and flavorful on the inside, this treat is perfect for cheese lovers looking for a warm, comforting snack or appetizer.",
    image: "image/lumpia cheese.jpg",
  },
  {
    title: "Vegetable Lumpia",
    description:
      "A healthy vegetarian option, packed with fresh vegetables, herbs, and subtle spices. Each bite is bursting with natural flavors, offering a light yet satisfying experience. Perfect for anyone who wants a delicious snack without compromising on nutrition.",
    image: "image/lumpia vegetable.jpg",
  },
];

// Select the existing section-2 container
const section2 = document.querySelector(".section-2.index");

// Loop through items and generate HTML inside section-2
items.forEach((item, index) => {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  if (index % 2 !== 0) {
    itemDiv.classList.add("reverse");
  }

  itemDiv.innerHTML = `
    <div class="item-image"><img src="${item.image}"></div>
    <div class="item-description">
      <h2>${item.title}</h2>
      <p>${item.description}</p>
    </div>
  `;

  section2.appendChild(itemDiv);

  // Add this item to the observer
  observer.observe(itemDiv);
});
