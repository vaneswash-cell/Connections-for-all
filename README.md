# Connections for All

**One platform. Multiple pathways to support.**

This is a clickable, mobile-first prototype of a platform that connects people with **community support** (peer groups that have been approved), **professional connections** (professionals with verified credentials) and **resources & guidance** (organizations that have been reviewed). It follows Phases 2 and 3 of the product blueprint. You can use it to demo complete user journeys to potential users, partners and developers before you pay for a full build.

> ⚠️ **Prototype:** every group, professional and organization in it is an illustrative sample, not a real listing. Data is saved only in the browser you're using (localStorage). Nothing is sent to a server.

## Run it

You don't need to build or install anything. Serve the folder and open it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

You can also publish it as-is with GitHub Pages (Settings → Pages → deploy from `main`, root folder).

## What's included

| Blueprint area | In the prototype |
|---|---|
| Main navigation | Discover · My Groups · Professionals · Resources · Events · My Account (a bottom tab bar on phones) |
| Discovery flow | Life area → challenge → audience/role (optional) → support type(s) → online/in person → combined results |
| Pilot categories | Work & Career, Education & Student Life, Disability & Accessibility, Caregiving & Family Support (other areas show as "coming after the pilot") |
| A. Accounts & profiles | Sign up with only a display name and email, interests, format preference, privacy and notification settings, data export, account deletion |
| B. Groups | Search and filter, group detail pages, joining open groups, requesting to join private groups (with consent), group-leader application and resubmission after a "changes requested" decision |
| C. Professionals | Profiles show credentials, license-verified badge, specialties, area, fees and insurance. Booking links out to each professional's own system. Private inquiries require explicit consent |
| D. Resources | Organization submissions, eligibility, contact details, last-reviewed date |
| E. Administration | Review queue (approve, request changes, decline), required license-verification step, join requests, safety reports (suspend, resolve, dismiss), listings and renewals, simulated email outbox, audit log, pilot metrics |
| Safety & fairness | Report a concern on every listing (no account needed), crisis information (911/988), "Sponsored" labels that **never** change ranking, no requirement to disclose sensitive details |

**To try the admin side:** go to My Account → *Sign in as demo admin*. Use *Reset demo data* in the admin dashboard to start over.

## Structure

```
index.html            app shell, navigation, footer
assets/data.js        seed categories and sample listings (replace with approved partner data)
assets/store.js       data layer, persistence and matching/ranking logic
assets/app.js         router, views, forms and admin workflows
assets/styles.css     mobile-first styles with light and dark themes
```

## Moving from prototype to MVP

These parts are deliberately simulated and need real implementations in the MVP:

- a server database and API with role-based permissions, in place of localStorage
- real authentication (email sign-in, Google or Apple)
- a transactional email service, in place of the outbox
- analytics for 30-day return rate and satisfaction
- legal review covering HIPAA applicability, the FTC Health Breach Notification Rule, Ohio privacy law and professional licensing rules

The data shapes in `assets/data.js` and the workflows in `assets/app.js` can serve as a reference specification for the developer RFP.
