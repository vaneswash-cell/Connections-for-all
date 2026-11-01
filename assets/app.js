/* Connections for All — clickable MVP prototype.
 * Single-page app with hash routing. No build step, no dependencies. */
(function () {
  const S = window.CFA;
  const main = document.getElementById("main");

  /* ---------- helpers ---------- */
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const qs = (o) => Object.entries(o).filter(([, v]) => v != null && v !== "").map(([k, v]) => k + "=" + encodeURIComponent(v)).join("&");
  const fmtDate = (d) => d ? new Date(d + (d.length === 10 ? "T12:00:00" : "")).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
  const addMonths = (n) => { const d = new Date(); d.setMonth(d.getMonth() + n); return d.toISOString().slice(0, 10); };
  const daysUntil = (d) => Math.round((new Date(d + "T12:00:00") - new Date()) / 86400000);
  const FORMAT = { online: "Online", "in-person": "In person", hybrid: "Online & in person" };
  const STATUS = { approved: "Approved", pending: "Pending review", changes: "Changes requested", declined: "Declined", suspended: "Suspended" };
  const KIND = { groups: "Group", professionals: "Professional", resources: "Resource" };
  const pilotCats = () => S.get().categories.filter((c) => c.pilot);

  function formData(form) {
    const o = {};
    new FormData(form).forEach((v, k) => { if (k in o) { o[k] = [].concat(o[k], v); } else o[k] = typeof v === "string" ? v.trim() : v; });
    return o;
  }
  const arr = (v) => v == null ? [] : [].concat(v);

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 3200);
  }

  function modal(html, onSubmit) {
    const d = document.getElementById("modal");
    d.innerHTML = `<form method="dialog" class="modal-body">${html}</form>`;
    const form = d.querySelector("form");
    form.addEventListener("submit", (e) => {
      const btn = e.submitter;
      if (btn && btn.value === "cancel") return;
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (onSubmit(formData(form), form) !== false) d.close();
    });
    d.showModal();
  }
  const modalActions = (label, danger) => `<div class="actions"><button class="btn ghost" value="cancel" formnovalidate>Cancel</button><button class="btn ${danger ? "danger" : "primary"}" value="ok">${label}</button></div>`;

  function requireUser(reason) {
    if (S.user()) return true;
    toast("Please create a free account or sign in " + reason + ".");
    location.hash = "#/account?" + qs({ next: location.hash.slice(1) });
    return false;
  }

  const badge = (text, cls) => `<span class="badge ${cls || ""}">${esc(text)}</span>`;
  const statusBadge = (s) => badge(STATUS[s] || s, "st-" + s);
  const catName = (id) => (S.category(id) || {}).name || id;
  const topicName = (c, t) => (S.topic(c, t) || {}).name || "";

  function empty(title, body) { return `<div class="empty"><p class="empty-title">${title}</p><p>${body}</p></div>`; }

  /* ---------- cards ---------- */
  function groupCard(g) {
    const m = S.membership(g.id);
    return `<a class="card link-card" href="#/groups/${g.id}">
      <div class="card-top">${badge(FORMAT[g.format], "fmt")}${badge(g.privacy === "private" ? "Private · request to join" : "Open to join", g.privacy)}${m ? badge(m.status === "joined" ? "Joined" : "Requested", "mine") : ""}</div>
      <h3>${esc(g.name)}</h3>
      <p class="muted small">${esc(catName(g.category))} · ${esc(topicName(g.category, g.topic))}${g.role ? " · " + esc(g.role) + "s" : ""}</p>
      <p class="line">📍 ${esc(g.location)}</p>
      <p class="line">🗓️ ${esc(g.schedule)}</p>
    </a>`;
  }
  function proCard(p) {
    return `<a class="card link-card" href="#/professionals/${p.id}">
      <div class="card-top">${p.licenseVerified ? badge("✓ License verified", "verified") : badge("Credentials listed", "")}${p.sponsored ? badge("Sponsored", "sponsored") : ""}</div>
      <h3>${esc(p.name)}</h3>
      <p class="muted small">${esc(p.title)}</p>
      <p class="line">${p.specialties.map(esc).join(" · ")}</p>
      <p class="line">📍 ${esc(p.area)}${p.online ? " · Online" : ""}${p.inPerson ? " · In person" : ""}</p>
    </a>`;
  }
  function resourceCard(r) {
    return `<a class="card link-card" href="#/resources/${r.id}">
      <div class="card-top">${badge("Reviewed " + fmtDate(r.lastReviewed), "reviewed")}</div>
      <h3>${esc(r.name)}</h3>
      <p class="muted small">${esc(r.org)}</p>
      <p class="line">${esc(r.description)}</p>
      <p class="line">👥 ${esc(r.serves)}</p>
    </a>`;
  }

  /* ---------- views ---------- */
  const views = {};

  views.home = () => `
    <section class="hero">
      <p class="eyebrow">Central Ohio pilot · online groups open to all</p>
      <h1>One platform.<br>Multiple pathways to support.</h1>
      <p class="lead">Find people who understand, speak privately with a qualified professional, or discover organizations that can help — in one trusted place.</p>
      <div class="hero-actions"><a class="btn primary lg" href="#/discover">Find support</a><a class="btn ghost lg" href="#/about">How we review listings</a></div>
    </section>

    <section class="pathways">
      <a class="pathway" href="#/groups"><span class="pw-icon">👥</span><h2>Community support</h2><p>Free, approved peer-support groups — online and in person — built around shared experiences.</p></a>
      <a class="pathway" href="#/professionals"><span class="pw-icon">🩺</span><h2>Professional connections</h2><p>Qualified professionals, specialists and coaches for private one-on-one support.</p></a>
      <a class="pathway" href="#/resources"><span class="pw-icon">📚</span><h2>Resources & guidance</h2><p>Reviewed organizations, programs, materials and practical next steps.</p></a>
    </section>

    <section>
      <h2 class="section-title">Start with a life area</h2>
      <div class="cat-grid">
        ${S.get().categories.map((c) => c.pilot
          ? `<a class="cat" href="#/discover?c=${c.id}"><span class="cat-icon">${c.icon}</span><strong>${esc(c.name)}</strong><span class="small muted">${esc(c.blurb)}</span></a>`
          : `<div class="cat soon" aria-disabled="true"><span class="cat-icon">${c.icon}</span><strong>${esc(c.name)}</strong><span class="small muted">Coming after the pilot</span></div>`).join("")}
      </div>
    </section>

    <section class="trust">
      <h2 class="section-title">Our commitments</h2>
      <ul class="checks">
        <li><strong>Every listing is reviewed</strong> before it appears — groups, professionals and resources.</li>
        <li><strong>You don't need to share a diagnosis</strong>, employer or sensitive details to browse.</li>
        <li><strong>Your information is shared only with your explicit consent.</strong></li>
        <li><strong>Paid listings are labeled</strong> and never change the order of search results.</li>
        <li><strong>Basic peer groups are always free</strong> to find and join.</li>
      </ul>
    </section>

    <section class="involve">
      <h2 class="section-title">Help build the community</h2>
      <div class="pathways">
        <a class="pathway sm" href="#/groups/apply"><h3>Lead a group</h3><p>Apply to start or list a peer-support group.</p></a>
        <a class="pathway sm" href="#/professionals/apply"><h3>List your practice</h3><p>Apply for a verified professional profile.</p></a>
        <a class="pathway sm" href="#/resources/submit"><h3>Submit a resource</h3><p>Share an organization or program for review.</p></a>
      </div>
    </section>`;

  /* ----- Discover wizard ----- */
  let lastCounted = "";
  views.discover = (_, q) => {
    const cat = q.c && S.category(q.c);
    const crumbs = [];
    const step = (n, title, body, backQ) => `
      <div class="wizard">
        <div class="progress" aria-label="Step ${n} of 5"><div style="width:${n * 20}%"></div></div>
        <p class="eyebrow">Step ${n} of 5</p>
        <h1>${title}</h1>
        ${crumbs.length ? `<p class="crumbs">${crumbs.join(" › ")}</p>` : ""}
        ${body}
        ${backQ != null ? `<p><a class="back" href="#/discover${backQ ? "?" + backQ : ""}">← Back</a></p>` : ""}
      </div>`;
    const choice = (href, label, sub) => `<a class="choice" href="#/discover?${href}"><strong>${esc(label)}</strong>${sub ? `<span class="small muted">${esc(sub)}</span>` : ""}</a>`;

    if (!cat || !cat.pilot) {
      return step(1, "What area of life is this about?", `<div class="choices">${pilotCats().map((c) => choice(qs({ c: c.id }), c.icon + " " + c.name, c.blurb)).join("")}</div>
        <p class="small muted">More life areas will open after the pilot.</p>`, null);
    }
    if (lastCounted !== "start:" + q.c && !q.t) { lastCounted = "start:" + q.c; S.bump("searchesStarted"); }
    crumbs.push(esc(cat.name));
    const base = { c: q.c };
    if (!q.t) return step(2, "What are you experiencing?", `<div class="choices">${cat.topics.map((t) => choice(qs({ ...base, t: t.id }), t.name)).join("")}</div>`, "");
    crumbs.push(esc(topicName(q.c, q.t)));
    base.t = q.t;
    const aud = q.a && q.a !== "any" ? S.audience(q.c, q.a) : null;
    if (!q.a) return step(3, "Who should the support be for?", `<p class="muted">Optional — this helps us show groups made for people like you.</p>
      <div class="choices">${cat.audiences.map((a) => choice(qs({ ...base, a: a.id }), a.name)).join("")}${choice(qs({ ...base, a: "any" }), "Skip — show everything", "")}</div>`, qs({ c: q.c }));
    base.a = q.a;
    if (aud && aud.roles.length && !q.r) {
      crumbs.push(esc(aud.name));
      return step(3, "Narrow it down further?", `<div class="choices">${aud.roles.map((r) => choice(qs({ ...base, r }), r)).join("")}${choice(qs({ ...base, r: "any" }), "Any role in " + aud.name, "")}</div>`, qs({ c: q.c, t: q.t }));
    }
    if (aud) crumbs.push(esc(aud.name) + (q.r && q.r !== "any" ? " → " + esc(q.r) : ""));
    base.r = q.r;
    if (!q.s) {
      return step(4, "What kind of support would help?", `<form id="support-form" class="stack">
        <p class="muted">Choose one or combine them.</p>
        <label class="check-card"><input type="checkbox" name="s" value="groups" checked><span><strong>👥 Peer support group</strong><br><span class="small muted">Connect with others who understand</span></span></label>
        <label class="check-card"><input type="checkbox" name="s" value="pros" checked><span><strong>🩺 Private professional support</strong><br><span class="small muted">One-on-one with a qualified professional</span></span></label>
        <label class="check-card"><input type="checkbox" name="s" value="resources" checked><span><strong>📚 Resources & organizations</strong><br><span class="small muted">Programs, guides and practical next steps</span></span></label>
        <button class="btn primary">Continue</button></form>`, qs({ c: q.c, t: q.t }));
    }
    base.s = q.s;
    if (!q.f) {
      return step(5, "Online or in person?", `<div class="choices">${choice(qs({ ...base, f: "online" }), "💻 Online", "Join from anywhere")}${choice(qs({ ...base, f: "in-person" }), "📍 In person", "Central Ohio")}${choice(qs({ ...base, f: "either" }), "Either is fine", "")}</div>`, qs({ c: q.c, t: q.t, a: q.a, r: q.r }));
    }
    return discoverResults(q);
  };

  function discoverResults(q) {
    const key = qs(q);
    if (lastCounted !== key) { lastCounted = key; S.bump("searchesCompleted"); }
    const mq = { c: q.c, t: q.t, a: q.a === "any" ? "" : q.a, r: q.r === "any" ? "" : q.r, f: q.f };
    const want = q.s.split(",");
    const aud = mq.a && S.audience(q.c, mq.a);
    const chips = [catName(q.c), topicName(q.c, q.t), aud && aud.name, mq.r, q.f === "either" ? "Online or in person" : FORMAT[q.f]].filter(Boolean);
    const section = (title, items, render, emptyMsg) => `<section class="results-section"><h2>${title} <span class="count">${items.length}</span></h2>
      ${items.length ? `<div class="cards">${items.map(render).join("")}</div>` : empty("No matches yet", emptyMsg)}</section>`;
    const broaden = "#/discover?" + qs({ c: q.c, t: q.t, a: "any", r: "any", s: q.s, f: "either" });
    let html = `<div class="results-head"><p class="eyebrow">Your results</p><h1>Support for ${esc(topicName(q.c, q.t).toLowerCase())}</h1>
      <div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}<a class="chip edit" href="#/discover">Start over</a></div>
      <p class="small muted">Results are ordered by how closely they match your choices. Sponsored listings are labeled and never ranked higher.</p></div>`;
    if (want.includes("groups")) html += section("Peer support groups", S.matchGroups(mq), groupCard, `Try <a href="${broaden}">broadening your search</a>, or <a href="#/groups/apply">apply to lead a group</a> on this topic.`);
    if (want.includes("pros")) html += section("Professionals", S.matchPros(mq), proCard, `Try <a href="${broaden}">broadening your search</a>.`);
    if (want.includes("resources")) html += section("Resources & organizations", S.matchResources(mq), resourceCard, `Know a helpful program? <a href="#/resources/submit">Submit it for review</a>.`);
    return html;
  }

  /* ----- Directories ----- */
  function directory(kind, title, intro, applyHref, applyLabel) {
    return `<div class="page-head"><div><h1>${title}</h1><p class="muted">${intro}</p></div><a class="btn ghost" href="${applyHref}">${applyLabel}</a></div>
      <form class="filters" id="filters" data-kind="${kind}" role="search">
        <input type="search" name="text" placeholder="Search by name, topic or place" aria-label="Search">
        <select name="c" aria-label="Life area"><option value="">All life areas</option>${pilotCats().map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select>
        ${kind === "resources" ? "" : `<select name="f" aria-label="Format"><option value="either">Online or in person</option><option value="online">Online</option><option value="in-person">In person</option></select>`}
      </form>
      ${kind === "professionals" ? `<p class="small muted">Sponsored listings are labeled and never change the order of results.</p>` : ""}
      <div class="cards" id="dir-list"></div>`;
  }
  function renderDirectory() {
    const form = document.getElementById("filters"); if (!form) return;
    const kind = form.dataset.kind, f = formData(form), text = (f.text || "").toLowerCase();
    let items, render;
    if (kind === "groups") { items = S.matchGroups({ c: f.c, f: f.f }); render = groupCard; }
    if (kind === "professionals") { items = S.matchPros({ c: f.c, f: f.f }); render = proCard; }
    if (kind === "resources") { items = S.matchResources({ c: f.c }); render = resourceCard; }
    if (text) items = items.filter((x) => JSON.stringify(x).toLowerCase().includes(text));
    document.getElementById("dir-list").innerHTML = items.length ? items.map(render).join("") : empty("Nothing found", "Try a different search or life area.");
  }
  views.groups = () => directory("groups", "Peer support groups", "Every group is reviewed before it is listed. Basic groups are always free.", "#/groups/apply", "Lead a group");
  views.professionals = () => directory("professionals", "Professionals", "Qualified professionals for private, one-on-one support. Booking happens on each professional's own system.", "#/professionals/apply", "List your practice");
  views.resources = () => directory("resources", "Resources & organizations", "Reviewed programs, organizations and guides — each shows when it was last reviewed.", "#/resources/submit", "Submit a resource");

  /* ----- Details ----- */
  const dl = (rows) => `<dl class="facts">${rows.filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;
  const reportBtn = (kind, id) => `<button class="link-btn" data-action="report" data-kind="${kind}" data-id="${id}">⚑ Report a concern</button>`;
  const notFound = () => empty("Listing not available", `It may be under review or no longer listed. <a href="#/discover">Find support</a>.`);
  const visible = (x) => x && (x.status === "approved" || S.isAdmin() || (S.user() && x.submittedBy === S.user().id));

  views.groupDetail = (id) => {
    const g = S.find("groups", id); if (!visible(g)) return notFound();
    const m = S.membership(g.id);
    let action;
    if (g.status !== "approved") action = `<p class="notice">This listing is ${esc(STATUS[g.status]).toLowerCase()} and not public.</p>`;
    else if (m && m.status === "joined") action = `<p class="notice ok">You're a member of this group.</p><button class="btn ghost" data-action="leave" data-id="${g.id}">Leave group</button>`;
    else if (m && m.status === "requested") action = `<p class="notice">Your request to join is waiting for the facilitator.</p><button class="btn ghost" data-action="leave" data-id="${g.id}">Withdraw request</button>`;
    else action = `<button class="btn primary lg" data-action="join" data-id="${g.id}">${g.privacy === "private" ? "Request to join" : "Join this group"}</button>`;
    return `<p><a class="back" href="#/groups">← All groups</a></p>
      <article class="detail">
        <div class="card-top">${badge(FORMAT[g.format], "fmt")}${badge(g.privacy === "private" ? "Private group" : "Open group", g.privacy)}${g.status !== "approved" ? statusBadge(g.status) : ""}</div>
        <h1>${esc(g.name)}</h1>
        <p class="lead">${esc(g.description)}</p>
        ${dl([["Life area", esc(catName(g.category)) + " · " + esc(topicName(g.category, g.topic))],
              ["Who it's for", esc((S.audience(g.category, g.audience) || {}).name || "Everyone") + (g.role ? " → " + esc(g.role) + "s" : "")],
              ["Where", esc(g.location)], ["When", esc(g.schedule)],
              ["Participation", esc(g.expectations)], ["Facilitator", esc(g.leader)],
              ["Cost", "Free"], ["Last reviewed", fmtDate(g.reviewedAt)]])}
        <div class="action-bar">${action}</div>
        <p class="small muted">Joining shares only your display name with the facilitator, plus your email if you allow it in <a href="#/account">privacy settings</a>.</p>
        ${reportBtn("groups", g.id)}
      </article>`;
  };

  views.proDetail = (id) => {
    const p = S.find("professionals", id); if (!visible(p)) return notFound();
    return `<p><a class="back" href="#/professionals">← All professionals</a></p>
      <article class="detail">
        <div class="card-top">${p.licenseVerified ? badge("✓ License verified (" + p.licenseState + ")", "verified") : badge("Credentials self-reported", "")}${p.sponsored ? badge("Sponsored", "sponsored") : ""}${p.status !== "approved" ? statusBadge(p.status) : ""}</div>
        <h1>${esc(p.name)}</h1>
        <p class="lead">${esc(p.title)}</p>
        ${dl([["Credentials", esc(p.credentials)], ["Specialties", p.specialties.map(esc).join(", ")],
              ["Life areas", p.categories.map(catName).map(esc).join(", ")],
              ["Service area", esc(p.area)], ["Availability", [p.online && "Online", p.inPerson && "In person"].filter(Boolean).join(" · ")],
              ["Fees", esc(p.fees)], ["Insurance", esc(p.insurance)]])}
        ${p.status === "approved" ? `<div class="action-bar">
          <a class="btn primary lg" href="${esc(p.bookingUrl)}" target="_blank" rel="noopener noreferrer">Book on provider's site ↗</a>
          <button class="btn ghost lg" data-action="inquire" data-id="${p.id}">Send a private inquiry</button>
        </div>
        <p class="small muted">Booking opens the professional's own scheduling system. Connections for All does not provide clinical services and does not share your information unless you consent.</p>` : ""}
        ${p.sponsored ? `<p class="small muted">"Sponsored" means this professional pays for an enhanced profile. It does not affect where they appear in results.</p>` : ""}
        ${reportBtn("professionals", p.id)}
      </article>`;
  };

  views.resourceDetail = (id) => {
    const r = S.find("resources", id); if (!visible(r)) return notFound();
    return `<p><a class="back" href="#/resources">← All resources</a></p>
      <article class="detail">
        <div class="card-top">${badge("Last reviewed " + fmtDate(r.lastReviewed), "reviewed")}${r.status !== "approved" ? statusBadge(r.status) : ""}</div>
        <h1>${esc(r.name)}</h1>
        <p class="lead">${esc(r.description)}</p>
        ${dl([["Organization", esc(r.org)], ["Who it serves", esc(r.serves)], ["Services", esc(r.services)],
              ["Eligibility", esc(r.eligibility)], ["Location", esc(r.location)], ["Contact", esc(r.contact)],
              ["Life areas", r.categories.map(catName).map(esc).join(", ")]])}
        <div class="action-bar"><a class="btn primary lg" href="${esc(r.website)}" target="_blank" rel="noopener noreferrer">Visit website ↗</a></div>
        ${reportBtn("resources", r.id)}
      </article>`;
  };

  /* ----- Events ----- */
  views.events = (_, q) => {
    const u = S.user();
    const evs = S.get().events.filter((e) => !q.c || e.category === q.c).sort((a, b) => a.date.localeCompare(b.date));
    return `<div class="page-head"><div><h1>Events</h1><p class="muted">Workshops, open meetings and community fairs from approved groups and partners.</p></div></div>
      <div class="chips">${[["", "All"], ...pilotCats().map((c) => [c.id, c.name])].map(([id, n]) => `<a class="chip ${q.c === id || (!q.c && !id) ? "on" : ""}" href="#/events${id ? "?c=" + id : ""}">${esc(n)}</a>`).join("")}</div>
      <div class="cards">${evs.map((e) => {
        const reg = u && u.registrations.includes(e.id);
        const full = e.registered >= e.capacity;
        return `<div class="card event">
          <div class="date-box"><span>${new Date(e.date + "T12:00").toLocaleDateString(undefined, { month: "short" })}</span><strong>${new Date(e.date + "T12:00").getDate()}</strong></div>
          <div><div class="card-top">${badge(FORMAT[e.format], "fmt")}</div><h3>${esc(e.title)}</h3>
          <p class="line">${esc(e.time)}${e.location ? " · " + esc(e.location) : ""}</p><p class="small muted">Hosted by ${esc(e.host)} · ${e.capacity - e.registered} spots left</p>
          <button class="btn ${reg ? "ghost" : "primary"} sm" data-action="register" data-id="${e.id}" ${full && !reg ? "disabled" : ""}>${reg ? "Registered ✓ — cancel" : full ? "Full" : "Register (free)"}</button></div>
        </div>`;
      }).join("") || empty("No upcoming events", "Check back soon.")}</div>`;
  };

  /* ----- My groups ----- */
  views.myGroups = () => {
    const u = S.user();
    if (!u) return `<h1>My groups</h1>${empty("Sign in to see your groups", `<a class="btn primary" href="#/account?next=/my-groups">Create a free account</a>`)}`;
    const groups = u.memberships.map((m) => S.find("groups", m.groupId)).filter(Boolean);
    const evs = S.get().events.filter((e) => u.registrations.includes(e.id));
    return `<h1>My groups</h1>
      ${groups.length ? `<div class="cards">${groups.map(groupCard).join("")}</div>` : empty("You haven't joined any groups yet", `<a class="btn primary" href="#/discover">Find a group</a>`)}
      <h2 class="section-title">My events</h2>
      ${evs.length ? `<ul class="plain">${evs.map((e) => `<li>🗓️ <strong>${esc(e.title)}</strong> — ${fmtDate(e.date)}, ${esc(e.time)}</li>`).join("")}</ul>` : `<p class="muted">No event registrations. <a href="#/events">Browse events</a>.</p>`}`;
  };

  /* ----- Account ----- */
  views.account = (_, q) => {
    const u = S.user();
    if (!u) {
      return `<div class="narrow"><h1>Create your free account</h1>
        <p class="muted">You can browse without an account. An account lets you join groups, register for events and save your preferences.</p>
        <form id="signup-form" class="stack" data-next="${esc(q.next || "")}">
          <label>Display name <span class="small muted">(a first name or nickname is fine)</span><input name="name" required maxlength="40" autocomplete="nickname"></label>
          <label>Email<input name="email" type="email" required autocomplete="email"></label>
          <label class="check"><input type="checkbox" name="terms" required> I agree to the community guidelines and privacy policy.</label>
          <button class="btn primary">Create account</button>
          <p class="small muted">Prototype note: no password is stored. The MVP will use secure email sign-in and supported providers (e.g. Google, Apple).</p>
        </form>
        ${S.get().accounts.length ? `<h2 class="section-title">Or continue as</h2><div class="stack">${S.get().accounts.map((a) => `<button class="btn ghost" data-action="switch" data-id="${a.id}">${esc(a.name)} ${a.role === "admin" ? "(admin)" : ""}</button>`).join("")}</div>` : ""}
        <div class="callout"><strong>Reviewing the prototype?</strong><p>Sign in as a staff reviewer to see the administration dashboard.</p><button class="btn ghost" data-action="demo-admin">Sign in as demo admin</button></div>
      </div>`;
    }
    const st = S.get();
    const mine = ["groups", "professionals", "resources"].flatMap((k) => st[k].filter((x) => x.submittedBy === u.id).map((x) => ({ ...x, kind: k })));
    const inquiries = st.inquiries.filter((i) => i.userId === u.id);
    const editHref = (x) => x.kind === "groups" ? "#/groups/apply?edit=" + x.id : x.kind === "professionals" ? "#/professionals/apply?edit=" + x.id : "#/resources/submit?edit=" + x.id;
    return `<div class="page-head"><div><h1>My account</h1><p class="muted">Signed in as <strong>${esc(u.name)}</strong> · ${esc(u.email)}${u.role === "admin" ? " · " + badge("Staff reviewer", "verified") : ""}</p></div>
      <div class="row">${u.role === "admin" ? `<a class="btn primary" href="#/admin">Admin dashboard</a>` : ""}<button class="btn ghost" data-action="signout">Sign out</button></div></div>

      <form id="prefs-form" class="panel stack">
        <h2>Preferences</h2>
        <fieldset><legend>Life areas I'm interested in</legend><div class="check-grid">${pilotCats().map((c) => `<label class="check"><input type="checkbox" name="interests" value="${c.id}" ${u.interests.includes(c.id) ? "checked" : ""}> ${esc(c.name)}</label>`).join("")}</div></fieldset>
        <label>I prefer support that is
          <select name="format">${[["either", "Online or in person"], ["online", "Online"], ["in-person", "In person"]].map(([v, l]) => `<option value="${v}" ${u.format === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        <fieldset><legend>Privacy</legend>
          <label class="check"><input type="checkbox" name="showName" ${u.privacy.showName ? "checked" : ""}> Show my display name to other members of my groups</label>
          <label class="check"><input type="checkbox" name="shareEmailWithFacilitators" ${u.privacy.shareEmailWithFacilitators ? "checked" : ""}> Share my email with facilitators of groups I join</label>
        </fieldset>
        <fieldset><legend>Email notifications</legend>
          <label class="check"><input type="checkbox" name="decisions" ${u.notifications.decisions ? "checked" : ""}> Join-request and application decisions</label>
          <label class="check"><input type="checkbox" name="eventReminders" ${u.notifications.eventReminders ? "checked" : ""}> Event reminders</label>
          <label class="check"><input type="checkbox" name="newsletter" ${u.notifications.newsletter ? "checked" : ""}> Occasional community updates</label>
        </fieldset>
        <p class="small muted">We never ask for diagnoses, employer names or other sensitive details.</p>
        <button class="btn primary">Save preferences</button>
      </form>

      <section class="panel"><h2>My submissions</h2>
        ${mine.length ? `<ul class="plain">${mine.map((x) => `<li class="sub-row"><div><strong>${esc(x.name)}</strong> <span class="small muted">${KIND[x.kind]}</span> ${statusBadge(x.status)}
          ${x.reviewNote ? `<p class="small">Reviewer note: ${esc(x.reviewNote)}</p>` : ""}</div>
          ${x.status === "changes" ? `<a class="btn sm primary" href="${editHref(x)}">Edit & resubmit</a>` : ""}</li>`).join("")}</ul>`
          : `<p class="muted">Nothing submitted. <a href="#/groups/apply">Lead a group</a>, <a href="#/professionals/apply">list your practice</a> or <a href="#/resources/submit">submit a resource</a>.</p>`}
      </section>

      <section class="panel"><h2>My professional inquiries</h2>
        ${inquiries.length ? `<ul class="plain">${inquiries.map((i) => `<li>To <strong>${esc((S.find("professionals", i.proId) || {}).name)}</strong> · ${fmtDate(i.createdAt)} — “${esc(i.message)}”</li>`).join("")}</ul>` : `<p class="muted">No inquiries sent.</p>`}
      </section>

      <section class="panel"><h2>Your data</h2>
        <p class="muted">Download a copy of your information, or permanently delete your account.</p>
        <div class="row"><button class="btn ghost" data-action="export">Download my data</button><button class="btn danger" data-action="delete-account">Delete my account</button></div>
      </section>`;
  };

  /* ----- Application forms ----- */
  const field = (label, name, val, opts = {}) => {
    const attrs = `name="${name}" ${opts.required !== false ? "required" : ""} ${opts.type ? `type="${opts.type}"` : ""} ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ""}`;
    return `<label>${label}${opts.hint ? ` <span class="small muted">${opts.hint}</span>` : ""}${opts.area ? `<textarea ${attrs} rows="3">${esc(val)}</textarea>` : `<input ${attrs} value="${esc(val)}">`}</label>`;
  };
  const sel = (label, name, options, val) => `<label>${label}<select name="${name}" required>${options.map(([v, l]) => `<option value="${esc(v)}" ${v === val ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>`;
  const topicChecks = (selected) => `<fieldset><legend>Topics covered</legend>${pilotCats().map((c) => `<div class="topic-group"><strong class="small">${esc(c.name)}</strong><div class="check-grid">${c.topics.map((t) => `<label class="check"><input type="checkbox" name="topics" value="${c.id}:${t.id}" ${selected.includes(t.id) ? "checked" : ""}> ${esc(t.name)}</label>`).join("")}</div></div>`).join("")}</fieldset>`;
  function loadEdit(kind, q) {
    const u = S.user(); if (!q.edit || !u) return null;
    const x = S.find(kind, q.edit); return x && x.submittedBy === u.id ? x : null;
  }
  const formIntro = (title, text) => `<div class="narrow"><h1>${title}</h1><p class="muted">${text}</p>`;
  const signInFirst = (what) => S.user() ? "" : `<div class="callout">You'll need a free account to ${what}. <a href="#/account?next=${esc(location.hash.slice(1))}">Create one</a> — it takes a minute.</div>`;

  views.groupApply = (_, q) => {
    const g = loadEdit("groups", q) || {};
    const c = S.category(g.category) || pilotCats()[0];
    return formIntro(g.id ? "Update your group application" : "Apply to lead a group", "Groups appear publicly only after our team reviews them. We look at the group's purpose, the facilitator's experience, safety practices and accessibility.") + signInFirst("apply") + `
      ${g.reviewNote ? `<div class="callout warn"><strong>Reviewer note:</strong> ${esc(g.reviewNote)}</div>` : ""}
      <form id="group-form" class="stack" data-edit="${esc(g.id || "")}">
        ${field("Group name", "name", g.name)}
        <div class="two">${sel("Life area", "category", pilotCats().map((x) => [x.id, x.name]), c.id)}
        <label>Topic<select name="topic" required>${c.topics.map((t) => `<option value="${t.id}" ${t.id === g.topic ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select></label></div>
        <div class="two"><label>Audience<select name="audience" required>${c.audiences.map((a) => `<option value="${a.id}" ${a.id === g.audience ? "selected" : ""}>${esc(a.name)}</option>`).join("")}</select></label>
        ${field("Specific role (optional)", "role", g.role || "", { required: false, placeholder: "e.g. Nurse" })}</div>
        <div class="two">${sel("Format", "format", [["online", "Online"], ["in-person", "In person"], ["hybrid", "Online & in person"]], g.format)}
        ${sel("Joining", "privacy", [["open", "Open — anyone can join"], ["private", "Private — members request to join"]], g.privacy)}</div>
        ${field("Location", "location", g.location, { placeholder: "City or 'Online'" })}
        ${field("Meeting schedule", "schedule", g.schedule, { placeholder: "e.g. Every Tuesday, 7–8 PM" })}
        ${field("Description", "description", g.description, { area: true })}
        ${field("Participation expectations", "expectations", g.expectations, { area: true, hint: "confidentiality, ground rules, accessibility" })}
        ${field("Facilitator background", "leader", g.leader, { hint: "lived experience, training" })}
        ${field("Credentials or training", "credentials", (g.application || {}).credentials, { area: true, required: false, hint: "peer-support certification, license, etc." })}
        ${field("Sponsoring organization (if any)", "organization", (g.application || {}).organization, { required: false })}
        <label class="check"><input type="checkbox" name="agree" required> I agree to the facilitator standards, community guidelines and periodic re-review.</label>
        <button class="btn primary lg">${g.id ? "Resubmit for review" : "Submit for review"}</button>
      </form></div>`;
  };

  views.proApply = (_, q) => {
    const p = loadEdit("professionals", q) || { topics: [], specialties: [] };
    return formIntro(p.id ? "Update your professional application" : "List your practice", "Licensed professionals are verified against the relevant state licensing board before approval. Basic listings are free.") + signInFirst("apply") + `
      ${p.reviewNote ? `<div class="callout warn"><strong>Reviewer note:</strong> ${esc(p.reviewNote)}</div>` : ""}
      <form id="pro-form" class="stack" data-edit="${esc(p.id || "")}">
        <div class="two">${field("Full name", "name", p.name)}${field("Professional title", "title", p.title, { placeholder: "e.g. Licensed Professional Counselor" })}</div>
        ${field("Credentials", "credentials", p.credentials, { placeholder: "Degrees, licenses, certifications" })}
        <div class="two">${field("License or certification number", "licenseNumber", (p.application || {}).licenseNumber, { required: false })}
        ${field("Licensing state", "licenseState", p.licenseState || "", { required: false, placeholder: "OH" })}</div>
        ${topicChecks(p.topics)}
        ${field("Specialties", "specialties", p.specialties.join(", "), { hint: "comma-separated" })}
        ${field("Service area", "area", p.area, { placeholder: "e.g. Columbus, OH" })}
        <fieldset><legend>Availability</legend><label class="check"><input type="checkbox" name="online" ${p.online !== false ? "checked" : ""}> Online</label><label class="check"><input type="checkbox" name="inPerson" ${p.inPerson ? "checked" : ""}> In person</label></fieldset>
        <div class="two">${field("Fees", "fees", p.fees, { placeholder: "e.g. $100/session, sliding scale" })}${field("Insurance", "insurance", p.insurance, { placeholder: "Plans accepted or 'Not applicable'" })}</div>
        ${field("Booking or contact link", "bookingUrl", p.bookingUrl, { type: "url", placeholder: "https://" })}
        <label class="check"><input type="checkbox" name="sponsored" ${p.sponsored ? "checked" : ""}> I'm interested in an enhanced (paid) profile. It will be labeled "Sponsored" and does not affect ranking.</label>
        <label class="check"><input type="checkbox" name="attest" required> I attest that my credentials are accurate and I'll notify the platform of any change in license status.</label>
        <button class="btn primary lg">${p.id ? "Resubmit for review" : "Submit for verification"}</button>
      </form></div>`;
  };

  views.resourceSubmit = (_, q) => {
    const r = loadEdit("resources", q) || { topics: [] };
    return formIntro(r.id ? "Update your resource" : "Submit a resource", "Organizations and community members can suggest programs and materials. Each listing is reviewed and shows a last-reviewed date.") + signInFirst("submit a resource") + `
      ${r.reviewNote ? `<div class="callout warn"><strong>Reviewer note:</strong> ${esc(r.reviewNote)}</div>` : ""}
      <form id="resource-form" class="stack" data-edit="${esc(r.id || "")}">
        <div class="two">${field("Program or resource name", "name", r.name)}${field("Organization", "org", r.org)}</div>
        ${topicChecks(r.topics)}
        ${field("Description", "description", r.description, { area: true })}
        ${field("Who it serves", "serves", r.serves)}
        ${field("Services offered", "services", r.services, { area: true })}
        ${field("Eligibility requirements", "eligibility", r.eligibility)}
        <div class="two">${field("Location", "location", r.location)}${field("Phone or email", "contact", r.contact)}</div>
        ${field("Website or application link", "website", r.website, { type: "url", placeholder: "https://" })}
        <button class="btn primary lg">${r.id ? "Resubmit for review" : "Submit for review"}</button>
      </form></div>`;
  };

  /* ----- About / trust & safety ----- */
  views.about = () => `<div class="narrow prose">
    <h1>How Connections for All works</h1>
    <h2>How we review listings</h2>
    <ul class="checks">
      <li><strong>Peer groups</strong> — we review the group's purpose, the facilitator's background and training, ground rules, confidentiality practices and accessibility. Groups are re-reviewed every year.</li>
      <li><strong>Professionals</strong> — licenses are verified against the relevant state licensing board. Unlicensed providers (such as coaches) list their credentials and are labeled accordingly.</li>
      <li><strong>Resources</strong> — we confirm the organization, services and eligibility, and show the date each listing was last reviewed.</li>
    </ul>
    <h2>Fairness</h2>
    <p>Results are ordered only by how well they match what you're looking for. Some professionals pay for enhanced profiles; these are labeled "Sponsored" and never appear higher because of payment. Finding and joining basic peer groups is always free.</p>
    <h2>Your privacy</h2>
    <p>You can browse without an account and without telling us about diagnoses, employers or other sensitive details. We share your information with a group facilitator, professional or organization only when you explicitly consent. You can download your data or delete your account at any time from <a href="#/account">My account</a>.</p>
    <h2>Safety</h2>
    <p>Every listing has a "Report a concern" link. Our team reviews reports promptly and can suspend listings or accounts. Connections for All is a directory and community platform — it does not provide emergency, medical or clinical services.</p>
    <div class="callout crisis"><strong>Need help right now?</strong><p>If you or someone else is in immediate danger, call <strong>911</strong>. For mental-health crisis support in the U.S., call or text <strong>988</strong> (Suicide & Crisis Lifeline).</p></div>
  </div>`;

  /* ----- Admin dashboard ----- */
  const ADMIN_TABS = [["overview", "Overview"], ["queue", "Review queue"], ["joins", "Join requests"], ["reports", "Reports"], ["listings", "Listings & renewals"], ["outbox", "Email outbox"], ["audit", "Activity log"]];
  views.admin = (_, q) => {
    if (!S.isAdmin()) return `<h1>Administration</h1>${empty("Staff access only", `Sign in with a staff reviewer account. <a href="#/account">Go to account</a>`)}`;
    const st = S.get(), tab = q.tab || "overview";
    const queue = ["groups", "professionals", "resources"].flatMap((k) => st[k].filter((x) => x.status === "pending").map((x) => ({ ...x, kind: k })));
    const openReports = st.reports.filter((r) => r.status === "open");
    const pendingJoins = st.joinRequests.filter((j) => j.status === "pending");
    const counts = { queue: queue.length, joins: pendingJoins.length, reports: openReports.length };
    let body = "";

    if (tab === "overview") {
      const m = st.metrics;
      const resolved = st.reports.filter((r) => r.resolvedAt);
      const avgHrs = resolved.length ? (resolved.reduce((s, r) => s + (new Date(r.resolvedAt) - new Date(r.createdAt)), 0) / resolved.length / 3600000) : null;
      const all = ["groups", "professionals"].flatMap((k) => st[k].filter((x) => x.status === "approved" && x.renewalDue));
      const due = all.filter((x) => daysUntil(x.renewalDue) <= 30).length;
      const appr = st.audit.filter((a) => a.action === "Approved").length, decided = st.audit.filter((a) => ["Approved", "Declined"].includes(a.action)).length;
      const tile = (label, val, sub) => `<div class="tile"><span class="small muted">${label}</span><strong>${val}</strong>${sub ? `<span class="small muted">${sub}</span>` : ""}</div>`;
      body = `<div class="tiles">
        ${tile("Searches completed", m.searchesCompleted, m.searchesStarted ? Math.round(100 * m.searchesCompleted / Math.max(m.searchesStarted, m.searchesCompleted)) + "% of started" : "")}
        ${tile("Group join requests", m.joinRequests)}
        ${tile("Awaiting review", queue.length)}
        ${tile("Open safety reports", openReports.length, avgHrs != null ? "avg. response " + (avgHrs < 1 ? "<1" : avgHrs.toFixed(1)) + " hrs" : "")}
        ${tile("Approved groups", S.approved("groups").length)}
        ${tile("Verified professionals", S.approved("professionals").filter((p) => p.licenseVerified).length)}
        ${tile("Renewals due ≤30 days", due)}
        ${tile("Approval rate (this session)", decided ? Math.round(100 * appr / decided) + "%" : "—")}
      </div>
      <div class="panel"><h2>Pilot targets</h2><ul class="plain small">
        <li>5–10 approved peer-support groups — currently <strong>${S.approved("groups").length}</strong></li>
        <li>3–5 community or organizational partners — currently <strong>${new Set(S.approved("resources").map((r) => r.org)).size}</strong></li>
        <li>A small number of verified professionals — currently <strong>${S.approved("professionals").filter((p) => p.licenseVerified).length}</strong></li>
        <li>Event registrations — <strong>${m.eventRegistrations}</strong> · Professional inquiries — <strong>${m.inquiries}</strong></li>
      </ul><p class="small muted">30-day return rate and satisfaction will come from analytics and surveys in the MVP.</p></div>`;
    }

    if (tab === "queue") {
      body = queue.length ? queue.map((x) => {
        const app = x.application || {};
        let details;
        if (x.kind === "groups") details = dl([["Life area", esc(catName(x.category)) + " · " + esc(topicName(x.category, x.topic))], ["Format", FORMAT[x.format]], ["Joining", x.privacy], ["Where / when", esc(x.location) + " — " + esc(x.schedule)], ["Description", esc(x.description)], ["Expectations", esc(x.expectations)], ["Facilitator", esc(x.leader)], ["Credentials", esc(app.credentials)], ["Organization", esc(app.organization)]]);
        if (x.kind === "professionals") details = dl([["Title", esc(x.title)], ["Credentials", esc(x.credentials)], ["License #", esc(app.licenseNumber)], ["License state", esc(x.licenseState)], ["Specialties", x.specialties.map(esc).join(", ")], ["Area", esc(x.area)], ["Fees", esc(x.fees)], ["Booking link", esc(x.bookingUrl)], ["Enhanced listing", x.sponsored ? "Requested (will be labeled Sponsored)" : "No"], ["Notes", esc(app.notes)]]);
        if (x.kind === "resources") details = dl([["Organization", esc(x.org)], ["Description", esc(x.description)], ["Serves", esc(x.serves)], ["Services", esc(x.services)], ["Eligibility", esc(x.eligibility)], ["Contact", esc(x.contact)], ["Website", esc(x.website)]]);
        const needsLicense = x.kind === "professionals" && x.licenseState;
        return `<div class="panel review" data-kind="${x.kind}" data-id="${x.id}">
          <div class="card-top">${badge(KIND[x.kind])}${x.resubmitted ? badge("Resubmitted", "st-changes") : ""}</div>
          <h3>${esc(x.name)}</h3>${details}
          ${needsLicense ? `<label class="check verify"><input type="checkbox" class="license-check"> I verified this license with the ${esc(x.licenseState)} licensing board and it is active and in good standing.</label>` : ""}
          <div class="row"><button class="btn primary sm" data-action="approve">Approve</button><button class="btn ghost sm" data-action="changes">Request changes</button><button class="btn danger sm" data-action="decline">Decline</button></div>
        </div>`;
      }).join("") : empty("Queue is clear", "No applications are waiting for review.");
    }

    if (tab === "joins") {
      body = pendingJoins.length ? pendingJoins.map((j) => `<div class="panel"><h3>${esc(j.userName)} → ${esc((S.find("groups", j.groupId) || {}).name)}</h3>
        <p class="small muted">${fmtDate(j.createdAt.slice(0, 10))}${j.email ? " · " + esc(j.email) : " · email not shared"}</p>${j.message ? `<p>“${esc(j.message)}”</p>` : ""}
        <div class="row"><button class="btn primary sm" data-action="join-approve" data-id="${j.id}">Approve</button><button class="btn ghost sm" data-action="join-decline" data-id="${j.id}">Decline</button></div></div>`).join("")
        : empty("No pending requests", "Requests to join private groups appear here (and in each facilitator's tools).");
    }

    if (tab === "reports") {
      body = st.reports.length ? st.reports.map((r) => `<div class="panel ${r.status === "open" ? "urgent" : ""}">
        <div class="card-top">${badge(r.status === "open" ? "Open" : "Closed: " + r.outcome, r.status === "open" ? "st-pending" : "st-approved")}${badge(r.reason)}</div>
        <h3>${esc(r.targetName)} <span class="small muted">${r.kind === "general" ? "General concern" : KIND[r.kind]}</span></h3>
        <p>${esc(r.details) || "<span class='muted'>No details provided.</span>"}</p>
        <p class="small muted">Reported ${new Date(r.createdAt).toLocaleString()} by ${esc(r.by)}</p>
        ${r.status === "open" ? `<div class="row">${r.kind !== "general" ? `<button class="btn danger sm" data-action="report-suspend" data-id="${r.id}">Suspend listing</button>` : ""}<button class="btn primary sm" data-action="report-resolve" data-id="${r.id}">Resolved — follow-up done</button><button class="btn ghost sm" data-action="report-dismiss" data-id="${r.id}">Dismiss</button></div>` : ""}
      </div>`).join("") : empty("No reports", "Concerns reported by users will appear here.");
    }

    if (tab === "listings") {
      const rows = ["groups", "professionals", "resources"].flatMap((k) => st[k].map((x) => ({ ...x, kind: k })));
      body = `<div class="table-wrap"><table><thead><tr><th>Listing</th><th>Type</th><th>Status</th><th>Next review</th><th></th></tr></thead><tbody>
        ${rows.map((x) => {
          const due = x.kind === "resources" ? (x.lastReviewed ? new Date(new Date(x.lastReviewed).getTime() + 182 * 86400000).toISOString().slice(0, 10) : null) : x.renewalDue;
          const d = due ? daysUntil(due) : null;
          return `<tr><td><a href="#/${x.kind}/${x.id}">${esc(x.name)}</a></td><td>${KIND[x.kind]}</td><td>${statusBadge(x.status)}</td>
          <td>${due ? fmtDate(due) + (d < 0 ? " " + badge("Overdue", "st-declined") : d <= 30 ? " " + badge("Due soon", "st-pending") : "") : "—"}</td>
          <td class="row">${x.status === "approved" ? `<button class="btn ghost sm" data-action="renew" data-kind="${x.kind}" data-id="${x.id}">Mark re-reviewed</button><button class="btn danger sm" data-action="suspend" data-kind="${x.kind}" data-id="${x.id}">Suspend</button>` : x.status === "suspended" ? `<button class="btn ghost sm" data-action="reinstate" data-kind="${x.kind}" data-id="${x.id}">Reinstate</button>` : ""}</td></tr>`;
        }).join("")}</tbody></table></div><p class="small muted">Groups and professionals are re-reviewed yearly; resources every six months.</p>`;
    }

    if (tab === "outbox") body = st.outbox.length ? st.outbox.map((m) => `<div class="panel mail"><p class="small muted">To: ${esc(m.to)} · ${new Date(m.at).toLocaleString()}</p><h3>${esc(m.subject)}</h3><p>${esc(m.body)}</p></div>`).join("") : empty("No emails yet", "Notifications the platform would send (decisions, confirmations) appear here.");
    if (tab === "audit") body = st.audit.length ? `<ul class="plain log">${st.audit.map((a) => `<li><span class="small muted">${new Date(a.at).toLocaleString()}</span> <strong>${esc(a.action)}</strong> — ${esc(a.detail)} <span class="small muted">by ${esc(a.by)}</span></li>`).join("")}</ul>` : empty("No activity yet", "Approvals, suspensions and other staff actions are logged here.");

    return `<div class="page-head"><div><h1>Administration</h1><p class="muted">Review applications, verify credentials, handle reports and track renewals.</p></div><button class="btn ghost sm" data-action="reset">Reset demo data</button></div>
      <nav class="tabs" aria-label="Admin sections">${ADMIN_TABS.map(([id, l]) => `<a href="#/admin?tab=${id}" class="${tab === id ? "on" : ""}">${l}${counts[id] ? ` <span class="count">${counts[id]}</span>` : ""}</a>`).join("")}</nav>
      <div class="admin-body">${body}</div>`;
  };

  /* ---------- router ---------- */
  const routes = [
    [/^\/?$/, views.home], [/^\/discover$/, views.discover],
    [/^\/groups$/, views.groups], [/^\/groups\/apply$/, views.groupApply], [/^\/groups\/([\w-]+)$/, views.groupDetail],
    [/^\/professionals$/, views.professionals], [/^\/professionals\/apply$/, views.proApply], [/^\/professionals\/([\w-]+)$/, views.proDetail],
    [/^\/resources$/, views.resources], [/^\/resources\/submit$/, views.resourceSubmit], [/^\/resources\/([\w-]+)$/, views.resourceDetail],
    [/^\/events$/, views.events], [/^\/my-groups$/, views.myGroups], [/^\/account$/, views.account],
    [/^\/admin$/, views.admin], [/^\/about$/, views.about]
  ];
  function route() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, query] = raw.split("?");
    const q = Object.fromEntries(new URLSearchParams(query || ""));
    let html = null;
    for (const [re, fn] of routes) { const m = path.match(re); if (m) { html = fn(m[1], q); break; } }
    main.innerHTML = html || empty("Page not found", `<a href="#/">Go home</a>`);
    renderDirectory();
    updateChrome(path);
    const h1 = main.querySelector("h1"); if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  function updateChrome(path) {
    const u = S.user();
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const n = a.dataset.nav;
      a.classList.toggle("on", n === "/" ? path === "/" || path === "" : path.startsWith(n));
    });
    document.getElementById("admin-link").hidden = !S.isAdmin();
    document.getElementById("account-label").textContent = u ? u.name : "Sign in";
  }
  window.addEventListener("hashchange", route);

  /* ---------- events: forms ---------- */
  document.addEventListener("input", (e) => { if (e.target.closest("#filters")) renderDirectory(); });
  document.addEventListener("change", (e) => {
    if (e.target.closest("#filters")) renderDirectory();
    if (e.target.matches("#group-form [name=category]")) {
      const c = S.category(e.target.value), f = e.target.form;
      f.topic.innerHTML = c.topics.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("");
      f.audience.innerHTML = c.audiences.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join("");
    }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target, id = form.id;
    if (!["support-form", "signup-form", "prefs-form", "group-form", "pro-form", "resource-form", "filters"].includes(id)) return;
    e.preventDefault();
    const st = S.get(), f = formData(form), u = S.user();

    if (id === "filters") return;
    if (id === "support-form") {
      const s = arr(f.s); if (!s.length) return toast("Choose at least one kind of support.");
      const q = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1])); q.s = s.join(",");
      location.hash = "#/discover?" + qs(q); return;
    }
    if (id === "signup-form") {
      const existing = st.accounts.find((a) => a.email.toLowerCase() === f.email.toLowerCase());
      if (existing) { st.currentUserId = existing.id; S.save(); toast("Welcome back, " + existing.name + "."); }
      else { const a = S.newAccount(f.name, f.email); S.notify(a.email, "Welcome to Connections for All", "Your account is ready. You can update privacy and notification preferences any time."); S.save(); toast("Account created. Welcome, " + a.name + "!"); }
      location.hash = "#" + (form.dataset.next || "/discover"); return;
    }
    if (!u) return requireUser("first");

    if (id === "prefs-form") {
      u.interests = arr(f.interests); u.format = f.format;
      u.privacy = { showName: !!f.showName, shareEmailWithFacilitators: !!f.shareEmailWithFacilitators };
      u.notifications = { decisions: !!f.decisions, eventReminders: !!f.eventReminders, newsletter: !!f.newsletter };
      S.save(); toast("Preferences saved."); return;
    }

    const editId = form.dataset.edit;
    const parseTopics = () => { const t = arr(f.topics).map((x) => x.split(":")); return { categories: [...new Set(t.map((x) => x[0]))], topics: t.map((x) => x[1]) }; };
    let kind, rec;
    if (id === "group-form") {
      kind = "groups";
      rec = { name: f.name, category: f.category, topic: f.topic, audience: f.audience, role: f.role || null, format: f.format, privacy: f.privacy, location: f.location, schedule: f.schedule, description: f.description, expectations: f.expectations, leader: f.leader, application: { credentials: f.credentials, organization: f.organization } };
    }
    if (id === "pro-form") {
      const t = parseTopics(); if (!t.topics.length) return toast("Select at least one topic you support.");
      if (!f.online && !f.inPerson) return toast("Choose online, in person, or both.");
      kind = "professionals";
      rec = { name: f.name, title: f.title, credentials: f.credentials, licenseState: (f.licenseState || "").toUpperCase() || null, licenseVerified: false, ...t,
        audiences: [...new Set(t.categories.flatMap((c) => S.category(c).audiences.map((a) => a.id)))],
        specialties: f.specialties.split(",").map((s) => s.trim()).filter(Boolean), area: f.area, online: !!f.online, inPerson: !!f.inPerson,
        fees: f.fees, insurance: f.insurance, bookingUrl: f.bookingUrl, sponsored: !!f.sponsored, application: { licenseNumber: f.licenseNumber } };
    }
    if (id === "resource-form") {
      const t = parseTopics(); if (!t.topics.length) return toast("Select at least one topic.");
      kind = "resources";
      rec = { name: f.name, org: f.org, ...t, description: f.description, serves: f.serves, services: f.services, eligibility: f.eligibility, location: f.location, contact: f.contact, website: f.website, lastReviewed: null };
    }
    const existing = editId && S.find(kind, editId);
    if (existing && existing.submittedBy === u.id) { Object.assign(existing, rec, { status: "pending", resubmitted: true }); }
    else st[kind].push({ id: S.uid(kind[0]), ...rec, status: "pending", submittedBy: u.id, submittedAt: S.today() });
    S.notify(u.email, "We received your submission: " + rec.name, "Our team will review it and email you with a decision or any questions.");
    S.notify("review-team@connectionsforall (staff)", "New " + KIND[kind].toLowerCase() + " submission: " + rec.name, "A submission is waiting in the review queue.");
    S.save(); toast("Submitted for review. We'll email you with a decision.");
    location.hash = "#/account";
  });

  /* ---------- events: buttons ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]"); if (!b) return;
    const st = S.get(), u = S.user(), a = b.dataset.action, id = b.dataset.id;

    if (a === "join") {
      if (!requireUser("to join groups")) return;
      const g = S.find("groups", id);
      if (g.privacy === "open") {
        modal(`<h2>Join ${esc(g.name)}?</h2><p>The facilitator will see your display name${u.privacy.shareEmailWithFacilitators ? " and email" : ""}. You can leave at any time.</p>${modalActions("Join group")}`, () => {
          u.memberships.push({ groupId: g.id, status: "joined", since: S.today() }); S.bump("joinRequests");
          S.notify(u.email, "You joined " + g.name, "Meeting details: " + g.schedule + " · " + g.location);
          S.save(); toast("You've joined " + g.name + "."); route();
        });
      } else {
        modal(`<h2>Request to join ${esc(g.name)}</h2><p class="muted">This is a private group. The facilitator reviews requests to keep the group safe.</p>
          <label>Message to the facilitator (optional)<textarea name="message" rows="3" maxlength="500" placeholder="A sentence about why you'd like to join. Please don't include medical details."></textarea></label>
          <label class="check"><input type="checkbox" name="consent" required> I consent to sharing my display name${u.privacy.shareEmailWithFacilitators ? ", email" : ""} and this message with the group's facilitator.</label>${modalActions("Send request")}`, (f) => {
          st.joinRequests.push({ id: S.uid("j"), groupId: g.id, userId: u.id, userName: u.name, email: u.privacy.shareEmailWithFacilitators ? u.email : null, message: f.message, status: "pending", createdAt: new Date().toISOString() });
          u.memberships.push({ groupId: g.id, status: "requested", since: S.today() }); S.bump("joinRequests");
          S.notify("Facilitator of " + g.name, "New join request", u.name + " requested to join.");
          S.save(); toast("Request sent. You'll be notified when the facilitator responds."); route();
        });
      }
    }
    if (a === "leave") {
      u.memberships = u.memberships.filter((m) => m.groupId !== id);
      st.joinRequests.filter((j) => j.groupId === id && j.userId === u.id && j.status === "pending").forEach((j) => { j.status = "withdrawn"; });
      S.save(); toast("Done."); route();
    }
    if (a === "inquire") {
      if (!requireUser("to contact professionals")) return;
      const p = S.find("professionals", id);
      modal(`<h2>Private inquiry to ${esc(p.name)}</h2>
        <label>Your message<textarea name="message" rows="4" required maxlength="800" placeholder="What you're looking for and your general availability. You don't need to share diagnoses or other sensitive details."></textarea></label>
        <label>How should they reply?<select name="contactVia"><option value="email">Email (${esc(u.email)})</option></select></label>
        <label class="check"><input type="checkbox" name="consent" required> I consent to Connections for All sharing my display name, email and this message with ${esc(p.name)}.</label>${modalActions("Send inquiry")}`, (f) => {
        st.inquiries.push({ id: S.uid("i"), proId: p.id, userId: u.id, message: f.message, consent: true, createdAt: S.today() }); S.bump("inquiries");
        S.notify(p.name + " (professional)", "New inquiry via Connections for All", "From " + u.name + " <" + u.email + ">: " + f.message);
        S.notify(u.email, "Your inquiry to " + p.name + " was sent", "They'll reply to you directly by email.");
        S.save(); toast("Inquiry sent. " + p.name + " will reply to you directly.");
      });
    }
    if (a === "register") {
      if (!requireUser("to register for events")) return;
      const ev = st.events.find((x) => x.id === id);
      if (u.registrations.includes(id)) { u.registrations = u.registrations.filter((x) => x !== id); ev.registered--; toast("Registration cancelled."); }
      else { u.registrations.push(id); ev.registered++; S.bump("eventRegistrations"); S.notify(u.email, "You're registered: " + ev.title, fmtDate(ev.date) + " at " + ev.time); toast("You're registered!"); }
      S.save(); route();
    }
    if (a === "report") {
      const kind = b.dataset.kind, x = kind === "general" ? null : S.find(kind, id);
      modal(`<h2>Report a concern</h2>
        <div class="callout crisis small">If someone is in immediate danger, call <strong>911</strong>. For crisis support, call or text <strong>988</strong>.</div>
        <p class="muted">${x ? "About: <strong>" + esc(x.name) + "</strong>" : "Tell us about any safety, privacy or content concern."}</p>
        <label>What's the concern?<select name="reason" required><option value="">Choose one</option><option>Safety concern</option><option>Inappropriate behavior</option><option>Inaccurate information</option><option>Credential or licensing concern</option><option>Privacy concern</option><option>Spam or scam</option><option>Other</option></select></label>
        <label>Details (optional)<textarea name="details" rows="3" maxlength="1000"></textarea></label>
        <p class="small muted">Reports are confidential and reviewed by our team. You can report without an account.</p>${modalActions("Submit report")}`, (f) => {
        st.reports.unshift({ id: S.uid("rep"), kind, targetId: id || null, targetName: x ? x.name : "General", reason: f.reason, details: f.details, status: "open", by: u ? u.name : "Anonymous", createdAt: new Date().toISOString() });
        S.notify("safety-team@connectionsforall (staff)", "New report: " + f.reason, (x ? x.name : "General") + " — " + (f.details || "no details"));
        S.save(); toast("Thank you. Our team will review your report.");
      });
    }
    if (a === "demo-admin") {
      const adm = st.accounts.find((x) => x.role === "admin") || S.newAccount("Demo Admin", "admin@example.org", "admin");
      st.currentUserId = adm.id; S.save(); location.hash = "#/admin";
    }
    if (a === "switch") { st.currentUserId = id; S.save(); location.hash = "#/account"; }
    if (a === "signout") { st.currentUserId = null; S.save(); toast("Signed out."); location.hash = "#/"; }
    if (a === "export") {
      const data = { account: u, joinRequests: st.joinRequests.filter((j) => j.userId === u.id), inquiries: st.inquiries.filter((i) => i.userId === u.id),
        submissions: ["groups", "professionals", "resources"].flatMap((k) => st[k].filter((x) => x.submittedBy === u.id)), exportedAt: new Date().toISOString() };
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      link.download = "connections-for-all-my-data.json"; link.click(); URL.revokeObjectURL(link.href);
    }
    if (a === "delete-account") {
      modal(`<h2>Delete your account?</h2><p>This permanently removes your profile, group memberships, join requests and inquiries. Listings you submitted will be withdrawn from review.</p>
        <label>Type DELETE to confirm<input name="confirm" required pattern="DELETE" autocomplete="off"></label>${modalActions("Delete account", true)}`, () => {
        st.joinRequests = st.joinRequests.filter((j) => j.userId !== u.id);
        st.inquiries = st.inquiries.filter((i) => i.userId !== u.id);
        ["groups", "professionals", "resources"].forEach((k) => { st[k] = st[k].filter((x) => !(x.submittedBy === u.id && x.status !== "approved")); });
        st.events.forEach((ev) => { if (u.registrations.includes(ev.id)) ev.registered--; });
        st.accounts = st.accounts.filter((x) => x.id !== u.id); st.currentUserId = null;
        S.log("Account deleted", "User-initiated deletion"); S.save(); toast("Your account has been deleted."); location.hash = "#/";
      });
    }

    /* admin actions */
    if (!S.isAdmin()) return;
    const review = b.closest(".review");
    if (review && ["approve", "changes", "decline"].includes(a)) {
      const kind = review.dataset.kind, x = S.find(kind, review.dataset.id);
      const owner = x.submittedBy && S.account(x.submittedBy);
      const to = owner ? owner.email : "Applicant (" + x.name + ")";
      if (a === "approve") {
        const lc = review.querySelector(".license-check");
        if (lc && !lc.checked) return toast("Confirm license verification before approving.");
        x.status = "approved"; x.reviewNote = null;
        if (kind === "resources") x.lastReviewed = S.today(); else { x.reviewedAt = S.today(); x.renewalDue = addMonths(12); }
        if (lc) x.licenseVerified = true;
        S.log("Approved", KIND[kind] + ": " + x.name); S.notify(to, "Approved: " + x.name, "Your listing is now live on Connections for All.");
        S.save(); toast("Approved — the listing is now public."); route();
      } else {
        const declining = a === "decline";
        modal(`<h2>${declining ? "Decline" : "Request changes to"} “${esc(x.name)}”</h2><label>Note to the applicant<textarea name="note" rows="4" required placeholder="${declining ? "Explain the reason for the decision." : "What needs to be corrected or added?"}"></textarea></label>${modalActions(declining ? "Decline" : "Send request", declining)}`, (f) => {
          x.status = declining ? "declined" : "changes"; x.reviewNote = f.note;
          S.log(declining ? "Declined" : "Changes requested", KIND[kind] + ": " + x.name);
          S.notify(to, (declining ? "Decision on " : "Changes requested: ") + x.name, f.note);
          S.save(); toast(declining ? "Declined." : "Change request sent."); route();
        });
      }
    }
    if (a === "join-approve" || a === "join-decline") {
      const j = st.joinRequests.find((x) => x.id === id), g = S.find("groups", j.groupId), acct = S.account(j.userId);
      j.status = a === "join-approve" ? "approved" : "declined";
      if (acct) {
        const m = acct.memberships.find((x) => x.groupId === j.groupId);
        if (m) { if (j.status === "approved") m.status = "joined"; else acct.memberships = acct.memberships.filter((x) => x !== m); }
        S.notify(acct.email, (j.status === "approved" ? "Welcome to " : "Update on your request to join ") + g.name, j.status === "approved" ? "Meeting details: " + g.schedule + " · " + g.location : "The facilitator wasn't able to accept your request at this time. Other groups may be a good fit.");
      }
      S.log("Join request " + j.status, j.userName + " → " + g.name); S.save(); route();
    }
    if (a.startsWith("report-")) {
      const r = st.reports.find((x) => x.id === id);
      const outcome = { "report-suspend": "listing suspended", "report-resolve": "resolved", "report-dismiss": "dismissed" }[a];
      if (a === "report-suspend") { const x = S.find(r.kind, r.targetId); if (x) x.status = "suspended"; }
      r.status = "closed"; r.outcome = outcome; r.resolvedAt = new Date().toISOString();
      S.log("Report " + outcome, r.reason + " — " + r.targetName); S.save(); toast("Report closed: " + outcome + "."); route();
    }
    if (["suspend", "reinstate", "renew"].includes(a)) {
      const x = S.find(b.dataset.kind, id);
      if (a === "suspend") x.status = "suspended";
      if (a === "reinstate") x.status = "approved";
      if (a === "renew") { if (b.dataset.kind === "resources") x.lastReviewed = S.today(); else { x.reviewedAt = S.today(); x.renewalDue = addMonths(12); } }
      S.log({ suspend: "Suspended", reinstate: "Reinstated", renew: "Re-reviewed" }[a], KIND[b.dataset.kind] + ": " + x.name); S.save(); route();
    }
    if (a === "reset") {
      modal(`<h2>Reset demo data?</h2><p>This restores the sample listings and clears accounts, requests and reports stored in this browser.</p>${modalActions("Reset", true)}`, () => { S.reset(); location.hash = "#/"; route(); toast("Demo data reset."); });
    }
  });

  route();
})();
