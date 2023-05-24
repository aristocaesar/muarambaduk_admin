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

function productSetSlug(input) {
  const slug = document.getElementById('slug');
  slug.value = stringToSlug(input.value);
}
