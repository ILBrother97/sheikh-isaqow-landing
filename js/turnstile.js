(function () {
  'use strict'

  var SITE_KEY = '0x4AAAAAADvNKhHFHsBkKVNU'

  if (sessionStorage.getItem('turnstile_passed')) {
    return
  }

  var overlay, revealed = false

  function buildOverlay() {
    overlay = document.createElement('div')
    overlay.id = 'turnstile-overlay'
    overlay.innerHTML =
      '<div class="turnstile-card">' +
        '<img src="assets/images/logo-no-circle-min.webp" alt="" class="turnstile-logo">' +
        '<h2 class="turnstile-title">Performing security verification...</h2>' +
        '<p class="turnstile-subtitle">This website uses a security service to protect against bots.</p>' +
        '<div class="turnstile-spinner"><div class="turnstile-ring"></div></div>' +
        '<div id="cf-turnstile-widget" class="turnstile-widget"></div>' +
      '</div>'
    document.body.appendChild(overlay)
  }

  function reveal() {
    if (revealed) return
    revealed = true
    overlay.classList.add('turnstile-overlay--hidden')
    sessionStorage.setItem('turnstile_passed', 'true')
    setTimeout(function () {
      overlay.style.display = 'none'
    }, 600)
  }

  function initWidget() {
    if (window.turnstile) {
      turnstile.render('#cf-turnstile-widget', {
        sitekey: SITE_KEY,
        callback: function (token) {
          sessionStorage.setItem('turnstile_token', token)
          reveal()
        }
      })
    } else {
      setTimeout(initWidget, 200)
    }
  }

  buildOverlay()

  setTimeout(function () {
    if (!revealed) reveal()
  }, 15000)

  initWidget()
})()
