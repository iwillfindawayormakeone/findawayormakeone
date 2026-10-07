# Find a Way or Make One: the picks site

The site for Find a Way or Make One, LLC: JD teaches people how to teach. The home page carries the mission; `/picks/` is the searchable list of things he has tried, with Amazon affiliate links. No database, no CMS, no monthly fee. Products live in one JSON file, a 200-line script turns them into finished pages, and any static host serves them for free.

Domain: **findawayormakeone.org** (bought through Vercel). Until it is attached, the Vercel project URL works.

## How to add a pick (the whole workflow)

Send Claude a message shaped like this:

```
New pick.
Link: https://amzn.to/XXXXXXX            <- your associate short link (SiteStripe or Influencer app)
What it is: Spectrum Math Workbook, Grade 1
Category: Kids & homework                 <- or a new one, say so
Who it's for: parents of a first grader whose school didn't send a workbook home
My experience: (anything in your own words, voice memo transcript is fine)
Research: (paste from Perplexity / Grok / wherever)
Photos: (attach 1-3 of your own photos, or say "no photos yet")
```

Claude will:
1. Add the entry to `data/products.json` (title, one-line "short", three things to know, the four sections, buy-it-if / skip-it-if, rating, tags for search).
2. Drop your photos into `public/img/<slug>-1.jpg` etc. and point the entry at them.
3. Run `node build.mjs`, check the page in a browser, commit, push. Vercel redeploys on push.
4. Hand you the link: `https://<domain>/picks/<slug>/`. That is the thing you text to your friend.

You can also do all of that yourself: edit `data/products.json`, run `node build.mjs`, push.

### Fields in `data/products.json`

| Field | What it is |
|---|---|
| `slug` | URL piece, lowercase with hyphens. Never change it after sharing the link. |
| `title`, `short` | Headline and the one-liner under it (also the search preview and the social preview text). |
| `category` | Must match one in `data/site.json` -> `categories`. |
| `tags` | Words people might search. Be generous: "1st grade", "first grade", "homework". |
| `url` | Your amzn.to link. If set, it is used as-is (it already carries your tag). |
| `asin` | Used only when `url` is empty: builds `amazon.com/dp/ASIN?tag=<associateTag>`. |
| `images` | 1 to 3 photos, `{ "src", "alt" }`. Your own photos. First one is the hero and social preview. |
| `rating` | 1 to 5. Shown as "JD's rating 4/5" and in the search-engine review markup. |
| `quickTake` | Exactly three short sentences. |
| `body` | Sections: Why I bought it / What actually happened / What to know before you buy / Who it is for. |
| `verdict.buy`, `verdict.skip` | One sentence each. The skip line is what makes people trust the buy line. |
| `sample` | `true` marks it as an example (yellow badge, hidden from search engines). Delete or set `false` for real picks. |
| `hidden` | `true` removes it from the site without deleting the entry. |

### `data/site.json`

- `associateTag`: your Amazon tracking ID (looks like `yourname-20`). Only needed for picks that use `asin` instead of a short link. **Tip:** create a dedicated tracking ID for this site in Associates Central (Account Settings -> Manage Tracking IDs) so the reports tell you which sales came from the website versus your storefront or videos.
- `storefrontUrl`: your Influencer storefront link (`amazon.com/shop/<handle>`). When set, a link appears in the nav and footer.
- `baseUrl`: the live domain. Social previews and the sitemap use it, so update it when the domain changes.
- `contactEmail`: optional. Shown only on the disclosure page.

## Amazon rules this site already follows (and the ones only you can)

Already handled in the code:
- **"As an Amazon Associate I earn from qualifying purchases"** appears on every page (footer), on the disclosure page, and a short plain-English line sits directly under every buy button. That satisfies both Amazon's Operating Agreement and the FTC "clear and conspicuous" rule.
- **No prices.** Amazon only allows prices pulled live from their API. The button says "See it on Amazon" instead.
- Buy links carry `rel="sponsored"` and open in a new tab. Nothing is cloaked or hidden.
- Amazon trademark line in the footer.

Only you can do these:
- **Use your own photos.** Amazon's product images may only be used through their official tools, and the SiteStripe image option was retired. Your own phone photos are safer, and they look more honest anyway (that is also the brand).
- Keep the site listed in Associates Central under your account's websites and apps (Account Settings -> Websites and Mobile Apps). Add the final domain there once it exists.
- Do not put the word "Amazon" in the domain name.

## Domain

`findawayormakeone.com` and `.co` are registered by someone else. The site uses `findawayormakeone.org`. Other full-name options checked on Oct 6, 2026, via Vercel's registrar:

| Domain | Year 1 | Renews |
|---|---|---|
| findawayormakeone.org | $9.99 | $10.99 |
| findawaymakeone.com | $11.25 | $11.25 |
| findawayormakeone.net | $13.50 | $13.50 |
| findawayormake.one | $7.99 | $21.07 |

## Deploy (Vercel)

Add New Project, import this repo (`findawayormakeone`), leave Root Directory at the repo root, Deploy. `vercel.json` sets the build command and output folder. Then add `findawayormakeone.org` under the project's Domains tab.

## Local preview

```
node build.mjs
cd site && python3 -m http.server 8000
```
Then open http://localhost:8000.

## Launch checklist

- [ ] Replace the three example picks (`"sample": true`) with real ones, or set `hidden: true` on them.
- [ ] Add your own photos for Spectrum Math (currently placeholder photos).
- [ ] Put your real tracking ID in `site.json` -> `associateTag` (even though amzn.to links work without it).
- [ ] Add your storefront URL.
- [ ] Drop `public/img/jd.jpg` (a 4:5 portrait) and the About section picks it up automatically.
- [ ] Attach findawayormakeone.org in Vercel, then set `baseUrl` to `https://findawayormakeone.org`.
