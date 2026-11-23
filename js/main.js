// Unique Engineering - site scripts
// 1. Mobile menu  2. Lightbox  3. Products filter  4. Enquiry form  5. Scroll animation

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// 1. Mobile menu ------------------------------------------------------------
const menuBtn = $(".menu-btn");
const menu = $("#menu");
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menuBtn.setAttribute("aria-expanded", menu.classList.toggle("open"));
  });
}

// 2. Image lightbox (gallery + certificates) ---------------------------------
const box = $(".lightbox");
if (box) {
  const boxImg = $("img", box);
  $$("[data-zoom]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      boxImg.src = a.href;
      box.hidden = false;
    })
  );
  box.addEventListener("click", () => (box.hidden = true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") box.hidden = true; });
}

// 3. Products filter ---------------------------------------------------------
$$(".pfilter button").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".pfilter button").forEach((b) => b.classList.toggle("on", b === btn));
    $$(".pcd").forEach((card) => {
      card.hidden = btn.dataset.f !== "all" && card.dataset.c !== btn.dataset.f;
    });
  })
);

// 4. Enquiry form (contact page) ---------------------------------------------
// Emails the enquiry to the owner via Web3Forms. Paste the free access key
// (web3forms.com, created with the owner's email) into WEB3FORMS_KEY.
// While it is empty, the form falls back to opening the visitor's email app.
const WEB3FORMS_KEY = "";
const OWNER_EMAIL = "uniquengg2023@gmail.com";
const form = $(".form");
if (form) {
  const note = $(".form-note", form);
  const submitBtn = $("button", form);
  const say = (text, ok) => {
    note.textContent = text;
    note.className = "form-note " + (ok ? "ok" : "err");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { name, phone, message, botcheck } = form;

    if (!WEB3FORMS_KEY) {
      const body = `Name: ${name.value}\nPhone: ${phone.value}\n\n${message.value}`;
      location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
      return;
    }

    submitBtn.disabled = true;
    say("Sending...", true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New website enquiry - Unique Engineering",
          from_name: "Unique Engineering website",
          name: name.value,
          phone: phone.value,
          message: message.value,
          botcheck: botcheck.checked,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      form.reset();
      say("Thank you! Your enquiry has been sent. We will contact you soon.", true);
    } catch {
      say("Sorry, something went wrong. Please call or email us directly.", false);
    }
    submitBtn.disabled = false;
  });
}

// 5. Scroll animation: fade-up reveal + count-up numbers ----------------------
// Skipped for visitors who prefer reduced motion.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js");

  const revealSelector = [
    ".section .title", ".pcard", ".about-row > *", ".facts > div", ".certs figure", ".certnote",
    ".cta h2", ".cta .btn", ".pcd", ".gallery a", ".qcard", ".marquee",
  ].join(",");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  $$(revealSelector).forEach((el) => {
    el.classList.add("reveal");
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", Math.min(siblings.indexOf(el), 5) * 0.1 + "s");
    revealObserver.observe(el);
  });

  // Count-up for the numbers in the stats strip (the year 2023 stays still)
  $$(".stats b").forEach((el) => {
    const text = el.textContent.trim();
    const match = text.match(/^([\d,]+)(\+?)$/);
    if (!match || text === "2023") return;
    const target = +match[1].replace(/,/g, "");
    const suffix = match[2];
    const grouped = match[1].includes(",");
    el.textContent = "0";

    new IntersectionObserver((entries, observer) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1400, 1);
        const value = Math.round(target * (1 - (1 - t) ** 3));
        el.textContent = (grouped ? value.toLocaleString("en-US") : value) + (t === 1 ? suffix : "");
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 }).observe(el);
  });
}
