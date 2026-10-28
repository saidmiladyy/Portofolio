// 1. Buka dan tutup navigasi pada ponsel.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigasi");
const navigationLinks = navigation.querySelectorAll("a");
navigation.classList.add("collapsible");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", function () {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigationLinks.forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});

// 2. Tampilkan tahun saat ini secara otomatis.
document.querySelector("#tahun").textContent = new Date().getFullYear();

// 3. Munculkan bagian halaman saat masuk ke layar.
// Tanpa dukungan observer atau tanpa JavaScript, konten tetap terlihat.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window) {
  if (!reducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    document.querySelectorAll(".reveal").forEach(function (section) {
      section.classList.add("ready");
      revealObserver.observe(section);
    });
  }

  // 4. Tandai menu sesuai bagian yang sedang dibaca.
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navigationLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", isActive);
            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );

  document.querySelectorAll("main section[id]").forEach(function (section) {
    sectionObserver.observe(section);
  });
}
