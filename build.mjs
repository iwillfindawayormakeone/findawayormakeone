/*  Find a Way or Make One  -  static site generator.
    No dependencies. `node build.mjs` reads data/*.json and writes the finished site to ./site
    Hosting: point any static host at ./site (Vercel config is in vercel.json).
*/
import fs from "node:fs";
import path from "node:path";
import cruise from "./data/cruise.mjs";

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
const srcset = (im) => im.srcset ? ` srcset="${im.srcset.map(([u, w]) => `${esc(u)} ${w}w`).join(", ")}" sizes="${esc(im.sizes || "(max-width: 720px) 90vw, 360px")}"` : "";
const ogOf = (im) => (im ? im.og || im.src : "/img/og-default.png");
const img0 = (p) => (p.images && p.images.length ? p.images[0] : null);
const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
// No photo yet: a quiet tile with the product's initial. Amazon's images may not be used, so pages launch without photos until JD adds his own.
const placeholder = (p, cls = "") => `<div class="ph ${cls}" style="--h:${hue(p.slug)}" aria-hidden="true"><span>${esc(p.title.replace(/^(a|an|the|why|my|this|the)\s+/i, "").trim()[0].toUpperCase())}</span></div>`;
const videoUrl = (p) => p.videoUrl || (p.video ? `https://www.amazon.com/shop/findawaytosing/video/amzn1.vse.video.${p.video}?tag=${site.associateTag}` : "");
const hay = (p) => [p.title, p.product, p.short, p.category, ...(p.tags || [])].join(" ");
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const catPath = (c) => `/category/${slugify(c)}/`;
// Search snippet: the one-liner plus what the page delivers, kept near 155 characters.
const pickDesc = (p) => {
  const tail = " Why this one, what to check before you buy, and what else I looked at.";
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
<meta property="og:image" content="${esc(abs(ogImage || "/img/og-default.png"))}">
${ogImage ? "" : '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">'}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title || site.name)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/favicon.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"></noscript>
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
      <a href="${cruise.path}" ${current === "cruise" ? 'aria-current="page"' : ""}>First cruise</a>
      <a href="/#work" class="hide-sm">Teaching</a>
      ${storefront}
      <a href="/disclosure/" class="hide-sm" ${current === "disclosure" ? 'aria-current="page"' : ""}>Disclosure</a>
    </div>
  </div>
</nav>
${body}
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <p><b>${esc(site.name)}</b></p>
        <p class="legal">${DISCLOSURE} Every product link on this site is an affiliate link. I only list things I've actually used and would tell a friend about. If a brand sent it free, the page says so. Prices and availability change on Amazon; this site never shows a price for that reason.</p>
      </div>
      <div>
        <div class="links">
          <a href="/picks/">Things I've tried</a>
          <a href="${cruise.path}">First-cruise guide</a>
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
  const img = img0(p);
  return `<a class="card ${size} ${reveal ? "reveal" : ""}" href="${pickPath(p)}" data-category="${esc(p.category)}" data-hay="${esc(hay(p))}">
  <div class="frame">${img ? `<img src="${esc(img.src)}"${srcset(img)} alt="${esc(img.alt)}" loading="${i < 2 ? "eager" : "lazy"}" width="1200" height="900"${img.fit === "contain" ? ' class="contain"' : ""}>` : placeholder(p)}</div>
  <div class="meta"><span class="pill">${esc(p.category)}</span>${p.video ? '<span class="pill muted">Video</span>' : ""}${p.sample ? '<span class="pill sample">Example pick</span>' : ""}</div>
  <${h}>${esc(p.title)}</${h}>
  ${p.product ? `<p class="product">${esc(p.product)}</p>` : ""}
  <p>${esc(p.short)}</p>
  <span class="more">See it &rarr;</span>
</a>`;
}

function searchForm(action = "/") {
  return `<form class="search" role="search" action="${action}">
  <label class="sr-only" for="q">Search picks</label>
  <input id="q" type="search" name="q" placeholder="Search: math workbook, pedal, mic..." autocomplete="off" data-search>
  <button class="btn" type="submit">Search <span class="ico" aria-hidden="true">&rarr;</span></button>
</form>`;
}

