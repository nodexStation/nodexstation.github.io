(function () {
  "use strict";

  // Footer year — always current
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navigation
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // FAQ accordion
  var questions = document.querySelectorAll(".faq-q");
  questions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      // Close all others for a clean single-open accordion
      questions.forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        var panel = document.getElementById(other.getAttribute("aria-controls"));
        if (panel) panel.hidden = true;
      });
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        var target = document.getElementById(btn.getAttribute("aria-controls"));
        if (target) target.hidden = false;
      }
    });
  });

  // Contact form — validation, then compose a real email via mailto:
  var form = document.getElementById("contactForm");
  if (form) {
    var nameInput = document.getElementById("cf-name");
    var emailInput = document.getElementById("cf-email");
    var messageInput = document.getElementById("cf-message");
    var note = document.getElementById("formNote");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setValidity(input, errId, valid) {
      var err = document.getElementById(errId);
      if (err) err.hidden = valid;
      input.setAttribute("aria-invalid", valid ? "false" : "true");
      return valid;
    }
    function validateName() { return setValidity(nameInput, "err-name", nameInput.value.trim().length >= 2); }
    function validateEmail() { return setValidity(emailInput, "err-email", emailPattern.test(emailInput.value.trim())); }
    function validateMessage() { return setValidity(messageInput, "err-message", messageInput.value.trim().length >= 10); }

    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    messageInput.addEventListener("blur", validateMessage);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var okName = validateName();
      var okEmail = validateEmail();
      var okMessage = validateMessage();
      if (!okName || !okEmail || !okMessage) {
        var firstBad = !okName ? nameInput : (!okEmail ? emailInput : messageInput);
        firstBad.focus();
        if (note) note.hidden = true;
        return;
      }
      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var message = messageInput.value.trim();
      var subject = encodeURIComponent("Project enquiry from " + name + " — NodeX Station website");
      var body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + message + "\n"
      );
      if (note) note.hidden = false;
      window.location.href = "mailto:nodexstation@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
})();
