// 合并 8 个版本的 Axure 原型（每版只含改动），按模块归类，生成汇总 HTML
// 输出：../原型汇总.html（面试版，不含粉红色内部讨论）、../原型汇总-内部版.html（完整）
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const versions = fs.readdirSync(ROOT).filter(d => /^\d+-B/.test(d)).sort((a, b) => parseInt(a) - parseInt(b));

// 背景色 → 注释类别（按 r,g,b 匹配）；ui=true 表示属于界面内容，internal=true 表示面试版隐藏
const COLOR_CATS = {
  '255,223,37': { key: 'rule', label: 'PRD 规则', color: '#FFDF25' },
  '255,255,128': { key: 'change', label: '修改说明', color: '#FFFF80' },
  '215,215,215': { key: 'reason', label: '设计原因', color: '#D7D7D7' },
  '236,128,141': { key: 'internal', label: '内部讨论/风险', color: '#EC808D', internal: true },
  '208,225,125': { key: 'dev', label: '研发反馈/范围', color: '#D0E17D' },
  '128,255,255': { key: 'error', label: '异常提示文案', color: '#80FFFF' },
  '255,251,230': { key: 'guide', label: '界面操作说明', color: '#FFFBE6', ui: true },
  '242,242,242': { key: 'dialog', label: '弹窗正文', color: '#F2F2F2', ui: true }
};
const CAT_BY_KEY = Object.fromEntries(Object.values(COLOR_CATS).map(c => [c.key, c]));

// 模块定义（与 docs/需求清单.md 第三章一致，另加全局、对接、待归类）
const MODULES = [
  ['G0', '总体说明'], ['G1', '全局规则（多人操作/关机等）'],
  ['M00', '登录'], ['M01', '激活模块（首次激活向导）'], ['M02', '配置模块（配置修改向导）'],
  ['M03', '升级模块'], ['M04', '备份模块'], ['M05', '还原模块'], ['M06', '服务监测模块'],
  ['M07', '项目信息模块'], ['M08', '重置模块'], ['M09', '个人中心'], ['M10', '国际化语言'],
  ['X1', '翼飞平台 / 业务中台（不在本期范围）'], ['X2', '激活码管理（平台侧）'], ['Z', '待归类']
];

// 按「目录路径/页面名」顺序匹配，先命中先用
const RULES = [
  [/翼飞|业务中台|建图采集|比对标注/, 'X1'],
  [/设备激活码|设备列表|编辑设备$/, 'X2'],
  [/多人操作|当前操作人|关机/, 'G1'],
  [/服务库|版本字典|编辑服务/, 'M03'],
  [/重置/, 'M08'],
  [/升级|更新/, 'M03'],
  [/备份/, 'M04'],
  [/还原|复原|导入|上传数据/, 'M05'],
  [/服务监测|监测|监控/, 'M06'],
  [/修改密码/, 'M09'],
  [/国际化|语言/, 'M10'],
  [/登录/, 'M00'],
  [/项目信息(?!配置)/, 'M07'],
  [/配置模块|修改信息内容|^配置|配置>>|配置-第六步|配置重启/, 'M02'],
  [/激活|初始化|第.步|可选服务|基础服务|本地服务|网络信息|项目信息配置|密钥|AI识别|算图|NTP|暂存|\bip|DHCP|localhost|硬件|超脑|数据处理脚本|独立服务器/i, 'M01'],
  [/总体介绍|整体说明|整体目标|^需求$|修改部分|其他修改|其他优化|UI设计|时序图|区别|流程图/, 'G0']
];

function classify(chain) {
  const full = chain.join('/');
  for (const [re, m] of RULES) if (re.test(full)) return m;
  return 'Z';
}

function loadDoc(file) {
  let result = null;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { $axure: { loadDocument: o => { result = o; } } });
  return result;
}

const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// 解析单页：返回 [{cat, text}]，cat 为 null 表示普通界面文字
function parsePage(ver, url) {
  const htmlFile = path.join(ROOT, ver, url);
  const cssFile = path.join(ROOT, ver, 'files', url.replace(/\.html$/, ''), 'styles.css');
  if (!fs.existsSync(htmlFile)) return [];
  const html = fs.readFileSync(htmlFile, 'utf8');
  const bg = {};
  if (fs.existsSync(cssFile)) {
    const css = fs.readFileSync(cssFile, 'utf8');
    const re = /#(u\d+)(?:_div)?[^{,]*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(css))) {
      const c = m[2].match(/background-color:\s*rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
      if (c) {
        const k = c[1] + ',' + c[2] + ',' + c[3];
        if (COLOR_CATS[k]) bg[m[1]] = COLOR_CATS[k].key;
      }
    }
  }
  const items = [];
  const re = /<div id="(u\d+)_text"[^>]*>/g;
  const starts = [];
  let m;
  while ((m = re.exec(html))) starts.push({ id: m[1], pos: m.index, hidden: /display:none/.test(m[0]) });
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].pos : html.length;
    let chunk = html.slice(starts[i].pos, end);
    const cut = chunk.indexOf('<div id="u', 10);
    if (cut > 0) chunk = chunk.slice(0, cut);
    const text = decode(chunk.replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]*>/g, ''))
      .split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
    if (!text || starts[i].hidden) continue;
    items.push({ cat: bg[starts[i].id] || null, text });
  }
  return items;
}

