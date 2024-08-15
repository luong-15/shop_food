const orderNowButton = document.querySelector('.btnodernow');
const orderSection = document.querySelector('.selectproduct');

orderNowButton.addEventListener('click', () => {
  orderSection.scrollIntoView({ behavior: 'smooth' });
});

const slideshow = document.getElementById('slideshow');
const slides = slideshow.children;
const totalSlides = slides.length;
let index = 0;
let autoplayInterval;
let isEventAdded = true;
const dots = document.getElementById('dots').children;
updateDots();

function startAutoplay(delay = 3000) {
  autoplayInterval = setInterval(() => {
    index = (index + 1) % totalSlides;
    updateSlidePosition();
  }, delay);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

slideshow.addEventListener('mouseout', () => {
  if (!isEventAdded) {
    startAutoplay()
    isEventAdded = true;
  }
});

slideshow.addEventListener('mouseover', () => {
  if (isEventAdded) {
    stopAutoplay();
    isEventAdded = false;
  }
});

document.getElementById('next').addEventListener('click', () => {
  stopAutoplay();
  index = (index + 1) % totalSlides;
  updateSlidePosition();
});

document.getElementById('prev').addEventListener('click', () => {
  stopAutoplay();
  index = (index - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
});

Array.from(dots).forEach(dot => {
  dot.addEventListener('click', (e) => {
    stopAutoplay();
    index = parseInt(e.target.getAttribute('data-index'));
    updateSlidePosition();
  });
});

function updateSlidePosition() {
  slideshow.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

function updateDots() {
  Array.from(dots).forEach((dot, i) => {
    dot.classList.toggle('bg-primary', i === index);
    dot.classList.toggle('bg-muted', i !== index);
  });
}

startAutoplay();

const chatPopup = document.getElementById('chat-popup');
const chatBubble = document.getElementById('chat-bubble');
const minimizeButton = document.getElementById('minimize-button');

minimizeButton.addEventListener('click', () => {
  chatPopup.classList.toggle('hidden');
  chatBubble.classList.toggle('hidden');
});

chatBubble.addEventListener('click', () => {
  chatPopup.classList.toggle('hidden');
  chatBubble.classList.toggle('hidden');
});

const userInfoElement = document.querySelector('.user-info');

userInfoElement.addEventListener('click', function() {
  const signInModal = document.getElementById('sign-in-modal');
  if (signInModal) {
    signInModal.classList.remove('hidden');
  }
});

document.getElementById('close-sign-in').addEventListener('click', function() {
  document.getElementById('sign-in-modal').classList.add('hidden');
});
document.getElementById('close-sign-up').addEventListener('click', function() {
  document.getElementById('sign-up-modal').classList.add('hidden');
});

document.getElementById('toggle-to-sign-up').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('sign-in-modal').classList.add('hidden');
  document.getElementById('sign-up-modal').classList.remove('hidden');
});
document.getElementById('toggle-to-sign-in').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('sign-up-modal').classList.add('hidden');
  document.getElementById('sign-in-modal').classList.remove('hidden');
});








const form = document.getElementById('sign-in-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Gửi dữ liệu đến server bằng fetch hoặc XMLHttpRequest
  fetch('/public/index.html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Đăng nhập thành công');
      window.location.href = '/';
    } else {
      console.error('Đăng nhập thất bại:', data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
