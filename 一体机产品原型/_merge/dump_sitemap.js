// Dump Axure sitemap (page tree) of every version folder
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const versions = fs.readdirSync(ROOT).filter(d => /^\d+-B/.test(d)).sort((a, b) => parseInt(a) - parseInt(b));

function loadDoc(file) {
  let result = null;
  const sandbox = { $axure: { loadDocument: o => { result = o; } } };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox);
  return result;
}

const out = {};
for (const v of versions) {
  const doc = loadDoc(path.join(ROOT, v, 'data', 'document.js'));
  const walk = (nodes, depth) => (nodes || []).map(n => ({
    name: n.pageName, type: n.type, url: n.url || null,
    children: walk(n.children, depth + 1)
  }));
  out[v] = walk(doc.sitemap && doc.sitemap.rootNodes, 0);
  process.stdout.write('=== ' + v + '\n');
  const print = (nodes, d) => nodes.forEach(n => {
    process.stdout.write('  '.repeat(d + 1) + (n.type === 'Folder' ? '[F] ' : '') + n.name + (n.url ? '  <' + n.url + '>' : '') + '\n');
    print(n.children, d + 1);
  });
  print(out[v], 0);
}
fs.writeFileSync(path.join(__dirname, 'sitemap.json'), JSON.stringify(out, null, 2), 'utf8');