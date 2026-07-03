(function () {
  var toggle = document.getElementById('nav-toggle')
  var links = document.querySelector('.nav-links')
  var overlay = document.getElementById('nav-overlay')
  if (!toggle || !links) return

  function open() {
    links.classList.add('open')
    toggle.classList.add('open')
    document.body.classList.add('nav-open')
    if (overlay) overlay.classList.add('open')
  }

  function close() {
    links.classList.remove('open')
    toggle.classList.remove('open')
    document.body.classList.remove('nav-open')
    if (overlay) overlay.classList.remove('open')
  }

  toggle.addEventListener('click', function () {
    if (links.classList.contains('open')) {
      close()
    } else {
      open()
    }
  })

  links.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', close)
  })

  if (overlay) overlay.addEventListener('click', close)
})()
