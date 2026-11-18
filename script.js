(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var root = document.documentElement, themeBtn = $("#theme-btn");
  themeBtn.addEventListener("click", function () {
    var dark = root.dataset.theme !== "dark";
    root.dataset.theme = dark ? "dark" : "light";
    themeBtn.textContent = dark ? "Modo claro" : "Modo escuro";
  });
  $("#menu-btn").addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
  $("#sidebar").addEventListener("click", function (e) { if (e.target.tagName === "A") document.body.classList.remove("nav-open"); });

  var sections = Array.prototype.slice.call(document.querySelectorAll(".tbl"));
  var links = Array.prototype.slice.call(document.querySelectorAll("#sidebar li"));
  $("#search").addEventListener("input", function (e) {
    var q = e.target.value.trim().toLowerCase(), visible = 0;
    sections.forEach(function (s, i) {
      var nameHit = !q || s.dataset.name.indexOf(q) > -1, any = false;
      s.querySelectorAll("tbody tr").forEach(function (r) {
        var show = nameHit || r.textContent.toLowerCase().indexOf(q) > -1;
        r.hidden = !show; if (show) any = true;
      });
      s.hidden = !any; links[i].hidden = !any; if (any) visible++;
    });
    $("#empty").hidden = visible > 0;
  });

  var modals = { der: $("#der-modal"), ddl: $("#ddl-modal") }, pz = null;
  function open(m) { m.hidden = false; document.body.classList.add("lock"); }
  function closeAll() { Object.keys(modals).forEach(function (k) { modals[k].hidden = true; }); document.body.classList.remove("lock"); }
  document.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeAll); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  $("#open-der").addEventListener("click", function () {
    open(modals.der);
    var img = $("#der-img"), stage = $("#der-stage");
    if (!pz && window.Panzoom) {
      pz = window.Panzoom(img, { maxScale: 12, minScale: 0.3, canvas: true });
      stage.addEventListener("wheel", pz.zoomWithWheel);
    }
    if (pz) pz.reset({ animate: false });
  });
  $("#z-in").addEventListener("click", function () { if (pz) pz.zoomIn(); });
  $("#z-out").addEventListener("click", function () { if (pz) pz.zoomOut(); });
  $("#z-reset").addEventListener("click", function () { if (pz) pz.reset(); });

  $("#open-ddl").addEventListener("click", function () { open(modals.ddl); });
  $("#copy-ddl").addEventListener("click", function () {
    var btn = this, text = $("#ddl-code").textContent;
    function done() { btn.textContent = "Copiado!"; setTimeout(function () { btn.textContent = "Copiar DDL"; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done); }
    else { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); done(); }
  });
})();
