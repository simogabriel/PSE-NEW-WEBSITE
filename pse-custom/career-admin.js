(function () {
  "use strict";
  var tokenInput = document.getElementById("admin-token");
  var status = document.getElementById("admin-status");
  var editor = document.querySelector(".career-admin__editor");
  var form = document.getElementById("opportunity-form");
  var list = document.getElementById("admin-list");
  var roles = [];
  var token = "";
  var editingId = null;

  function request(path, options) {
    options = options || {};
    options.headers = Object.assign({}, options.headers || {}, { Authorization: "Bearer " + token });
    return fetch(path, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) throw new Error(body.error || "Request failed (" + response.status + ")");
        return body;
      });
    });
  }
  function renderList() {
    list.textContent = "";
    if (!roles.length) {
      var empty = document.createElement("p");
      empty.textContent = "No open listings yet.";
      list.appendChild(empty);
      return;
    }
    roles.forEach(function (role) {
      var item = document.createElement("article");
      item.className = "career-admin__role";
      var title = document.createElement("strong");
      title.textContent = role.title.en + " / " + role.title.fr;
      var detail = document.createElement("span");
      detail.textContent = role.location + " · " + role.id;
      var actions = document.createElement("div");
      actions.className = "career-admin__role-actions";
      var edit = document.createElement("button");
      edit.type = "button"; edit.textContent = "Edit";
      edit.addEventListener("click", function () { editRole(role); });
      var remove = document.createElement("button");
      remove.type = "button"; remove.className = "is-secondary"; remove.textContent = "Close";
      remove.addEventListener("click", function () {
        roles = roles.filter(function (candidate) { return candidate.id !== role.id; });
        renderList();
        status.textContent = "Position removed from the draft. Publish changes to close it publicly.";
      });
      actions.appendChild(edit); actions.appendChild(remove);
      item.appendChild(title); item.appendChild(detail); item.appendChild(actions); list.appendChild(item);
    });
  }
  function editRole(role) {
    editingId = role.id;
    form.elements.id.value = role.id;
    form.elements.titleEn.value = role.title.en;
    form.elements.titleFr.value = role.title.fr;
    form.elements.location.value = role.location;
    form.elements.typeEn.value = role.type.en;
    form.elements.typeFr.value = role.type.fr;
    form.elements.summaryEn.value = role.summary.en;
    form.elements.summaryFr.value = role.summary.fr;
    form.elements.closingDate.value = role.closingDate || "";
    form.elements.applyUrl.value = role.applyUrl || "";
    form.elements.id.disabled = true;
    document.getElementById("form-heading").textContent = "Edit position";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function clearForm() {
    editingId = null;
    form.reset();
    form.elements.id.disabled = false;
    document.getElementById("form-heading").textContent = "Add a position";
  }
  document.getElementById("admin-load").addEventListener("click", function () {
    token = tokenInput.value.trim();
    status.textContent = "Loading saved listings...";
    request("/api/admin/opportunities").then(function (data) {
      roles = Array.isArray(data) ? data : [];
      editor.hidden = false;
      status.textContent = "Listings loaded.";
      renderList();
    }).catch(function (error) { status.textContent = error.message; });
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var f = form.elements;
    var role = {
      id: editingId || f.id.value.trim(),
      title: { en: f.titleEn.value.trim(), fr: f.titleFr.value.trim() },
      location: f.location.value.trim(),
      type: { en: f.typeEn.value.trim(), fr: f.typeFr.value.trim() },
      summary: { en: f.summaryEn.value.trim(), fr: f.summaryFr.value.trim() },
      posted: new Date().toISOString().slice(0, 10),
      closingDate: f.closingDate.value || "",
      applyUrl: f.applyUrl.value.trim() || "mailto:info@pse-consulting.com?subject=Job%20application"
    };
    var index = roles.findIndex(function (candidate) { return candidate.id === role.id; });
    if (index >= 0) roles[index] = role; else roles.unshift(role);
    clearForm();
    renderList();
    status.textContent = "Draft saved locally. Select Publish changes to make it public.";
  });
  document.getElementById("form-cancel").addEventListener("click", clearForm);
  document.getElementById("admin-publish").addEventListener("click", function (event) {
    var button = event.currentTarget;
    button.disabled = true;
    status.textContent = "Publishing listings...";
    request("/api/admin/opportunities", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ opportunities: roles }) })
      .then(function (result) { status.textContent = "Published " + result.count + " position(s). Push alerts sent: " + result.notificationsSent + "."; })
      .catch(function (error) { status.textContent = error.message; })
      .finally(function () { button.disabled = false; });
  });
})();
