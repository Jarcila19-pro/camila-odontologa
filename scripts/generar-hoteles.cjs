const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..', 'public', 'images', 'hoteles');
const hoteles = ['estelar', 'porton', 'santa-ana'];
const manifesto = {};

for (const hotel of hoteles) {
  const dir = path.join(raiz, hotel);
  let archivos = [];
  if (fs.existsSync(dir)) {
    archivos = fs.readdirSync(dir)
      .filter(f => /\.(webp|jpe?g|png|avif)$/i.test(f))
      .sort();
  }
  manifesto[hotel] = archivos;
}

fs.writeFileSync(
  path.join(raiz, 'hoteles.json'),
  JSON.stringify(manifesto, null, 2)
);

Object.entries(manifesto).forEach(([k, v]) => {
  console.log(k + ': ' + v.length + ' foto(s)');
});
console.log('hoteles.json actualizado.');
