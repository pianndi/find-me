const light = {
  x: null,
  y: null,
  size: 300
}
const rains = [
  {
    x: 200,
    y: 0,
    size: 20
  }]
const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
}
resizeCanvas()
rains.push(...Array(20).fill(0).map(() => ({
  x: random(0, canvas.width),
  y: random(0, canvas.height),
  size: random(10, 20)
})))
window.addEventListener('resize', resizeCanvas)
function random(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}
let rainCooldown = 0
let lastTime = performance.now()
function draw() {
  const currentTime = performance.now()
  const deltaTime = currentTime - lastTime
  lastTime = currentTime
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  rains.forEach((rain, i) => {
    ctx.beginPath()
    rain.y += 1 * (deltaTime / 20)
    ctx.moveTo(rain.x, rain.y)
    ctx.lineTo(rain.x, rain.y - rain.size)
    ctx.stroke()
    if (rain.y > canvas.height) {
      rains.splice(i, 1)
    }
  })
  rainCooldown += deltaTime
  if (rainCooldown > 400 * (800 / canvas.width)) {
    rains.push({
      x: random(0, canvas.width),
      y: 0,
      size: random(10, 20)
    })
    rainCooldown = 0
  }
  if (light.x !== null || light.y !== null) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter';
    const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.size)
    gradient.addColorStop(0, 'rgba(255,255,0,0.1)')
    gradient.addColorStop(1, 'rgba(255,255,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

  }
  requestAnimationFrame(draw)
}
draw()
window.addEventListener('mousemove', (e) => {
  const x = e.clientX
  const y = e.clientY
  light.x = x
  light.y = y
})
document.querySelectorAll('#socials a,.btn:has(.hidden)').forEach(el => {
  tippy(el, {
    content: el.querySelector('.hidden').innerText,
    theme: 'dark',
    placement: 'top',
    arrow: true,
    delay: [0, 100],
    duration: [200, 100],
    animation: 'scale',
    trigger: 'mouseenter focus',
    onShow(instance) {
      instance.setProps({ delay: [0, 0] })
    },
    onHide(instance) {
      instance.setProps({ delay: [0, 100] })
    }
  })
})
function copy_link() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      document.getElementById('copy_button').innerHTML = '<i class="fa-solid fa-check"></i>'
      document.querySelector('#copy_button + span').innerText = 'Tautan disalin!'
      setTimeout(() => {
        document.getElementById('copy_button').innerHTML = '<i class="fa-solid fa-link"></i>'
        document.querySelector('#copy_button + span').innerText = 'Salin Tautan'
      }, 1000)
    }).catch(err => {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-end',
        title: 'Gagal menyalin!',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 1500
      })
    })
  } else {
    const tempInput = document.createElement('input')
    tempInput.value = window.location.href
    document.body.appendChild(tempInput)
    tempInput.select()
    try {
      document.execCommand('copy')
      document.getElementById('copy_button').innerHTML = '<i class="fa-solid fa-check"></i>'
      document.querySelector('#copy_button + span').innerText = 'Tautan disalin!'
      setTimeout(() => {
        document.getElementById('copy_button').innerHTML = '<i class="fa-solid fa-link"></i>'
        document.querySelector('#copy_button + span').innerText = 'Salin Tautan'
      }, 1000)
    } catch (err) {
      Swal.fire({
        toast: true,
        icon: 'error',
        position: 'top-end',
        title: 'Gagal menyalin!',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 1500
      })
    }
    document.body.removeChild(tempInput)
  }
}
if (!navigator?.share) {
  document.getElementById('share_button').style.display = 'none'
}
function share_another() {
  navigator.share({
    title: document.title,
    url: window.location.href
  })
    .then(() => {
      console.log('Berhasil dibagikan!')
    })
}
function changePicture() {
  PowerGlitch.glitch('#profile', {
    playMode: 'manual',
    timing: {
      duration: random(500, 1000)
    }

  }).startGlitch()
  let gambar = './images/alviandi-profile-picture.webp'
  let gambarEl = document.querySelector('#profile img')
  gambarEl.src = gambar == gambarEl.src ? './images/pian-badut.webp' : gambar
  setTimeout(changePicture, random(4000, 7000))

}
setTimeout(changePicture, random(4000, 7000))

function typeNameOrNickname() {


}
const name = document.querySelector('#name')
const nickname = document.querySelector('#nickname')
const nameText = name.innerText
const nicknameText = nickname.innerText
name.innerText = ''
nickname.innerText = ''
function typeNameOrNickname() {
  type(nameText, name, () => {
    type(nicknameText, nickname, () => {
      typeNameOrNickname()
    })
  })
}

function type(text, element, after) {
  let i = 0
  element.innerHTML = ''
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
    } else {
      setTimeout(() => {
        typeDelete(text, element, after)
      }, random(3000, 5000))
      clearInterval(interval)
    }
  }, 100)

}

function typeDelete(text, element, after) {
  let i = text.length - 1
  const interval = setInterval(() => {
    if (i >= 0) {
      element.innerHTML = text.slice(0, i)
      i--
    } else {
      after()
      clearInterval(interval)
    }
  }, 30)
}
typeNameOrNickname()