// 1. 读取全部版本，按「模块 + 页面名」归并；同名页面后版覆盖前版，前版留作历史
const merged = {};
MODULES.forEach(([id]) => { merged[id] = {}; });
const unclassified = [];
for (const ver of versions) {
  const doc = loadDoc(path.join(ROOT, ver, 'data', 'document.js'));
  const walk = (nodes, chain) => (nodes || []).forEach(n => {
    const c = chain.concat(n.pageName);
    if (n.url) {
      const mod = classify(c);
      if (mod === 'Z') unclassified.push(ver + ' / ' + c.join(' / '));
      const key = n.pageName.replace(/[-—\s>_]+/g, '').replace(/\d{6,}.*$/, '');
      const pg = merged[mod][key] = merged[mod][key] || { name: n.pageName, history: [] };
      pg.history.push({ ver, chain: chain.join(' / '), url: ver + '/' + n.url, items: parsePage(ver, n.url) });
    }
    walk(n.children, c);
  });
  walk(doc.sitemap && doc.sitemap.rootNodes, []);
}

// 2. 生成汇总页；includeInternal=false 时整条剔除内部讨论，不只是隐藏
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
function build(includeInternal) {
  const keep = it => includeInternal || !(it.cat && CAT_BY_KEY[it.cat].internal);
  const data = MODULES.map(([id, name]) => ({
    id, name,
    pages: Object.values(merged[id]).map(p => ({
      name: p.name,
      latest: p.history[p.history.length - 1].ver,
      history: p.history.slice().reverse().map(h => Object.assign({}, h, { items: h.items.filter(keep) }))
    }))
  })).filter(m => m.pages.length);
  const cats = Object.values(COLOR_CATS).filter(c => includeInternal || !c.internal);
  const json = JSON.stringify({ versions, data, cats }).replace(/</g, '\\u003c');
  const title = includeInternal ? '一体机运维中心原型汇总（内部版）' : '一体机运维中心原型汇总';
  return TEMPLATE.split('__TITLE__').join(title).replace('__DATA__', () => json);
}
const pubHtml = build(false);
const fullHtml = build(true);

// 防泄漏断言：任一条不满足就报错退出，不写出面试版
const leakErrors = [];
const jsonFrag = t => JSON.stringify(t).slice(1, -1).replace(/</g, '\\u003c');
const allItems = [];
for (const id in merged) for (const p of Object.values(merged[id])) for (const h of p.history) {
  h.items.forEach(it => allItems.push({ where: h.url, it }));
}
const nonInternal = new Set(allItems.filter(x => x.it.cat !== 'internal').map(x => x.it.text));
// (1) 内部讨论文本不得出现在面试版；与界面文字完全同名的除外（如「minio服务器的账号」标签）
allItems.filter(x => x.it.cat === 'internal' && !nonInternal.has(x.it.text)).forEach(x => {
  if (pubHtml.includes(jsonFrag(x.it.text))) leakErrors.push('面试版含内部文本：' + x.where + ' → ' + x.it.text.slice(0, 40));
});
// (2) 样式里出现粉红色（含近似色）的页面，必须至少识别出一条 internal
const PINK = [236, 128, 141];
for (const ver of versions) {
  const filesDir = path.join(ROOT, ver, 'files');
  if (!fs.existsSync(filesDir)) continue;
  for (const pg of fs.readdirSync(filesDir)) {
    const cssFile = path.join(filesDir, pg, 'styles.css');
    if (!fs.existsSync(cssFile)) continue;
    const css = fs.readFileSync(cssFile, 'utf8');
    const near = [...css.matchAll(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/g)]
      .some(m => PINK.every((v, i) => Math.abs(v - Number(m[i + 1])) <= 12));
    if (!near) continue;
    const url = ver + '/' + pg + '.html';
    const hit = allItems.some(x => x.where === url && x.it.cat === 'internal');
    if (!hit) leakErrors.push('页面含粉红色但未识别出内部讨论，请人工检查：' + url);
  }
}
if (leakErrors.length) {
  process.stderr.write('【防泄漏检查未通过】面试版未写出：\n' + leakErrors.map(e => '  - ' + e).join('\n') + '\n');
  process.exit(1);
}

fs.writeFileSync(path.join(ROOT, '原型汇总.html'), pubHtml, 'utf8');
fs.writeFileSync(path.join(ROOT, '原型汇总-内部版.html'), fullHtml, 'utf8');

// 3. 输出统计，便于核对
const out = s => process.stdout.write(s + '\n');
for (const [id, name] of MODULES) {
  const pages = Object.values(merged[id]);
  if (!pages.length) { out(id + ' ' + name + '：无页面'); continue; }
  const cnt = {};
  pages.forEach(p => p.history.forEach(h => h.items.forEach(it => { const k = it.cat || 'ui'; cnt[k] = (cnt[k] || 0) + 1; })));
  out(id + ' ' + name + '：' + pages.length + ' 页 | ' + JSON.stringify(cnt));
  pages.forEach(p => out('    ' + p.name + '  [' + p.history.map(h => h.ver.split('-')[1]).join(', ') + ']'));
}
out('待归类：' + unclassified.length);
unclassified.forEach(u => out('    ' + u));