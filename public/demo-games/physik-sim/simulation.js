const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const balls = []

const colors = [
  '#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1', '#06b6d4'
]

function resize() {
  const container = document.getElementById('game-container')
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight - document.getElementById('controls').offsetHeight
}

window.addEventListener('resize', resize)
resize()

function createBall(x, y) {
  const radius = 10 + Math.random() * 20
  balls.push({
    x: x || Math.random() * canvas.width,
    y: y || radius,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 2,
    radius,
    color: colors[Math.floor(Math.random() * colors.length)],
    mass: radius * 0.1
  })
  updateCount()
}

function updateCount() {
  document.getElementById('ball-count').textContent = `Baelle: ${balls.length}`
}

function getGravity() {
  return parseFloat(document.getElementById('gravity').value) * 0.1
}

function getFriction() {
  return 1 - parseFloat(document.getElementById('friction').value) * 0.001
}

function update() {
  const gravity = getGravity()
  const friction = getFriction()

  for (const ball of balls) {
    // Apply gravity
    ball.vy += gravity

    // Apply friction
    ball.vx *= friction
    ball.vy *= friction

    // Update position
    ball.x += ball.vx
    ball.y += ball.vy

    // Wall collisions
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius
      ball.vx = Math.abs(ball.vx) * 0.8
    }
    if (ball.x + ball.radius > canvas.width) {
      ball.x = canvas.width - ball.radius
      ball.vx = -Math.abs(ball.vx) * 0.8
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius
      ball.vy = Math.abs(ball.vy) * 0.8
    }
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius
      ball.vy = -Math.abs(ball.vy) * 0.8

      // Stop tiny bounces
      if (Math.abs(ball.vy) < 0.5) {
        ball.vy = 0
      }
    }
  }
}

function draw() {
  ctx.fillStyle = '#111827'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const ball of balls) {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = ball.color
    ctx.fill()

    // Highlight
    ctx.beginPath()
    ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.25, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fill()
  }
}

function loop() {
  update()
  draw()
  requestAnimationFrame(loop)
}

// Click on canvas to add ball
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect()
  createBall(e.clientX - rect.left, e.clientY - rect.top)
  // Hide hint after first click
  const hint = document.getElementById('hint')
  if (hint) hint.style.display = 'none'
})

// Controls
document.getElementById('add-ball').addEventListener('click', () => createBall())
document.getElementById('clear-all').addEventListener('click', () => {
  balls.length = 0
  updateCount()
})

// Start with 3 balls
for (let i = 0; i < 3; i++) createBall()

loop()