/* ---------- home: a letter, then the one latest thing ---------- */
function home() {
  const latest = picks[0];
  const feature = latest ? `
<section class="feature band">
  <div class="col">
    <a class="print" href="${pickPath(latest)}" aria-label="${esc(latest.title)}">${img0(latest) ? `<img src="${esc(img0(latest).src)}"${srcset(img0(latest))} alt="${esc(img0(latest).alt)}" width="600" height="600" loading="eager"${img0(latest).fit === "contain" ? ' class="contain"' : ""}>` : placeholder(latest, "sq")}</a>
    <div>
      <p class="label">The latest thing I tried</p>
      <h2><a href="${pickPath(latest)}">${esc(latest.title)}</a></h2>
      ${latest.product ? `<p class="product">${esc(latest.product)}</p>` : ""}
      <p class="why">${esc(latest.short)} <a class="u" href="${pickPath(latest)}">Why this one</a></p>
      <a class="btn" href="${esc(buyUrl(latest))}" target="_blank" rel="noopener sponsored">Get it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a>
      <p class="aff">${AFF_LINE}</p>
    </div>
  </div>
</section>` : "";
  const body = `
<header class="hero">
  <div class="col">
    <h1 class="rise">Find a way <em>or make one.</em></h1>
    <p class="lede rise d1">I teach people how to teach. Everything I try, I try so I can teach it better, and I study how I learn it on the way.</p>
    <div class="letter rise d2">
      <p>Before I teach something, I go do it. Learn the instrument. Build the website. Read the whole book, not the summary. Buy the thing and use it for a month. While I do it, I watch how I learn it: where I got stuck, what finally made it click, what I would skip next time. Then I teach it while the scrapes are still fresh.</p>
      <p>${esc(site.legalName)} is one person. I teach music in a public school. I have written curriculum for schools, and I have been paid to coach, run clinics, and lead workshops. The subject changes. The craft of teaching it is the point.</p>
    </div>
    <div class="ctas rise d3">
      <a class="btn" href="/picks/">Things I've tried <span class="ico" aria-hidden="true">&rarr;</span></a>
      <a class="btn ghost" href="#work">Teaching and coaching <span class="ico" aria-hidden="true">&rarr;</span></a>
    </div>
    ${hasPortrait ? `<div class="print" style="max-width:220px;margin-top:36px"><img src="/img/jd.jpg" alt="JD" width="600" height="750" loading="lazy"></div>` : ""}
    <p class="sig rise d3">JD<small>${esc(site.legalName)}</small></p>
  </div>
</header>
${feature}
<section class="cruise-promo">
  <div class="wrap">
    <div class="promo reveal">
      <div>
        <p class="label">New</p>
        <h2><a href="${cruise.path}">${esc(cruise.title)}</a></h2>
        <p>We took our first cruise this August: Baltimore to Bermuda, two adults, two little kids. What I packed, what actually happens the first hour on the ship, and what I'd buy again.</p>
        <a class="btn" href="${cruise.path}">Read the cruise guide <span class="ico" aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </div>
</section>
<section id="browse">
  <div class="wrap">
    <div class="section-head reveal"><h2>Browse by category</h2><p>${picks.length} things, each with the link and why I picked it.</p></div>
    <div class="cats reveal">
      ${site.categories.filter((c) => picks.some((p) => p.category === c)).map((c) => `<a href="${catPath(c)}"><b>${esc(c)}</b><span>${picks.filter((p) => p.category === c).length} picks</span></a>`).join("")}
    </div>
  </div>
</section>
<section id="work">
  <div class="wrap">
    <div class="section-head reveal"><h2>What I do</h2></div>
    <div class="steps reveal">
      <div><h3>Teaching teachers</h3><p>Curriculum for schools, clinics, workshops, and professional development. Pedagogy is the center of everything here: how a person actually learns a thing, and how to tell when they have. ${site.contactEmail ? `Reach me at <a class="u" href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a>.` : "Booking details are coming soon."}</p></div>
      <div><h3>Coaching</h3><p>One on one, for people who know what they want and keep not doing it. We find the way that fits your actual life, or we make one. Same method as the classroom: short lessons, real reps, honest feedback.</p></div>
      <div id="how"><h3>Things I've tried</h3><p>Things I bought and used, with the link and why I picked each one. Some links pay me a small commission. Every one says so. <a class="u" href="/picks/">See the list</a>.</p></div>
    </div>
  </div>
</section>`;
  return layout({ title: "", fullTitle: site.seoTitle || site.name, desc: site.description, canonical: abs("/"), body, ogImage: "", current: "home",
    jsonld: [
      { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: abs("/"), potentialAction: { "@type": "SearchAction", target: `${abs("/picks/")}?q={search_term_string}`, "query-input": "required name=search_term_string" } },
      { "@context": "https://schema.org", "@type": "Person", name: site.owner, url: abs("/"), jobTitle: "Music teacher, curriculum writer, and coach", knowsAbout: ["Pedagogy", "Music education", "Curriculum design", "Learning how to learn"], worksFor: { "@type": "Organization", name: site.legalName, url: abs("/") } }
    ] });
}

