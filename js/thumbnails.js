// thumbnails.js — watermarking canvas, currency converter, and lightbox preview
// for the Thumbnails & Commissions page. Plain browser JavaScript.

(function () {
  "use strict";

  var BASE_PRICES = { essential: 9.99, signature: 14.99 };

  var CURRENCIES = {
    USD: { symbol: "$", rate: 1, decimals: 2 },
    EUR: { symbol: "\u20AC", rate: 0.92, decimals: 2 },
    GBP: { symbol: "\u00A3", rate: 0.79, decimals: 2 },
    CAD: { symbol: "C$", rate: 1.36, decimals: 2 },
    AUD: { symbol: "A$", rate: 1.53, decimals: 2 },
    JPY: { symbol: "\u00A5", rate: 149.5, decimals: 0 },
    BRL: { symbol: "R$", rate: 4.97, decimals: 2 },
    INR: { symbol: "\u20B9", rate: 83.1, decimals: 0 },
    MXN: { symbol: "MX$", rate: 17.28, decimals: 2 },
    KRW: { symbol: "\u20A9", rate: 1325, decimals: 0 },
  };

  document.addEventListener("DOMContentLoaded", function () {
    initWatermarks();
    initCurrencyPicker();
    initLightbox();
  });

  // ---- Watermarking ----

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawWatermarked(img, canvas) {
    var width = (canvas.width = img.naturalWidth || 1280);
    var height = (canvas.height = img.naturalHeight || 720);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, width, height);

    var fontSize = Math.round(width * 0.042);
    ctx.save();
    ctx.font = '700 ' + fontSize + 'px "Comic Sans MS", cursive';
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var spacing = fontSize * 5;
    ctx.rotate(-Math.PI / 6);
    var diagonal = Math.sqrt(width * width + height * height);
    for (var x = -diagonal; x < diagonal * 2; x += spacing) {
      for (var y = -diagonal; y < diagonal * 2; y += spacing * 0.9) {
        ctx.fillText("S1lk08", x, y);
      }
    }
    ctx.restore();

    var badgeFontSize = Math.round(width * 0.025);
    var pad = Math.round(width * 0.012);
    var text = "Copyright S1lk08";
    ctx.save();
    ctx.font = '700 ' + badgeFontSize + 'px "Comic Sans MS", cursive';
    var badgeWidth = ctx.measureText(text).width + pad * 2.4;
    var badgeHeight = badgeFontSize + pad * 1.6;
    var badgeX = width - badgeWidth - pad;
    var badgeY = height - badgeHeight - pad;
    ctx.fillStyle = "rgba(0,0,0,0.52)";
    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 8);
    ctx.fill();
    ctx.fillStyle = "#00ff88";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
    ctx.restore();
  }

  function initWatermarks() {
    var canvases = document.querySelectorAll("canvas[data-thumb-src]");
    canvases.forEach(function (canvas) {
      var img = new Image();
      img.onload = function () {
        drawWatermarked(img, canvas);
      };
      img.src = canvas.getAttribute("data-thumb-src");
    });
  }

  // ---- Currency picker ----

  function formatPrice(usd, code) {
    var currency = CURRENCIES[code] || CURRENCIES.USD;
    return currency.symbol + (usd * currency.rate).toFixed(currency.decimals);
  }

  function initCurrencyPicker() {
    var select = document.getElementById("currency-select");
    if (!select) return;

    var priceEls = document.querySelectorAll("[data-price]");

    function update() {
      var code = select.value;
      priceEls.forEach(function (el) {
        var key = el.getAttribute("data-price");
        var base = BASE_PRICES[key];
        if (typeof base === "number") {
          el.textContent = formatPrice(base, code);
        }
      });
    }

    select.addEventListener("change", update);
    update();
  }

  // ---- Lightbox ----

  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-image");
    var closeBtn = document.getElementById("lightbox-close");
    if (!lightbox || !lightboxImg || !closeBtn) return;

    var openButtons = document.querySelectorAll(".thumb-card-btn");
    openButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var canvas = btn.querySelector("canvas");
        if (!canvas) return;
        lightboxImg.src = canvas.toDataURL();
        lightbox.classList.add("open");
      });
    });

    function close() {
      lightbox.classList.remove("open");
      lightboxImg.src = "";
    }

    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });
  }
})();
