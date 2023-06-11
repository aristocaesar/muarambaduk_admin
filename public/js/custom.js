// Utils Function
function copyToClipborad(value) {
  navigator.clipboard.writeText(value);
}

function stringToSlug(value) {
  return value.toLowerCase().split(' ').join('-');
}

function toRupiah(input) {
  const angka = input.value.replace(/\D/g, '');

  let rupiah = '';
  const angkaRev = angka.toString().split('').reverse().join('');
  for (let i = 0; i < angkaRev.length; i++) {
    if (i % 3 == 0) {
      rupiah += angkaRev.substr(i, 3) + '.';
    }
  }

  input.value =
    'Rp. ' +
    rupiah
      .split('', rupiah.length - 1)
      .reverse()
      .join('');
}

function inputNumberOnly(input) {
  const value = input.value.replace(/\D/g, '');

  if (value != '') {
    if (value.charAt(0) == 0) {
      input.value = '';
    } else {
      input.value = value;
    }
  } else {
    input.value = '';
  }
}

function addProductQuantity(input, index) {
  const value = input.value.replace(/\D/g, '');

  const btnAdd = document.getElementById(`btn-add-product-${index}`);

  if (value != '') {
    if (value.charAt(0) == 0) {
      input.value = '';
      btnAdd.setAttribute('disabled', 'disabled');
    } else {
      input.value = value;
      btnAdd.removeAttribute('disabled');
    }
  } else {
    input.value = '';
    btnAdd.setAttribute('disabled', 'disabled');
  }
}

function productSetSlug(input) {
  const slug = document.getElementById('slug');
  slug.value = stringToSlug(input.value);
}

async function getProductsNotAvaible(id) {
  await fetch(`/packages/product-not-avaible/${id}`)
    .then((response) => response.json())
    .then((_products) => {
      document.getElementById('list-products-loading').classList.add('d-none');
      document
        .getElementById('list-products-not-avaible')
        .classList.remove('d-none');
      let productsElement = [];
      _products.map((product, index) => {
        productsElement.push(`
        <form method="post" action="/packages/${id}/store-product" class="col-12 my-3">
            <div class="files-area d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="files-area__img">
                      <img src="${product.image}" alt="img" width="100" class="rounded">
                  </div>
                  <div class="files-area__title">
                      <input type="text" class="d-none" name="title" value="${product.title}" />
                      <p class="mb-0 fs-14 fw-500 color-dark text-capitalize">${product.title}</p>
                      <span class="color-light fs-12 d-flex my-2">Kuantitas</span>
                      <input type="number" class="form-control" placeholder="0" oninput="addProductQuantity(this, ${index})" name="quantity" required />
                  </div> 
                </div>
                <div class="d-flex flex-column">
                  <button type="submit" id="btn-add-product-${index}" class="btn btn-primary btn-xs" disabled>Tambah</button>
                </div>
            </div>
        </form>`);
      });
      document.getElementById('list-products-not-avaible').innerHTML =
        productsElement.join('');
    });
}
