/* Prototype data layer. Persists to localStorage so the demo survives reloads.
 * In the real MVP this is replaced by a server API + database with role-based access. */
(function () {
  const KEY = "cfa-prototype-v1";
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => p + Math.random().toString(36).slice(2, 9);

  function fresh() {
    const s = clone(window.CFA_SEED);
    s.accounts = [];          // demo accounts kept in this browser
    s.currentUserId = null;   // signed-in account id
    s.joinRequests = [];      // {id, groupId, userName, message, status, createdAt}
    s.inquiries = [];         // {id, proId, userName, message, consent, createdAt}
    s.reports = [];           // {id, kind, targetId, targetName, reason, details, status, createdAt, resolvedAt}
    s.outbox = [];            // simulated email notifications
    s.audit = [];             // admin actions
    s.metrics = { searchesStarted: 0, searchesCompleted: 0, joinRequests: 0, inquiries: 0, eventRegistrations: 0 };
    return s;
  }

  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { state = fresh(); }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable: demo runs in-memory */ } }

  const S = {
    get: () => state,
    save,
    uid, today,
    reset() { state = fresh(); save(); },
    bump(metric) { state.metrics[metric] = (state.metrics[metric] || 0) + 1; save(); },
    category: (id) => state.categories.find((c) => c.id === id),
    topic(catId, topicId) { const c = S.category(catId); return c && c.topics.find((t) => t.id === topicId); },
    audience(catId, audId) { const c = S.category(catId); return c && c.audiences.find((a) => a.id === audId); },
    find(kind, id) { return (state[kind] || []).find((x) => x.id === id); },
    approved: (kind) => state[kind].filter((x) => x.status === "approved"),
    notify(to, subject, body) { state.outbox.unshift({ id: uid("m"), to, subject, body, at: new Date().toISOString() }); },
    log(action, detail) { const u = S.user(); state.audit.unshift({ id: uid("a"), action, detail, by: u ? u.name : "system", at: new Date().toISOString() }); },
    user: () => state.accounts.find((a) => a.id === state.currentUserId) || null,
    account: (id) => state.accounts.find((a) => a.id === id) || null,
    isAdmin: () => { const u = S.user(); return !!(u && u.role === "admin"); },
    membership(groupId) { const u = S.user(); return u ? u.memberships.find((m) => m.groupId === groupId) : null; },
    newAccount(name, email, role) {
      const a = {
        id: uid("u"), name, email, role: role || "member", createdAt: today(),
        interests: [], format: "either",
        privacy: { showName: true, shareEmailWithFacilitators: false },
        notifications: { decisions: true, eventReminders: true, newsletter: false },
        memberships: [], registrations: []
      };
      state.accounts.push(a); state.currentUserId = a.id; save(); return a;
    }
  };

  /* Matching: listings are ranked purely by relevance to the user's choices, then by name.
   * The `sponsored` flag is displayed as a label and is deliberately NEVER used for ordering. */
  S.matchGroups = function (q) {
    return S.approved("groups").filter((g) =>
      (!q.c || g.category === q.c) &&
      (!q.t || g.topic === q.t) &&
      (!q.a || !g.audience || g.audience === q.a || g.audience === "general") &&
      (!q.r || !g.role || g.role === q.r) &&
      formatOk(g.format, q.f)
    ).sort(byScore(q, (g) => [g.topic === q.t, g.audience === q.a, g.role === q.r]));
  };

  S.matchPros = function (q) {
    return S.approved("professionals").filter((p) =>
      (!q.c || p.categories.includes(q.c)) &&
      (!q.f || q.f === "either" || (q.f === "online" ? p.online : p.inPerson))
    ).sort(byScore(q, (p) => [p.topics.includes(q.t), p.audiences.includes(q.a), p.licenseVerified]));
  };

  S.matchResources = function (q) {
    return S.approved("resources").filter((r) => !q.c || r.categories.includes(q.c))
      .sort(byScore(q, (r) => [r.topics.includes(q.t)]));
  };

  function formatOk(fmt, want) {
    if (!want || want === "either") return true;
    return fmt === want || fmt === "hybrid";
  }
  function byScore(q, signals) {
    return (a, b) => {
      const sa = signals(a).filter(Boolean).length, sb = signals(b).filter(Boolean).length;
      return sb - sa || a.name.localeCompare(b.name);
    };
  }

  window.CFA = S;
})();
