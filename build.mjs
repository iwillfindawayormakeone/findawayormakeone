/*  Find a Way or Make One  -  static site generator.
    No dependencies. `node build.mjs` reads data/*.json and writes the finished site to ./site
    Hosting: point any static host at ./site (Vercel config is in vercel.json).
*/
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const site = read("data/site.json");
const picks = read("data/products.json")
  .filter((p) => !p.hidden)
  .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1)); // newest first, stable on ties

const out = path.join(root, "site");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, "public"), out, { recursive: true });
const css = fs.readFileSync(path.join(root, "public/styles.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
const hasPortrait = fs.existsSync(path.join(root, "public/img/jd.jpg"));

const write = (rel, html) => {
  const file = path.join(out, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = (u) => (/^https?:\/\//.test(u) ? u : site.baseUrl.replace(/\/$/, "") + "/" + u.replace(/^\/+/, ""));
const buyUrl = (p) => (p.url ? p.url : `https://www.amazon.com/dp/${p.asin}/?tag=${site.associateTag}`);
const month = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric" });
const pickPath = (p) => `/picks/${p.slug}/`;
const hay = (p) => [p.title, p.product, p.short, p.category, ...(p.tags || [])].join(" ");
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const catPath = (c) => `/category/${slugify(c)}/`;
// Search snippet: the one-liner plus what the page delivers, kept near 155 characters.
const pickDesc = (p) => {
  const tail = " Why I bought it, what to know before you buy, and who should skip it.";
  return p.short.length + tail.length <= 160 ? p.short + tail : p.short;
};

const DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
const AFF_LINE = "Affiliate link. If you buy through it, I earn a small commission and you pay the same price.";

const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1f5a3e"/><text x="32" y="44" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="34" fill="#f4f5f0">F</text></svg>`)}`;

/* ---------- layout ---------- */
function layout({ title, desc, canonical, body, ogImage, jsonld = [], current = "", bodyClass = "", noindex = false, fullTitle, ogType = "website", published }) {
  fullTitle = fullTitle || (title ? `${title} | ${site.name}` : site.name);
  const storefront = site.storefrontUrl ? `<a href="${esc(site.storefrontUrl)}" target="_blank" rel="noopener" class="hide-sm">Amazon storefront</a>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="${noindex ? "noindex" : "index, follow, max-image-preview:large"}">
${site.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}">` : ""}
<meta property="og:type" content="${ogType}">
${published ? `<meta property="article:published_time" content="${published}">` : ""}
<meta name="author" content="${esc(site.owner)}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title || site.name)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
${ogImage ? `<meta property="og:image" content="${esc(abs(ogImage))}">\n<meta name="twitter:card" content="summary_large_image">` : ""}
<meta name="theme-color" content="#f4f5f0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1512" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet"></noscript>
<style>${css}</style>
<script src="/app.js" defer></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body class="${bodyClass}">
<nav class="nav" aria-label="Main">
  <div class="wrap">
    <a class="wordmark" href="/"><span class="mark" aria-hidden="true">F</span>${esc(site.name)}</a>
    <div class="nav-links">
      <a href="/picks/" ${current === "picks" ? 'aria-current="page"' : ""}>Things I've tried</a>
      <a href="/#work" class="hide-sm">Teaching</a>
      ${storefront}
      <a href="/disclosure/" ${current === "disclosure" ? 'aria-current="page"' : ""}>Disclosure</a>
    </div>
  </div>
</nav>
${body}
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <p><b>${esc(site.name)}</b></p>
        <p class="legal">${DISCLOSURE} Every product link on this site is an affiliate link. I only list things I bought with my own money and would buy again. Prices and availability change on Amazon; this site never shows a price for that reason.</p>
      </div>
      <div>
        <div class="links">
          <a href="/picks/">Things I've tried</a>
          <a href="/#work">Teaching and coaching</a>
          <a href="/#how">How I work</a>
          <a href="/disclosure/">Affiliate disclosure</a>
          ${site.storefrontUrl ? `<a href="${esc(site.storefrontUrl)}" target="_blank" rel="noopener">Amazon storefront</a>` : ""}
        </div>
      </div>
    </div>
    <p class="fine">&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(site.legalName)}. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. Not affiliated with any school district.</p>
  </div>
</footer>
</body>
</html>`;
}

/* ---------- components ---------- */
function card(p, i, { reveal = true, h = "h3" } = {}) {
  const size = i === 0 ? "lg" : i === 1 ? "md" : "";
  const img = p.images[0];
  return `<a class="card ${size} ${reveal ? "reveal" : ""}" href="${pickPath(p)}" data-category="${esc(p.category)}" data-hay="${esc(hay(p))}">
  <div class="frame"><img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="${i < 2 ? "eager" : "lazy"}" width="1200" height="900"></div>
  <div class="meta"><span class="pill">${esc(p.category)}</span>${p.sample ? '<span class="pill sample">Example pick</span>' : ""}</div>
  <${h}>${esc(p.title)}</${h}>
  ${p.product ? `<p class="product">${esc(p.product)}</p>` : ""}
  <p>${esc(p.short)}</p>
  <span class="more">Read why &rarr;</span>
</a>`;
}

function searchForm(action = "/") {
  return `<form class="search" role="search" action="${action}">
  <label class="sr-only" for="q">Search picks</label>
  <input id="q" type="search" name="q" placeholder="Search: math workbook, pedal, mic..." autocomplete="off" data-search>
  <button class="btn" type="submit">Search <span class="ico" aria-hidden="true">&rarr;</span></button>
</form>`;
}

/* ---------- home: the LLC's mission ---------- */
function home() {
  const latest = picks.slice(0, 3);
  const stack = latest.map((p) => `<a href="${pickPath(p)}" aria-label="${esc(p.title)}"><img src="${esc(p.images[0].src)}" alt="" width="800" height="600" loading="eager"></a>`).join("");
  const body = `
<header class="hero">
  <div class="wrap hero-grid">
    <div>
      <h1 class="rise" style="max-width:12ch">Find a way <em>or make one.</em></h1>
      <p class="lede rise d1">I teach people how to teach. Everything I try, I try so I can teach it better, and I study how I learn it on the way.</p>
      <div class="ctas rise d2">
        <a class="btn" href="/picks/">Things I've tried <span class="ico" aria-hidden="true">&rarr;</span></a>
        <a class="btn ghost" href="#work">Teaching and coaching <span class="ico" aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
    <div class="stack rise d2" aria-label="Latest things I've tried">${stack}</div>
  </div>
</header>

<section id="how" class="band">
  <div class="wrap">
    <div class="about-grid">
      <div class="portrait reveal">
        ${hasPortrait ? '<img src="/img/jd.jpg" alt="JD, the person behind Find a Way or Make One" width="600" height="750" loading="lazy">' : '<div class="ph">Drop <b>&nbsp;img/jd.jpg&nbsp;</b> in the folder and this becomes your photo.</div>'}
      </div>
      <div class="reveal about">
        <h2>The rule I run everything by</h2>
        <p>Before I teach something, I go do it. Learn the instrument. Build the website. Read the whole book, not the summary. Buy the thing and use it for a month. While I do it, I watch how I learn it: where I got stuck, what finally made it click, what I would skip next time. That is the real material. Then I teach it while the scrapes are still fresh.</p>
        <p>${esc(site.legalName)} is one person: me, JD. I teach music in a public school. I have written curriculum for schools, and I have been paid to coach, run clinics, and lead workshops. The subject changes. The craft of teaching it is the point.</p>
        <p>The name is the whole philosophy. If the path is there, find it. If it is not, make one.</p>
      </div>
    </div>
  </div>
</section>

<section id="work">
  <div class="wrap">
    <div class="section-head reveal"><h2>What I do</h2></div>
    <div class="steps reveal">
      <div><h3>Teaching teachers</h3><p>Curriculum for schools, clinics, workshops, and professional development. Pedagogy is the center of everything here: not just what to teach, but how a person actually learns it, and how to tell when they have. ${site.contactEmail ? `Reach me at <a href="mailto:${esc(site.contactEmail)}" style="text-decoration:underline">${esc(site.contactEmail)}</a>.` : "Booking details are coming soon."}</p></div>
      <div><h3>Coaching</h3><p>One on one, for people who know what they want and keep not doing it. We find the way that fits your actual life, or we make one. Same method as the classroom: short lessons, real reps, honest feedback.</p></div>
      <div><h3>Things I've tried</h3><p>Products I bought and used while learning something I meant to teach, with honest notes on who should buy them and who should skip them. Some links pay me a small commission. Every one says so. <a href="/picks/" style="text-decoration:underline">See the list</a>.</p></div>
    </div>
  </div>
</section>

<section id="latest" class="band">
  <div class="wrap">
    <div class="section-head reveal">
      <h2>Latest things I've tried</h2>
      <p>Newest first. Each one says why I bought it, what happened, and who should skip it.</p>
    </div>
    <div class="grid">${latest.map((p, i) => card(p, i + 2)).join("\n")}</div>
    <p class="reveal" style="margin-top:28px"><a class="btn ghost" href="/picks/">All things I've tried <span class="ico" aria-hidden="true">&rarr;</span></a></p>
  </div>
</section>`;
  return layout({ title: "", fullTitle: site.seoTitle || site.name, desc: site.description, canonical: abs("/"), body, ogImage: picks[0]?.images[0]?.src, current: "home",
    jsonld: [
      { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: abs("/"), potentialAction: { "@type": "SearchAction", target: `${abs("/picks/")}?q={search_term_string}`, "query-input": "required name=search_term_string" } },
      { "@context": "https://schema.org", "@type": "Person", name: site.owner, url: abs("/"), jobTitle: "Music teacher, curriculum writer, and coach", knowsAbout: ["Pedagogy", "Music education", "Curriculum design", "Learning how to learn"], worksFor: { "@type": "Organization", name: site.legalName, url: abs("/") } }
    ] });
}

/* ---------- picks: searchable list of everything tried ---------- */
function picksPage() {
  const chips = site.categories.map((c) => `<a href="${catPath(c)}" data-cat="${esc(c)}">${esc(c)}</a>`).join("");
  const body = `
<header class="hero">
  <div class="wrap">
    <div class="crumb"><a href="/">&larr; Home</a></div>
    <h1 class="rise">Things I've tried, and would tell a <em>friend</em> about.</h1>
    <p class="lede rise d1">Every product here has been on my desk, in my classroom, or in my house first. Search it, or browse by category.</p>
    <div class="rise d2">${searchForm("/picks/")}</div>
    <div class="chips rise d3">${chips}</div>
  </div>
</header>

<section id="picks" style="padding-top:0">
  <div class="wrap">
    <div class="section-head reveal">
      <p><span data-count>${picks.length} picks</span>, newest first. Click any one for the honest version: why I bought it, what happened, and who should skip it.</p>
    </div>
    <div class="grid" data-picks>
      ${picks.map((p, i) => card(p, i, { h: "h2" })).join("\n")}
    </div>
    <div class="empty" data-empty><b>Nothing matches that yet.</b>Try a shorter word, or clear the category. New picks get added as I find them.</div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="section-head reveal"><h2>How a thing ends up on this list</h2></div>
    <div class="steps reveal">
      <div><h3>I buy it first.</h3><p>With my own money, for my own classroom, kids, or desk. Nobody sends me free stuff, and I would say so if they did.</p></div>
      <div><h3>I write what actually happened.</h3><p>Not the box copy. What broke, what surprised me, what I would tell you if you asked me in the hallway.</p></div>
      <div><h3>You click, you decide.</h3><p>Every link goes to Amazon. If you buy, I earn a small commission and you pay exactly the same price. That is how this site pays for itself.</p></div>
    </div>
    <p class="disclosure-note reveal"><b>Plain-English disclosure:</b> ${DISCLOSURE} The full version is on the <a href="/disclosure/" style="text-decoration:underline">disclosure page</a>.</p>
  </div>
</section>`;
  return layout({ title: "Things I've tried", desc: "Honest Amazon picks from a music teacher and life coach: what I bought, what happened, and who should skip it. Searchable, newest first.", canonical: abs("/picks/"), body, ogImage: picks[0]?.images[0]?.src, current: "picks",
    jsonld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Things I've tried", url: abs("/picks/"), isPartOf: { "@type": "WebSite", name: site.name, url: abs("/") } }] });
}

/* ---------- pick page ---------- */
function pickPage(p) {
  const url = abs(pickPath(p));
  const n = Math.min(p.images.length, 3);
  const gallery = `<div class="gallery n${n}">${p.images.slice(0, 3).map((im, i) => `<figure><img src="${esc(im.src)}" alt="${esc(im.alt)}" width="1200" height="900" loading="${i === 0 ? "eager" : "lazy"}"></figure>`).join("")}</div>`;
  const related = picks.filter((o) => o.slug !== p.slug && o.category === p.category).concat(picks.filter((o) => o.slug !== p.slug && o.category !== p.category)).slice(0, 3);
  const body = `
<header class="pick-head">
  <div class="wrap">
    <div class="crumb"><a href="/picks/">&larr; Things I've tried</a></div>
    <div class="meta"><a class="pill" href="${catPath(p.category)}">${esc(p.category)}</a><span class="pill muted">Added ${month(p.date)}</span>${p.sample ? '<span class="pill sample">Example pick: placeholder photos and notes</span>' : ""}</div>
    <h1>${esc(p.title)}</h1>
    ${p.product ? `<p class="product-line">The product: <b>${esc(p.product)}</b></p>` : ""}
    <p class="short">${esc(p.short)}</p>
  </div>
</header>
<div class="wrap">
  ${gallery}
  <div class="pick-body">
    <article>
      ${p.sample ? `<p class="sample-note">This is an example pick so you can see the layout. Swap in real photos and JD's own notes before sharing it.</p>` : ""}
      <div class="quick">
        <h2>Three things to know</h2>
        <ol>${p.quickTake.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      </div>
      ${p.body.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((t) => `<p>${esc(t)}</p>`).join("")}`).join("\n")}
    </article>
    <aside class="verdict">
      <div class="in">
        <div class="score"><span>JD's rating</span><b>${p.rating}/5</b></div>
        <h3>Buy it if</h3><p>${esc(p.verdict.buy)}</p>
        <h3>Skip it if</h3><p>${esc(p.verdict.skip)}</p>
        <a class="btn block" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">See it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a>
        <p class="aff">${AFF_LINE}</p>
        <div class="share">
          <button type="button" data-copy>Copy link</button>
          <button type="button" data-share>Share</button>
        </div>
      </div>
    </aside>
  </div>
</div>
<section class="related">
  <div class="wrap">
    <div class="section-head"><h2>More picks</h2></div>
    <div class="grid">${related.map((o, i) => card(o, i + 2, { reveal: false })).join("")}</div>
  </div>
</section>
<div class="buybar"><a class="btn" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">See it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a></div>`;
  const jsonld = [
    { "@context": "https://schema.org", "@type": "Product", name: p.product || p.title, image: p.images.map((i) => abs(i.src)), description: p.short, category: p.category,
      review: { "@type": "Review", author: { "@type": "Person", name: site.owner }, datePublished: p.date, reviewBody: p.quickTake.join(" "), reviewRating: { "@type": "Rating", ratingValue: p.rating, bestRating: 5 } } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Things I've tried", item: abs("/picks/") },
      { "@type": "ListItem", position: 2, name: p.category, item: abs(catPath(p.category)) },
      { "@type": "ListItem", position: 3, name: p.title, item: url } ] }
  ];
  const combo = p.product && p.product !== p.title ? `${p.title}: ${p.product}` : p.title;
  const fullTitle = p.seoTitle || (combo.length <= 38 ? `${combo} | ${site.name}` : combo);
  return layout({ title: p.title, fullTitle, desc: p.seoDescription || pickDesc(p), canonical: url, body, ogImage: p.images[0].src, jsonld, bodyClass: "has-buybar", noindex: !!p.sample, ogType: "article", published: p.date });
}

/* ---------- disclosure ---------- */
function disclosure() {
  const body = `
<main class="page">
  <div class="wrap prose">
    <h1>Affiliate disclosure, in plain English</h1>
    <p><b>${DISCLOSURE}</b></p>
    <p>${site.name} is run by ${esc(site.legalName)}. The product links on this site are Amazon affiliate links. When you click one and buy something, Amazon pays me a small percentage. You pay exactly the same price you would have paid anyway. That commission is how this site covers its own costs.</p>
    <h2>What that does not change</h2>
    <ul>
      <li>I buy everything listed here myself. Nothing on this site was sent to me for free, and if that ever changes the pick will say so at the top.</li>
      <li>Nobody pays to be listed. A company cannot buy a spot, and I do not take requests from brands.</li>
      <li>I write the "skip it if" part as carefully as the "buy it if" part. A pick that is wrong for you is not worth the commission.</li>
    </ul>
    <h2>Why there are no prices</h2>
    <p>Amazon prices change constantly, and Amazon's rules do not let me show a price unless it is pulled live from them. So the button says "See it on Amazon" and the price you see there is the real one.</p>
    <h2>Questions</h2>
    <p>${site.contactEmail ? `Email me at <a href="mailto:${esc(site.contactEmail)}" style="text-decoration:underline">${esc(site.contactEmail)}</a>.` : "Reach me through any of my other sites and I will answer."} This disclosure is here because the FTC requires it and because you deserve to know how a recommendation site makes money.</p>
  </div>
</main>`;
  return layout({ title: "Affiliate disclosure", desc: "How Find a Way or Make One makes money, and what that does and does not change about the picks.", canonical: abs("/disclosure/"), body, current: "disclosure" });
}

/* ---------- category pages ---------- */
function categoryPage(c) {
  const list = picks.filter((p) => p.category === c);
  const url = abs(catPath(c));
  const body = `
<header class="pick-head">
  <div class="wrap">
    <div class="crumb"><a href="/picks/">&larr; Things I've tried</a></div>
    <h1>${esc(c)}</h1>
    <p class="short">${list.length === 1 ? "One pick" : list.length + " picks"} in this category. Everything here was bought and used first; each page says who should skip it.</p>
  </div>
</header>
<section id="picks" style="padding-top:0">
  <div class="wrap">
    <div class="grid" data-picks>${list.map((p, i) => card(p, i, { reveal: false, h: "h2" })).join("")}</div>
    <div class="empty" data-empty><b>Nothing here yet.</b>New picks get added as I find them.</div>
  </div>
</section>`;
  const real = list.some((p) => !p.sample);
  return layout({ noindex: !real, title: `${c} picks`, desc: `${c}: honest Amazon picks from a music teacher, with who should buy each one and who should skip it.`, canonical: url, body, ogImage: list[0]?.images[0]?.src, current: "picks",
    jsonld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${c} picks`, url, isPartOf: { "@type": "WebSite", name: site.name, url: abs("/") } }] });
}

function notFound() {
  const body = `<main class="page"><div class="wrap prose"><h1>That page is not here.</h1><p>The pick may have moved or never existed. <a href="/#picks" style="text-decoration:underline">See all picks</a>.</p></div></main>`;
  return layout({ title: "Page not found", desc: "Page not found.", canonical: abs("/404"), body, noindex: true });
}

/* ---------- write everything ---------- */
write("index.html", home());
write("disclosure/index.html", disclosure());
write("picks/index.html", picksPage());
write("404.html", notFound());
for (const p of picks) write(`picks/${p.slug}/index.html`, pickPage(p));
for (const c of site.categories) write(`category/${slugify(c)}/index.html`, categoryPage(c));
write("search.json", JSON.stringify(picks.map((p) => ({ slug: p.slug, title: p.title, short: p.short, category: p.category, tags: p.tags, url: pickPath(p), image: p.images[0].src }))));
const urls = [abs("/"), abs("/picks/"), abs("/disclosure/"), ...site.categories.filter((c) => picks.some((p) => p.category === c && !p.sample)).map((c) => abs(catPath(c))), ...picks.filter((p) => !p.sample).map((p) => abs(pickPath(p)))];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${abs("/sitemap.xml")}\n`);

const missing = picks.filter((p) => !p.url && (!p.asin || /SAMPLE/.test(p.asin)));
console.log(`Built ${picks.length} picks -> site/`);
if (site.associateTag.startsWith("REPLACE")) console.log("NOTE: data/site.json associateTag is still a placeholder. Picks with a full amzn.to link in `url` work regardless.");
if (missing.length) console.log("NOTE: picks without a real link yet: " + missing.map((p) => p.slug).join(", "));
