(function () {
  var toggle = document.getElementById('nav-toggle')
  var links = document.querySelector('.nav-links')
  if (!toggle || !links) return

  function open() {
    links.classList.add('open')
    toggle.classList.add('open')
  }

  function close() {
    links.classList.remove('open')
    toggle.classList.remove('open')
  }

  toggle.addEventListener('click', function () {
    if (links.classList.contains('open')) {
      close()
    } else {
      open()
    }
  })

  links.querySelectorAll('.nav-link, .nav-btn').forEach(function (link) {
    link.addEventListener('click', close)
  })
})()
