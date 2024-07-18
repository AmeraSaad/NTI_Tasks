document.addEventListener('DOMContentLoaded', () => {
  fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(products => {
          window.allProducts = products;
          window.filteredProducts = products;
          displayProducts(products, 1);
          setupPagination(products.length);
      })
      .catch(error => console.error('Error fetching the products:', error));

  document.getElementById('apply-filters').addEventListener('click', applyFilters);
});

function displayProducts(products, page) {
  const productsPerPage = 4;
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  paginatedProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('col-md-4', 'col-sm-6', 'mb-4');

      productCard.innerHTML = `
          <div class="card h-100">
              <img src="${product.image}" class="card-img-top" alt="${product.title}">
              <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">$${product.price}</p>
                  <p class="card-text">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
                  <a href="#" class="btn btn-primary">View Details</a>
                  <a href="#" class="btn btn-success" onclick="addToCart(${product.price})">Add to Cart</a>
              </div>
          </div>
      `;

      productList.appendChild(productCard);
  });
}

function setupPagination(totalProducts) {
  const productsPerPage = 4;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement('li');
      pageItem.classList.add('page-item');
      pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageItem.addEventListener('click', (e) => {
          e.preventDefault();
          displayProducts(window.filteredProducts, i);
      });
      pagination.appendChild(pageItem);
  }
}

function applyFilters() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const categorySelect = document.getElementById('category-select').value;
  const minPrice = parseFloat(document.getElementById('min-price').value);
  const maxPrice = parseFloat(document.getElementById('max-price').value);
  const sortSelect = document.getElementById('sort-select').value;

  let filtered = window.allProducts.filter(product => {
      return (
          (!categorySelect || product.category === categorySelect) &&
          (!searchInput || product.title.toLowerCase().includes(searchInput)) &&
          (!minPrice || product.price >= minPrice) &&
          (!maxPrice || product.price <= maxPrice)
      );
  });

  if (sortSelect) {
      filtered = filtered.sort((a, b) => {
          switch (sortSelect) {
              case 'price-asc':
                  return a.price - b.price;
              case 'price-desc':
                  return b.price - a.price;
              case 'rating-asc':
                  return a.rating.rate - b.rating.rate;
              case 'rating-desc':
                  return b.rating.rate - a.rating.rate;
              default:
                  return 0;
          }
      });
  }

  window.filteredProducts = filtered;
  displayProducts(filtered, 1);
  setupPagination(filtered.length);
}

function addToCart(price) {
  const cartQuantity = document.getElementById('cart-quantity');
  const cartTotalPrice = document.getElementById('cart-total-price');

  let currentQuantity = parseInt(cartQuantity.innerText);
  let currentTotalPrice = parseFloat(cartTotalPrice.innerText);

  currentQuantity += 1;
  currentTotalPrice += price;

  cartQuantity.innerText = currentQuantity;
  cartTotalPrice.innerText = currentTotalPrice.toFixed(2);
}