/* ---------- picks: searchable list of everything tried ---------- */
function picksPage() {
  const chips = site.categories.filter((c) => picks.some((p) => p.category === c)).map((c) => `<a href="${catPath(c)}" data-cat="${esc(c)}">${esc(c)}</a>`).join("");
  const body = `
<header class="hero list">
  <div class="wrap">
    <div class="crumb"><a href="/">&larr; Home</a></div>
    <h1 class="rise">Things I've tried, and would tell a <em>friend</em> about.</h1>
    <p class="lede rise d1">Every product here has been on my desk or in my house first. Search it, or browse by category.</p>
    <div class="rise d2">${searchForm("/picks/")}</div>
    <div class="chips rise d3">${chips}</div>
  </div>
</header>

<section id="picks" style="padding-top:0">
  <div class="wrap">
    <div class="section-head reveal">
      <p><span data-count>${picks.length} picks</span>, newest first. Each one has the link and why I picked it.</p>
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
      <div><h3>I use it first.</h3><p>On my own desk, with my own kids, in my own house. Most of it I bought. If a brand sent it to me free, the page says so at the top.</p></div>
      <div><h3>I write what actually happened.</h3><p>Not the box copy. What broke, what surprised me, what I would tell you if you asked me in the hallway.</p></div>
      <div><h3>You click, you decide.</h3><p>Every link goes to Amazon. If you buy, I earn a small commission and you pay exactly the same price. That is how this site pays for itself.</p></div>
    </div>
    <p class="disclosure-note reveal"><b>Plain-English disclosure:</b> ${DISCLOSURE} The full version is on the <a class="u" href="/disclosure/">disclosure page</a>.</p>
  </div>
</section>`;
  return layout({ title: "Things I've tried", desc: "Things I bought and used, each with the Amazon link and why I picked it. From a music teacher who teaches people how to teach. Newest first.", canonical: abs("/picks/"), body, ogImage: picks[0] ? ogOf(img0(picks[0])) : "", current: "picks",
    jsonld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Things I've tried", url: abs("/picks/"), isPartOf: { "@type": "WebSite", name: site.name, url: abs("/") } }] });
}

/* ---------- pick page: the link first, the story second ---------- */
function pickPage(p) {
  const url = abs(pickPath(p));
  const img = img0(p);
  const more = (p.images || []).slice(1);
  const sameVideo = p.video ? picks.filter((o) => o.slug !== p.slug && o.video === p.video) : [];
  const related = [...sameVideo, ...picks.filter((o) => o.slug !== p.slug && o.category === p.category && !sameVideo.includes(o)), ...picks.filter((o) => o.slug !== p.slug && o.category !== p.category)].filter((o, i, a) => a.indexOf(o) === i).slice(0, 3);
  const vurl = videoUrl(p);
  const watch = vurl ? `<a class="btn ghost" href="${esc(vurl)}" target="_blank" rel="noopener sponsored">Watch my video on Amazon <span class="ico" aria-hidden="true">&#9654;</span></a>` : "";
  const buy = `<a class="btn big" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">Get it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a>
      <p class="aff">${AFF_LINE}</p>`;
  const body = `
<header class="pick-head">
  <div class="col">
    <div class="pick-text">
      <div class="crumb"><a href="${p.category === "Cruise & travel" ? cruise.path : "/picks/"}">&larr; ${p.category === "Cruise & travel" ? "First-cruise guide" : "Things I've tried"}</a></div>
      ${p.gifted ? `<p class="sample-note">The brand sent me this one free to review. I wrote it the same way I write about things I buy, and the link still pays me a commission.</p>` : ""}
      <div class="meta"><a class="pill" href="${catPath(p.category)}">${esc(p.category)}</a>${p.gifted ? '<span class="pill sample">Sent to me free</span>' : ""}${p.ideaList ? `<span class="pill muted">From my "${esc(p.ideaList)}" list</span>` : ""}</div>
      <h1>${esc(p.title)}</h1>
      ${p.product ? `<p class="product-line">${esc(p.product)}</p>` : ""}
      ${(p.intro || [p.short]).map((t) => `<p class="intro">${esc(t)}</p>`).join("")}
      ${buy}
      ${watch ? `<div class="watch">${watch}</div>` : ""}
      <div class="share">
        <button type="button" data-copy>Copy link</button>
        <button type="button" data-share>Share</button>
      </div>
    </div>
    ${img ? `<div class="pick-photo"><img src="${esc(img.src)}"${srcset(img)} alt="${esc(img.alt)}" width="900" height="900" loading="eager"${img.fit === "contain" ? ' class="contain"' : ""}></div>` : ""}
  </div>
</header>
${more.length ? `<div class="wrap"><div class="gallery n${Math.min(more.length, 3)}">${more.slice(0, 3).map((im) => `<figure><img src="${esc(im.src)}" alt="${esc(im.alt)}" width="1200" height="900" loading="lazy"${im.fit === "contain" ? ' class="contain"' : ""}></figure>`).join("")}</div></div>` : ""}
${(p.body && p.body.length) || vurl ? `<section class="pick-why">
  <div class="col">
    ${p.body && p.body.length ? `<p class="more-intro">If you want the details, here they are.</p>` : ""}${p.youtube ? `\n    <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(p.youtube)}" title="${esc(p.title)} video" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>` : ""}
    ${(p.body || []).map((sec) => `<h2>${esc(sec.h)}</h2>${sec.p.map((t) => `<p>${esc(t)}</p>`).join("")}`).join("\n")}
    ${vurl ? `<h2>The video</h2><p>I made a video about this one. Amazon shows it on the product page, so the link below opens it there.</p><p>${watch}</p>` : ""}
    ${sameVideo.length ? `<h2>Also in that video</h2><p>${sameVideo.map((o) => `<a class="u" href="${pickPath(o)}">${esc(o.product || o.title)}</a>`).join(", ")}.</p>` : ""}
    <div class="again">${buy}</div>
  </div>
</section>` : ""}
${related.length ? `<section class="related band"><div class="wrap"><div class="section-head"><h2>More things I've tried</h2></div><div class="grid">${related.map((o, i) => card(o, i + 2, { reveal: false })).join("")}</div></div></section>` : ""}
<div class="buybar"><a class="btn" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">Get it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a></div>`;
  const jsonld = [
    { "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.short, image: (p.images && p.images.length ? p.images : [null]).map((i) => abs(ogOf(i))), datePublished: p.date, dateModified: p.updated || p.date, mainEntityOfPage: url,
      author: { "@type": "Person", name: site.owner, url: abs("/") }, publisher: { "@type": "Organization", name: site.legalName, url: abs("/"), logo: { "@type": "ImageObject", url: abs("/favicon.png") } },
      about: { "@type": "Product", name: p.product || p.title, image: abs(ogOf(img)), category: p.category } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Things I've tried", item: abs("/picks/") },
      { "@type": "ListItem", position: 2, name: p.category, item: abs(catPath(p.category)) },
      { "@type": "ListItem", position: 3, name: p.title, item: url } ] }
  ];
  const combo = p.product && p.product !== p.title ? `${p.title}: ${p.product}` : p.title;
  const fullTitle = p.seoTitle || (combo.length <= 38 ? `${combo} | ${site.name}` : combo);
  return layout({ title: p.title, fullTitle, desc: p.seoDescription || pickDesc(p), canonical: url, body, ogImage: ogOf(img), jsonld, bodyClass: "has-buybar", noindex: !!p.sample, ogType: "article", published: p.date });
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
      <li>Most things here I bought myself. Sometimes a brand sends me something free to review. When that happens, the page says so at the top.</li>
      <li>Some brands pay a bonus on top of Amazon's commission for a while. That doesn't change what I write. Nobody can pay for a good review.</li>
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
    <p class="short">${list.length === 1 ? "One pick" : list.length + " picks"} in this category. Each one has the link and why I picked it.${c === "Cruise & travel" ? ` Start with the <a class="u" href="${cruise.path}">first-cruise guide</a>.` : ""}</p>
  </div>
</header>
<section id="picks" style="padding-top:0">
  <div class="wrap">
    <div class="grid" data-picks>${list.map((p, i) => card(p, i, { reveal: false, h: "h2" })).join("")}</div>
    <div class="empty" data-empty><b>Nothing here yet.</b>New picks get added as I find them.</div>
  </div>
</section>`;
  const real = list.filter((p) => !p.sample).length >= 2;
  return layout({ noindex: !real, title: `${c} picks`, desc: `${c}: things I bought and used, each with the Amazon link and why I picked it.`, canonical: url, body, ogImage: list[0] ? ogOf(img0(list[0])) : "", current: "picks",
    jsonld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${c} picks`, url, isPartOf: { "@type": "WebSite", name: site.name, url: abs("/") } }] });
}

