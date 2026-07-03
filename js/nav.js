(function () {
  var toggle = document.getElementById('nav-toggle')
  var links = document.querySelector('.nav-links')
  if (!toggle || !links) return

  toggle.addEventListener('click', function () {
    links.classList.toggle('open')
    toggle.classList.toggle('open')
    document.body.classList.toggle('nav-open')
  })

  links.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open')
      toggle.classList.remove('open')
      document.body.classList.remove('nav-open')
    })
  })
})()
