(function () {
  "use strict";

  const menuRoot = document.getElementById("menuRoot");
  const chipRow = document.getElementById("chipRow");
  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalImageWrap = document.getElementById("modalImageWrap");
  const modalName = document.getElementById("modalName");
  const modalPrice = document.getElementById("modalPrice");
  const modalClose = document.getElementById("modalClose");

  let activeCategory = "all";
  let searchTerm = "";

  const currency = new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /* ---------- ไอคอน SVG ใช้ซ้ำ ---------- */
  function iconZoom() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
  }

  function sectionMark() {
    return `
      <svg viewBox="0 0 108 64" aria-hidden="true">
        <line class="rays" x1="30" y1="6" x2="30" y2="16"/>
        <line class="rays" x1="54" y1="2" x2="54" y2="14"/>
        <line class="rays" x1="78" y1="6" x2="78" y2="16"/>
        <circle class="disc" cx="54" cy="40" r="22" clip-path="url(#horizonClip)"/>
        <line class="horizon" x1="0" y1="40" x2="108" y2="40"/>
      </svg>
    `;
  }

  /* ---------- สร้าง chip กรองหมวดหมู่ ---------- */
 function buildChips() {
    const allChip = document.createElement("button");
    allChip.className = "chip is-active";
    allChip.type = "button";
    allChip.dataset.category = "all";
    allChip.textContent = "ทั้งหมด";
    chipRow.appendChild(allChip);

    MENU_CATEGORIES.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.type = "button";
      chip.dataset.category = cat.id;
      chip.textContent = cat.short;
      chipRow.appendChild(chip);
    });

    chipRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;

      activeCategory = chip.dataset.category;
      chipRow
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.toggle("is-active", c === chip));

      // 1. เรนเดอร์เมนูตามหมวดที่เลือก
      render();

      // 2. 🟢 สั่งให้หน้าจอเลื่อนไปที่ส่วนหัวหมวดหมู่ (menu-section__header)
      if (activeCategory === "all") {
        // หากกด "ทั้งหมด" ให้เด้งไปที่หมวดหมู่แรกที่เจอ
        const firstSection = menuRoot.querySelector(".menu-section");
        if (firstSection) {
          scrollToHeader(firstSection);
        }
      } else {
        // หากเลือกหมวดหมู่เฉพาะ ให้เด้งไปที่หมวดหมู่นั้นๆ
        const targetSection = document.getElementById(`cat-${activeCategory}`);
        if (targetSection) {
          scrollToHeader(targetSection);
        }
      }
    });
  }

  // 💡 ฟังก์ชันช่วยเลื่อนหน้าจอไปยังตำแหน่ง Header ของ Section แบบนุ่มนวล
  function scrollToHeader(sectionEl) {
    const headerEl = sectionEl.querySelector(".menu-section__header") || sectionEl;
    
    // คำนวณระยะติดขอบบน (Offset) หลบแถบ Control bar / Sticky bar ด้านบน
    const controlBar = document.querySelector(".control-bar");
    const offset = controlBar ? controlBar.offsetHeight + 10 : 70;

    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = headerEl.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

  /* ---------- สร้างการ์ดเมนูหนึ่งใบ ---------- */
function buildCard(item) {
  const card = document.createElement("article");
  card.className = "menu-card";

  // สร้างปุ่มกรอบรูปเฉพาะกรณีที่มี item.img
  if (item.img) {
    const imgBtn = document.createElement("button");
    imgBtn.type = "button";
    imgBtn.className = "menu-card__image";
    imgBtn.setAttribute("aria-label", `ดูรูป ${item.name}`);
    imgBtn.innerHTML = `
      <img src="${item.img}" alt="${item.name}" loading="lazy"
           onerror="this.closest('.menu-card').classList.add('menu-card--no-image'); this.closest('.menu-card__image').remove();" />
      <span class="menu-card__zoom">${iconZoom()}</span>
    `;

    imgBtn.addEventListener("click", () => openModal(item));
    card.appendChild(imgBtn);
  } else {
    // 💡 เพิ่ม class สำหรับการ์ดที่ไม่มีรูป
    card.classList.add("menu-card--no-image");
  }

  const body = document.createElement("div");
  body.className = "menu-card__body";
  body.innerHTML = `
    ${
      item.spicy
        ? `<span class="menu-card__spicy">🌶 เผ็ด</span>`
        : ""
    }
    <p class="menu-card__name">${item.name}</p>
    <span class="menu-card__price">${currency.format(item.price)} ฿</span>
  `;

  card.appendChild(body);
  return card;
}

  /* ---------- filter + render หมวดหมู่ทั้งหมด ---------- */
  function render() {
    menuRoot.innerHTML = "";
    let totalMatches = 0;
    const term = searchTerm.trim().toLowerCase();

    MENU_CATEGORIES.forEach((cat) => {
      if (activeCategory !== "all" && activeCategory !== cat.id) return;

      const items = MENU_ITEMS.filter(
        (item) =>
          item.category === cat.id &&
          (term === "" || item.name.toLowerCase().includes(term))
      );

      if (items.length === 0) return;
      totalMatches += items.length;

      const section = document.createElement("section");
      section.className = "menu-section";
      section.id = `cat-${cat.id}`;

      section.innerHTML = `
        <div class="menu-section__header">
          ${sectionMark()}
          <h2 class="menu-section__title">${cat.label}</h2>
          <div class="menu-section__line"></div>
        </div>
      `;

      const grid = document.createElement("div");
      grid.className = "menu-grid";
      items.forEach((item) => grid.appendChild(buildCard(item)));
      section.appendChild(grid);

      menuRoot.appendChild(section);
    });

    emptyState.classList.toggle("is-visible", totalMatches === 0);
  }

  /* ---------- Modal ดูรูปใหญ่ ---------- */
  function openModal(item) {
    modalName.textContent = item.name;
    modalPrice.textContent = `${currency.format(item.price)} ฿`;

    if (item.img) {
      modalImageWrap.style.display = "";
      modalImageWrap.innerHTML = `
        <img src="${item.img}" alt="${item.name}"
             onerror="this.closest('.modal-box__image, #modalImageWrap').style.display='none'" />
      `;
    } else {
      modalImageWrap.style.display = "none";
      modalImageWrap.innerHTML = "";
    }

    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- ค้นหา ---------- */
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });

  /* ---------- ปุ่มเลื่อนขึ้นบน ---------- */
  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- init ---------- */
  buildChips();
  render();
})();