/* ---------- cruise guide ---------- */
function cruisePage() {
  const url = abs(cruise.path);
  const list = picks.filter((p) => p.category === "Cruise & travel").sort((a, b) => (a.cruiseRank || 99) - (b.cruiseRank || 99));
  const top = list.filter((p) => (p.cruiseRank || 99) <= 11);
  const rest = list.filter((p) => (p.cruiseRank || 99) > 11);
  const row = (p, i) => `<li class="buy-row">
    <a class="thumb" href="${pickPath(p)}" aria-label="${esc(p.title)}">${img0(p) ? `<img src="${esc(img0(p).src)}" alt="${esc(img0(p).alt)}" loading="lazy" width="300" height="300">` : placeholder(p, "sq")}</a>
    <div class="txt">
      <h3>${i != null ? `<span class="num">${i + 1}</span>` : ""}<a href="${pickPath(p)}">${esc(p.title)}</a></h3>
      <p class="product">${esc(p.product)}</p>
      <p>${esc(p.short)}</p>
      <div class="row-ctas"><a class="btn" href="${esc(buyUrl(p))}" target="_blank" rel="noopener sponsored">Get it on Amazon <span class="ico" aria-hidden="true">&#8599;</span></a><a class="u" href="${pickPath(p)}">Why I packed it</a></div>
    </div>
  </li>`;
  const body = `
<header class="hero list cruise-hero">
  <div class="wrap">
    <div class="crumb"><a href="/">&larr; Home</a></div>
    <h1 class="rise">${esc(cruise.h1[0])}<em>${esc(cruise.h1[1])}</em></h1>
    ${cruise.intro.map((t, i) => `<p class="lede story rise d${Math.min(i + 1, 3)}">${esc(t)}</p>`).join("")}
    <p class="context rise d3"><b>The trip:</b> ${esc(cruise.context)}</p>
    <div class="mode rise d3" data-mode-switch role="group" aria-label="${esc(cruise.modes.label)}">
      <span class="mode-label">${esc(cruise.modes.label)}</span>
      <button type="button" data-mode="story" aria-pressed="true">${esc(cruise.modes.story)}</button>
      <button type="button" data-mode="facts" aria-pressed="false">${esc(cruise.modes.facts)}</button>
    </div>
    <p class="mode-note story rise d3">${esc(cruise.modes.note)}</p>
    <nav class="jump rise d3" aria-label="On this page">
      <a href="#buy">What to buy</a><a href="#carry">Carry-on</a><a href="#first-hour">First hour</a><a href="#ducks">Doors &amp; ducks</a><a href="#skip-this">Skip this</a><a href="#kids">With kids</a><a href="#balcony">Balcony?</a><a href="#days">Day by day</a>
    </nav>
  </div>
</header>

<section id="buy">
  <div class="wrap">
    <div class="section-head reveal"><h2>${esc(cruise.buyHead)}</h2><p>${esc(cruise.buyIntro)}</p></div>
    <ol class="buy-list reveal">${top.map((p, i) => row(p, i)).join("")}</ol>
    <h3 class="sub reveal">${esc(cruise.restHead)}</h3>
    <ul class="buy-list compact reveal">${rest.map((p) => row(p, null)).join("")}</ul>
    <h3 class="sub reveal">${esc(cruise.skipHead)}</h3>
    <dl class="skip reveal">${cruise.skip.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <p class="disclosure-note reveal"><b>Plain-English disclosure:</b> ${DISCLOSURE} I bought all of this myself the week before we left.</p>
  </div>
</section>

<section id="carry" class="band">
  <div class="col">
    <div class="section-head"><h2>${esc(cruise.carryOn.head)}</h2><p>${esc(cruise.carryOn.why)}</p></div>
    <ul class="checks">${cruise.carryOn.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </div>
</section>

<section id="first-hour">
  <div class="col">
    <div class="section-head"><h2>${esc(cruise.firstHead)}</h2><p>${esc(cruise.firstIntro)}</p></div>
    <ol class="walk">${cruise.steps.map((st, i) => `<li>
      <h3><span class="num">${i + 1}</span>${esc(st.h)}</h3>
      ${st.fact ? `<p class="fact">${esc(st.fact)}</p>` : ""}
      ${st.p.map((t) => `<p class="story">${esc(t)}</p>`).join("")}
      ${st.tip ? `<p class="didnt"><b>I didn't know that:</b> ${esc(st.tip)}</p>` : ""}
    </li>`).join("")}</ol>
  </div>
</section>

<section id="ducks" class="band">
  <div class="col">
    <h2>${esc(cruise.ducksHead)}</h2>
    <ul class="checks facts-list">${cruise.ducksFacts.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="prose-lg story">${cruise.ducks.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  </div>
</section>

<section id="people">
  <div class="col">
    <h2>${esc(cruise.peopleHead)}</h2>
    <ul class="checks facts-list">${cruise.peopleFacts.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="prose-lg story">${cruise.people.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  </div>
</section>

<section id="skip-this" class="band">
  <div class="col">
    <h2>${esc(cruise.badHead)}</h2>
    <ul class="checks facts-list bad">${cruise.badFacts.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="prose-lg story">${cruise.bad.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  </div>
</section>

<section id="kids">
  <div class="wrap">
    <div class="section-head"><h2>${esc(cruise.familyHead)}</h2></div>
    <div class="steps six">${cruise.family.map(([k, v]) => `<div><h3>${esc(k)}</h3><p>${esc(v)}</p></div>`).join("")}</div>
  </div>
</section>

<section id="balcony" class="band">
  <div class="col prose-lg">
    <h2>${esc(cruise.balconyHead)}</h2>
    ${cruise.balcony.map((t) => `<p class="story">${esc(t)}</p>`).join("")}
    <p class="fact">Worth it for us. Private outside space with little kids, coffee with the ocean, watching the island come up. Beds can be reconfigured by the steward; ask day one. The bigger family question is one cabin vs. two (second bathroom).</p>
  </div>
</section>

<section id="days">
  <div class="col">
    <div class="section-head"><h2>${esc(cruise.daysHead)}</h2><p>${esc(cruise.daysIntro)}</p></div>
    <div class="days">${cruise.days.map((d) => `<div><h3>${esc(d.d)}</h3>${d.p.map((t) => `<p>${esc(t)}</p>`).join("")}</div>`).join("")}</div>
  </div>
</section>

<section id="verify">
  <div class="col">
    <h2>${esc(cruise.verifyHead)}</h2>
    <p>${esc(cruise.verify)}</p>
    <p style="margin-top:18px"><a class="btn ghost" href="${catPath("Cruise & travel")}">Everything I packed, as a list <span class="ico" aria-hidden="true">&rarr;</span></a></p>
  </div>
</section>`;
  return layout({ title: "First-time Carnival cruise guide", fullTitle: cruise.seoTitle, desc: cruise.desc, canonical: url, body, current: "cruise", ogType: "article", published: "2026-11-01",
    jsonld: [
      { "@context": "https://schema.org", "@type": "Article", headline: cruise.title, description: cruise.desc, datePublished: "2026-11-01", dateModified: "2026-11-01", mainEntityOfPage: url, author: { "@type": "Person", name: site.owner, url: abs("/") }, publisher: { "@type": "Organization", name: site.legalName, url: abs("/") } },
      { "@context": "https://schema.org", "@type": "ItemList", name: "What I'd buy for a first cruise", itemListElement: top.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.product, url: abs(pickPath(p)) })) },
    ] });
}

