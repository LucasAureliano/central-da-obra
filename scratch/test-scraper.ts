import { searchObramax } from '../api/_adapters/obramax';

async function run() {
  console.log('Testing Obramax: Cimento');
  const url = `https://www.obramax.com.br/catalogsearch/result/?q=cimento`;
  const response = await fetch(url);
  console.log('Obramax status:', response.status);
  const text = await response.text();
  console.log('Obramax Length:', text.length);
}

run();
