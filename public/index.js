const orderNowButton = document.querySelector('.btnodernow');
const orderSection = document.querySelector('.selectproduct');

orderNowButton.addEventListener('click', () => {
  orderSection.scrollIntoView({ behavior: 'smooth' });
});

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

userInfoElement.addEventListener('click', function () {
  const signInModal = document.getElementById('sign-in-modal');
  if (signInModal) {
    signInModal.classList.remove('hidden');
  }
});

document.getElementById('close-sign-in').addEventListener('click', function () {
  document.getElementById('sign-in-modal').classList.add('hidden');
});
document.getElementById('close-sign-up').addEventListener('click', function () {
  document.getElementById('sign-up-modal').classList.add('hidden');
});

document.getElementById('toggle-to-sign-up').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('sign-in-modal').classList.add('hidden');
  document.getElementById('sign-up-modal').classList.remove('hidden');
});
document.getElementById('toggle-to-sign-in').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('sign-up-modal').classList.add('hidden');
  document.getElementById('sign-in-modal').classList.remove('hidden');
});


const getUserData = async () => {
  const token = getCookie('token');

  if (token) {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      // Tìm các phần tử cần cập nhật
      const userAvatar = document.querySelector('.user-info img');
      const userProfile = document.querySelector('.user-info span');

      // Cập nhật nội dung
      userAvatar.src = data.avatar; // Giả sử data.avatar chứa URL ảnh
      userProfile.textContent = `Username: ${data.username}`
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

// Hàm lấy giá trị cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

window.addEventListener('load', () => {
  const token = getCookie('token');

  if (token) {
    getUserData();
  }
});

const userInfo = document.querySelector('.user-info')

userInfo.addEventListener('click', () => {
  const token = getCookie('token');

  if (token) {
    window.location.href = '/trang-can-dieu-huong';
  }
});

function filterFood(type) {
  fetch(`/filter?type=${type}`)
    .then(response => response.json())
    .then(data => {
      const foodItemsDiv = document.getElementById('food-items');
      foodItemsDiv.innerHTML = '';

      data.forEach(food => {
        const foodItemDiv = document.createElement('div');
        foodItemDiv.className = 'bg-card text-card-foreground p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105';

        const foodImage = document.createElement('img');
        foodImage.src = food.imgproduct;
        foodImage.className = 'w-full h-48 object-cover rounded-lg mb-4';
        foodImage.alt = `${type}`;
        foodItemDiv.appendChild(foodImage);

        const foodTitle = document.createElement('h3');
        foodTitle.textContent = food.nameproduct;
        foodTitle.className = 'text-2xl font-bold mb-2';
        foodTitle.alt = food.nameproduct;
        foodItemDiv.appendChild(foodTitle);

        const foodPrice = document.createElement('p');
        foodPrice.textContent = food.priceproduct;
        foodPrice.className = 'text-muted-foreground mb-4'
        foodItemDiv.appendChild(foodPrice);

        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'btnaddtocard bg-primary text-primary-foreground px-5 py-2 rounded-lg transition duration-300';
        addToCartButton.textContent = 'Add to Cart';
        foodItemDiv.appendChild(addToCartButton);

        foodItemsDiv.appendChild(foodItemDiv);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const slideshow = document.getElementById('slideshow');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dots = document.getElementById('dots');

let slideIndex = 0;
let slideImages = [];

// Fetch slideshow images from server
fetch('/slideshow')
  .then(response => response.json())
  .then(data => {
    slideImages = data;
    createSlides();
    startSlideshow();
  })
  .catch(error => {
    console.error('Error fetching slideshow images:', error);
  });

function createSlides() {
  slideImages.forEach((image, index) => {
    const slide = document.createElement('img');
    slide.src = image.imgslide;
    slide.alt = image.alt_text;

    slide.classList.add('w-full', 'object-cover'); 

    slideshow.appendChild(slide);

    const dot = document.createElement('button');
    dot.classList.add('w-3', 'h-3', 'bg-muted', 'rounded-full');
    dot.setAttribute('data-index', index);
    dots.appendChild(dot);
  });
}

function startSlideshow() {
  showSlide(slideIndex);

  // Add event listeners for previous and next buttons
  prevBtn.addEventListener('click', () => {
    showSlide(slideIndex -= 1);
  });
  nextBtn.addEventListener('click', () => {
    showSlide(slideIndex += 1);
  });

  // Add event listeners for dot buttons
  const dotButtons = document.querySelectorAll('#dots button');
  dotButtons.forEach(button => {
    button.addEventListener('click', () => {
      showSlide(button.getAttribute('data-index'));
    });
  });
}

function showSlide(index) {
  slideIndex = index;

    // Check if reached the last image
    if (slideIndex === slideImages.length - 1) {
      slideIndex = 0;
    } else if (slideIndex < 0) {
      slideIndex = slideImages.length - 1; 
    }

  // Update slide position and dot indicators
  const slides = slideshow.children;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.transform = 'translateX(0)'; 
  }

  slideshow.style.transform = `translateX(-${index * 100}%)`;

  slides[slideIndex].style.transition = 'transform 0.5s ease-in-out';

  slides[slideIndex].style.display = 'block';

  // Update dot indicators using class toggle
  const dots = document.querySelectorAll('#dots button');
  dots.forEach(dot => dot.classList.remove('bg-primary'));
  dots[slideIndex].classList.add('bg-primary');
}