function notFound() {
  const body = `<main class="page"><div class="wrap prose"><h1>That page is not here.</h1><p>The pick may have moved or never existed. <a href="/#picks" style="text-decoration:underline">See all picks</a>.</p></div></main>`;
  return layout({ title: "Page not found", desc: "Page not found.", canonical: abs("/404"), body, noindex: true });
}

/* ---------- write everything ---------- */
write("index.html", home());
write("disclosure/index.html", disclosure());
write("picks/index.html", picksPage());
write(cruise.path.replace(/^\/|\/$/g, "") + "/index.html", cruisePage());
write("404.html", notFound());
for (const p of picks) write(`picks/${p.slug}/index.html`, pickPage(p));
for (const c of site.categories.filter((c) => picks.some((p) => p.category === c))) write(`category/${slugify(c)}/index.html`, categoryPage(c));
write("search.json", JSON.stringify(picks.map((p) => ({ slug: p.slug, title: p.title, short: p.short, category: p.category, tags: p.tags, url: pickPath(p), image: img0(p) ? img0(p).src : "" }))));
const today = new Date().toISOString().slice(0, 10);
const newest = picks[0]?.updated || picks[0]?.date || today;
const urls = [[abs("/"), newest], [abs("/picks/"), newest], [abs(cruise.path), "2026-11-01"], [abs("/disclosure/"), site.disclosureUpdated || "2026-10-06"],
  ...site.categories.filter((c) => picks.filter((p) => p.category === c && !p.sample).length >= 2).map((c) => [abs(catPath(c)), newest]),
  ...picks.filter((p) => !p.sample).map((p) => [abs(pickPath(p)), p.updated || p.date])];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${esc(u)}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${abs("/sitemap.xml")}\n`);

const missing = picks.filter((p) => !p.url && (!p.asin || /SAMPLE/.test(p.asin)));
console.log(`Built ${picks.length} picks -> site/`);
if (site.associateTag.startsWith("REPLACE")) console.log("NOTE: data/site.json associateTag is still a placeholder. Picks with a full amzn.to link in `url` work regardless.");
if (missing.length) console.log("NOTE: picks without a real link yet: " + missing.map((p) => p.slug).join(", "));
