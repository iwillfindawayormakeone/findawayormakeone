/* Find a Way or Make One: search, share, reveal. No dependencies. */
(function () {
  "use strict";

  // ---- reveal on scroll (IntersectionObserver, respects reduced motion) ----
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- search + category filter (works on any page that has a .grid of cards) ----
  var grid = document.querySelector("[data-picks]");
  var input = document.querySelector("[data-search]");
  var chips = document.querySelectorAll("[data-cat]");
  var empty = document.querySelector("[data-empty]");
  var count = document.querySelector("[data-count]");
  var state = { q: "", cat: "" };

  function norm(s) { return (s || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " "); }

  function apply() {
    if (!grid) return;
    var q = norm(state.q).trim();
    var words = q ? q.split(/\s+/) : [];
    var shown = 0;
    grid.querySelectorAll(".card").forEach(function (card) {
      var hay = norm(card.getAttribute("data-hay"));
      var cat = card.getAttribute("data-category") || "";
      var okCat = !state.cat || cat === state.cat;
      var okQ = words.every(function (w) { return hay.indexOf(w) !== -1; });
      var ok = okCat && okQ;
      card.classList.toggle("hidden", !ok);
      if (ok) shown++;
    });
    if (empty) empty.classList.toggle("show", shown === 0);
    if (count) count.textContent = shown === 1 ? "1 pick" : shown + " picks";
    chips.forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-cat") === state.cat); });
    var url = new URL(location.href);
    if (state.q) url.searchParams.set("q", state.q); else url.searchParams.delete("q");
    if (state.cat) url.searchParams.set("cat", state.cat); else url.searchParams.delete("cat");
    history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
  }

  if (grid) {
    var params = new URLSearchParams(location.search);
    state.q = params.get("q") || "";
    state.cat = params.get("cat") || "";
    if (input) {
      input.value = state.q;
      input.addEventListener("input", function () { state.q = input.value; apply(); });
      var form = input.closest("form");
      if (form) form.addEventListener("submit", function (e) { e.preventDefault(); apply(); grid.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); });
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function (e) {
        e.preventDefault();
        var v = c.getAttribute("data-cat");
        state.cat = state.cat === v ? "" : v;
        apply();
      });
    });
    apply();
  } else if (input) {
    // Search box on a page without a grid: send the query to the home page.
    var f = input.closest("form");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      location.href = f.getAttribute("action") + "?q=" + encodeURIComponent(input.value);
    });
  }

  // ---- share / copy on pick pages ----
  var copyBtn = document.querySelector("[data-copy]");
  var shareBtn = document.querySelector("[data-share]");
  var pageUrl = (document.querySelector('link[rel="canonical"]') || {}).href || location.href;
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () {
        var t = copyBtn.textContent; copyBtn.textContent = "Link copied"; copyBtn.classList.add("done");
        setTimeout(function () { copyBtn.textContent = t; copyBtn.classList.remove("done"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pageUrl).then(done, function () { prompt("Copy this link:", pageUrl); });
      else prompt("Copy this link:", pageUrl);
    });
  }
  if (shareBtn) {
    if (navigator.share) {
      shareBtn.addEventListener("click", function () {
        navigator.share({ title: document.title, url: pageUrl }).catch(function () {});
      });
    } else {
      shareBtn.hidden = true;
      if (copyBtn) copyBtn.style.flex = "1 1 100%";
    }
  }

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
