/* NodeX AI Receptionist — live demo brain.
   Pure HTML/CSS/JS. No API keys, no backend, nothing leaves the browser.
   The demo clinic ("Bright Smile Dental — Norwich") is fictional.
   The brain is DOM-free so the conversation logic can be tested anywhere;
   the DOM glue at the bottom only runs when `document` exists. */
(function (root) {
  "use strict";

  var CLINIC = {
    name: "Bright Smile Dental",
    city: "Norwich",
    address: "24 Castle Meadow, Norwich NR1 3DH",
    hoursText: "Monday–Friday 8:30am–5:30pm, Saturday 9am–1pm, Sunday closed",
    hours: {
      // day: [openMinutes, closeMinutes] — null = closed
      0: null,               // Sunday
      1: [510, 1050],        // Monday    8:30–17:30
      2: [510, 1050],
      3: [510, 1050],
      4: [510, 1050],
      5: [510, 1050],
      6: [540, 780]          // Saturday  9:00–13:00
    },
    services: [
      { key: ["check-up", "checkup", "check up", "examination", "exam"], name: "Check-up & clean", price: "£55" },
      { key: ["hygien", "clean"], name: "Hygiene appointment", price: "£65" },
      { key: ["filling"], name: "White fillings", price: "from £95" },
      { key: ["whitening", "whiten"], name: "Teeth whitening", price: "£249" },
      { key: ["emergency", "urgent"], name: "Emergency appointment", price: "£75" },
      { key: ["child", "kid"], name: "Children's check-up", price: "£35" },
      { key: ["invisalign", "brace", "straighten"], name: "Invisalign consultation", price: "free" }
    ]
  };

  function isOpenAt(date) {
    var day = CLINIC.hours[date.getDay()];
    if (!day) return false;
    var mins = date.getHours() * 60 + date.getMinutes();
    return mins >= day[0] && mins < day[1];
  }

  function findService(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < CLINIC.services.length; i++) {
      var s = CLINIC.services[i];
      for (var j = 0; j < s.key.length; j++) {
        if (t.indexOf(s.key[j]) !== -1) return s;
      }
    }
    return null;
  }

  function servicesList() {
    var lines = CLINIC.services.map(function (s) {
      return "• " + s.name + " — " + s.price;
    });
    return "Here are our main services and prices:\n" + lines.join("\n") +
      "\n\nWant me to book any of these for you?";
  }

  function hoursAnswer(text) {
    var t = text.toLowerCase();
    if (/\bsaturday\b|\bsat\b/.test(t)) return "On Saturdays we're open 9am–1pm.";
    if (/\bsunday\b|\bsun\b/.test(t)) return "We're closed on Sundays. We're open Monday–Friday 8:30am–5:30pm and Saturday 9am–1pm.";
    if (/\b(friday|monday|tuesday|wednesday|thursday|weekday)\b/.test(t)) return "Monday to Friday we're open 8:30am–5:30pm.";
    if (/close|closing/.test(t)) return "We close at 5:30pm Monday–Friday, and at 1pm on Saturdays. We're closed on Sundays.";
    if (/open|opening|when/.test(t)) return "We're open " + CLINIC.hoursText + ".";
    return "We're open " + CLINIC.hoursText + ".";
  }

  function looksLikePhone(text) {
    var digits = text.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  function mentionsSunday(text) {
    return /\bsunday\b|\bsun\b/.test(text.toLowerCase());
  }

  function parseTimeOk(text) {
    var t = text.toLowerCase();
    if (/\b(morning|afternoon|evening|lunchtime|any time|anytime)\b/.test(t)) return true;
    if (/\b\d{1,2}(:\d{2})?\s*(am|pm)\b/.test(t)) return true;
    if (/\b([01]?\d|2[0-3]):[0-5]\d\b/.test(t)) return true;
    return false;
  }

  function isYes(text) {
    return /^(yes|yeah|yep|yup|sure|ok|okay|please|confirm|correct|that's right|that is right|perfect|sounds good)\b/.test(text.toLowerCase().trim());
  }

  function isNo(text) {
    return /^(no|nope|nah|not|never mind|cancel|stop)\b/.test(text.toLowerCase().trim());
  }

  function createBrain(options) {
    options = options || {};
    var nowFn = options.now || function () { return new Date(); };
    var afterHoursOverride = null; // null = auto from clock, true = force closed
    var flow = null;               // null | "booking" | "message"
    var step = null;
    var data = {};
    var pendingOffer = null;       // "booking" when the bot just offered to book

    function isOpen() {
      if (afterHoursOverride === true) return false;
      return isOpenAt(nowFn());
    }

    function greeting() {
      if (isOpen()) {
        return "Hi, welcome to " + CLINIC.name + "! I'm the receptionist — I can answer questions about our services and prices, book you an appointment, or take a message for the team. How can I help?";
      }
      return "Hi, welcome to " + CLINIC.name + "! We're closed right now (open " + CLINIC.hoursText + "), but I can still help — I can answer questions, take a booking request, or take a message for the team. How can I help?";
    }

    function startBooking(service) {
      flow = "booking";
      step = "name";
      data = { service: service ? service.name : null };
      return ["Great — I can book that for you. What name should I put the appointment under?"];
    }

    function startMessage(reason) {
      flow = "message";
      step = "name";
      data = {};
      var intro = reason === "busy"
        ? "The dentist is with a patient right now, but I can take a message and the team will get back to you. What's your name?"
        : "Of course — I'll take a message for the team. What's your name?";
      return [intro];
    }

    function bookingSummary() {
      var lines = [
        "Here's your booking request:",
        "• Name: " + data.name,
        "• Phone: " + data.phone,
        "• Day: " + data.day,
        "• Time: " + data.time
      ];
      if (data.service) lines.splice(1, 0, "• For: " + data.service);
      lines.push("", "Shall I confirm this booking?");
      return lines.join("\n");
    }

    function handleBooking(text) {
      var t = text.trim();
      if (step === "name") {
        if (t.length < 2) return ["Could you tell me your full name, so we know who the appointment is for?"];
        data.name = t;
        step = "phone";
        return ["Thanks, " + data.name.split(" ")[0] + ". What's the best phone number to reach you on?"];
      }
      if (step === "phone") {
        if (!looksLikePhone(t)) return ["That doesn't look like a phone number — could you check it and try again? A mobile number is fine."];
        data.phone = t;
        step = "day";
        return ["Thanks. Which day suits you best? We're open Monday–Friday and Saturday mornings (closed Sundays)."];
      }
      if (step === "day") {
        if (mentionsSunday(t)) return ["We're closed on Sundays, I'm afraid — would another day work for you?"];
        data.day = t;
        step = "time";
        return ["And what time on " + data.day + " would suit you — for example 10am, or just “morning” or “afternoon”?"];
      }
      if (step === "time") {
        if (!parseTimeOk(t)) return ["I didn't quite catch a time there — could you give me one like 10:30am, 2pm, or just “morning” or “afternoon”?"];
        data.time = t;
        step = "confirm";
        return [bookingSummary()];
      }
      if (step === "confirm") {
        if (isYes(t)) {
          var open = isOpen();
          flow = null; step = null;
          var done = "Done — your booking request is confirmed.\n\n" +
            "• " + (data.service ? data.service + " — " : "") + data.day + ", " + data.time + "\n" +
            "• Name: " + data.name + " · Phone: " + data.phone + "\n\n" +
            (open
              ? "The team will call you shortly to confirm. Is there anything else I can help with?"
              : "We're closed right now, so the team will call you first thing when we're back open to confirm. Is there anything else I can help with?");
          data = {};
          return [done];
        }
        if (isNo(t)) {
          flow = null; step = null; data = {};
          return ["No problem — the booking isn't confirmed. Would you like to start a new booking, or is there something else I can help with?"];
        }
        return ["Just to check — shall I confirm this booking? A quick “yes” or “no” is fine."];
      }
      flow = null; step = null;
      return ["Let's start over — how can I help?"];
    }

    function handleMessage(text) {
      var t = text.trim();
      if (step === "name") {
        if (t.length < 2) return ["Could you tell me your name, so the team knows who the message is from?"];
        data.name = t;
        step = "text";
        return ["Thanks, " + data.name.split(" ")[0] + ". What's the message?"];
      }
      if (step === "text") {
        if (t.length < 3) return ["Could you tell me a little more, so the team knows what it's about?"];
        data.text = t;
        step = "confirm";
        return ["Here's the message I'll pass on:\n\n“" + data.text + "” — " + data.name + "\n\nShall I send it?"];
      }
      if (step === "confirm") {
        if (isYes(t)) {
          flow = null; step = null; data = {};
          return ["Message sent — the team will get back to you as soon as they can. Is there anything else I can help with?"];
        }
        if (isNo(t)) {
          step = "text";
          return ["No problem — what would you like the message to say instead?"];
        }
        return ["Just to check — shall I send that message? A quick “yes” or “no” is fine."];
      }
      flow = null; step = null;
      return ["Let's start over — how can I help?"];
    }

    function respond(rawText) {
      var text = (rawText || "").trim();
      if (!text) return [];
      var t = text.toLowerCase();

      // Cancel / restart inside a flow
      if (flow && /\b(cancel|stop|start over|restart|never mind|forget it)\b/.test(t)) {
        flow = null; step = null; data = {};
        return ["No problem — let's start fresh. How can I help?"];
      }
      if (flow === "booking") return handleBooking(text);
      if (flow === "message") return handleMessage(text);

      // Answering a just-made offer ("shall I book you in?" → "yes")
      if (pendingOffer === "booking") {
        if (isYes(t)) { pendingOffer = null; return startBooking(null); }
        if (isNo(t)) { pendingOffer = null; return ["No problem — is there anything else I can help with?"]; }
        pendingOffer = null;
      }

      // Emergency first — it outranks everything else
      if (/\b(emergency|toothache|tooth ache|pain|hurts|hurting|broken tooth|chipped tooth|swollen|bleeding|abscess)\b/.test(t)) {
        var replies = ["I'm sorry to hear that — let's get you seen quickly. We keep same-day emergency appointments (£75)."];
        if (isOpen()) {
          replies.push("I can book you an emergency appointment now — shall I?");
        } else {
          replies.push("We're closed right now, so if you're in severe pain or have swelling, please call NHS 111 for urgent advice. I can still book you an emergency appointment for when we're next open — shall I?");
        }
        pendingOffer = "booking";
        return replies;
      }

      // Booking
      if (/\b(book|booking|appointment|reserve|see (a|the) dentist|check-up|checkup)\b/.test(t)) {
        return startBooking(findService(text));
      }

      // Message / speak to someone / dentist busy
      if (/\b(message|leave (a )?note|call me back|call back|speak to (someone|a person|a human|the dentist)|talk to (someone|a person|a human|the dentist)|real person|human)\b/.test(t)) {
        return startMessage(/\b(dentist|someone|person|human)\b/.test(t) ? "busy" : null);
      }

      // Prices — specific service first, then the full list
      if (/\b(price|pricing|cost|how much|charge|fee|fees)\b/.test(t) || /\bwhat.*(cost|charge)\b/.test(t)) {
        var svc = findService(text);
        if (svc) {
          pendingOffer = "booking";
          return ["Our " + svc.name + " is " + svc.price + ". Would you like me to book one for you, or see the full price list?"];
        }
        pendingOffer = "booking";
        return [servicesList()];
      }

      // Services
      if (/\b(service|services|treatment|treatments|offer|do you do|what do you)\b/.test(t)) {
        pendingOffer = "booking";
        return [servicesList()];
      }

      // Hours
      if (/\b(open|opening|close|closing|hours|when are you|what time)\b/.test(t)) {
        var open = isOpen();
        return [hoursAnswer(text) + (open ? " We're open right now — how can I help?" : " We're closed at the moment, but I can still take a booking or a message for you.")];
      }

      // Location
      if (/\b(where|location|address|directions|find you|parking|park)\b/.test(t)) {
        pendingOffer = "booking";
        return ["You'll find us at " + CLINIC.address + ", in the city centre near the Castle. There's public parking nearby on Castle Meadow. Would you like to book an appointment while you're here?"];
      }

      // Greeting
      if (/^(hi|hello|hey|good (morning|afternoon|evening)|hiya)\b/.test(t)) {
        return [greeting()];
      }

      // Thanks
      if (/\b(thank|thanks|cheers)\b/.test(t)) {
        return ["You're welcome! Is there anything else I can help with?"];
      }

      // Goodbye
      if (/\b(bye|goodbye|see you|that's all|nothing else)\b/.test(t)) {
        return ["Thanks for getting in touch — take care, and we hope to see you at " + CLINIC.name + " soon!"];
      }

      // Fallback — never invents an answer
      return ["I don't have the answer to that one — I only know about our services, prices, opening hours and bookings. Would you like to leave a message for the team, or shall I show you our services and prices?"];
    }

    return {
      clinic: CLINIC,
      greeting: greeting,
      isOpen: isOpen,
      isOpenAt: isOpenAt,
      respond: respond,
      setAfterHours: function (on) { afterHoursOverride = on ? true : null; },
      reset: function () { flow = null; step = null; data = {}; pendingOffer = null; }
    };
  }

  // Expose the brain for testing and for the page glue.
  root.ReceptionistBrain = { create: createBrain };

  /* ── DOM glue (browser only) ─────────────────────────────────────── */
  if (typeof document === "undefined") return;

  var brain = createBrain();
  var log = document.getElementById("chatLog");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var statusDot = document.getElementById("statusDot");
  var statusText = document.getElementById("statusText");
  var toggle = document.getElementById("afterHoursToggle");
  var resetBtn = document.getElementById("resetBtn");

  function updateStatus() {
    var open = brain.isOpen();
    statusDot.classList.toggle("closed", !open);
    statusText.textContent = open
      ? "Open now · replies instantly"
      : "Closed now · still answering & taking bookings";
  }

  function addMsg(text, who) {
    var div = document.createElement("div");
    div.className = "msg " + who;
    var label = document.createElement("span");
    label.className = "msg-label";
    label.textContent = who === "bot" ? "Bright Smile Dental" : "You";
    div.appendChild(label);
    div.appendChild(document.createTextNode(text));
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function botSay(replies) {
    var i = 0;
    function next() {
      if (i >= replies.length) return;
      var typing = document.createElement("div");
      typing.className = "msg bot typing";
      typing.textContent = "Typing…";
      log.appendChild(typing);
      log.scrollTop = log.scrollHeight;
      var reply = replies[i];
      i++;
      setTimeout(function () {
        typing.remove();
        addMsg(reply, "bot");
        setTimeout(next, 350);
      }, 550 + Math.min(reply.length * 6, 900));
    }
    next();
  }

  function userSay(text) {
    addMsg(text, "user");
    var replies = brain.respond(text);
    if (replies.length) botSay(replies);
  }

  function boot() {
    log.innerHTML = "";
    brain.reset();
    updateStatus();
    setTimeout(function () { botSay([brain.greeting()]); }, 400);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    userSay(text);
    input.focus();
  });

  document.querySelectorAll("[data-q]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      userSay(btn.getAttribute("data-q"));
      input.focus();
    });
  });

  toggle.addEventListener("change", function () {
    brain.setAfterHours(toggle.checked);
    brain.reset();
    log.innerHTML = "";
    updateStatus();
    botSay([brain.greeting()]);
  });

  resetBtn.addEventListener("click", function () {
    toggle.checked = false;
    brain.setAfterHours(false);
    boot();
  });

  boot();
})(typeof window !== "undefined" ? window : this);

// Node export for testing the conversation logic.
if (typeof module !== "undefined" && module.exports) {
  module.exports = this.ReceptionistBrain || (typeof window !== "undefined" && window.ReceptionistBrain);
}
