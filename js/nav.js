// nav.js — mobile nav toggle, dark mode toggle, mobile tab bar theme icon,
// and scroll-to-top button. Plain browser JavaScript, no build step required.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initThemeToggle();
    initScrollTop();
  });

  function initMobileNav() {
    var toggleBtn = document.getElementById("nav-toggle");
    var mobileMenu = document.getElementById("nav-mobile");
    if (!toggleBtn || !mobileMenu) return;

    toggleBtn.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the mobile menu whenever a nav link inside it is clicked.
    var links = mobileMenu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    }
  }

  function initThemeToggle() {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!buttons.length) return;

    var stored = window.localStorage.getItem("theme");
    var isDark = stored === "dark";
    applyTheme(isDark);

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var next = !document.documentElement.classList.contains("dark");
        applyTheme(next);
        window.localStorage.setItem("theme", next ? "dark" : "light");
      });
    }

    function applyTheme(dark) {
      document.documentElement.classList.toggle("dark", dark);
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        // The bottom tab-bar toggle is icon + label spans, not plain text —
        // update those in place instead of clobbering the markup.
        var icon = btn.querySelector(".tabbar-icon");
        if (icon) {
          icon.textContent = dark ? "\u2600\uFE0F" : "\uD83C\uDF19";
        } else {
          btn.textContent = dark ? "\u2600\uFE0F Light Mode" : "\uD83C\uDF19 Dark Mode";
        }
      }
    }
  }

  function initScrollTop() {
    var btn = document.getElementById("scroll-top-btn");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 500) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
