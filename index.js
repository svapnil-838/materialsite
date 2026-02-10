
			// small click handler for cards and bottom buttons
			const toast = document.getElementById('toast');
			const showToast = (text)=>{
				toast.textContent = text;
				toast.classList.add('show');
				clearTimeout(showToast.tid);
				showToast.tid = setTimeout(()=> toast.classList.remove('show'), 2000);
			};

			document.querySelectorAll('.card').forEach(card=>{
				const label = card.querySelector('h3').innerText;
				card.addEventListener('click', ()=> showToast(label+' clicked'));
				card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }});
			});

			document.querySelectorAll('.bottombar button').forEach(btn=>{
				btn.addEventListener('click', ()=>{
					document.querySelectorAll('.bottombar button').forEach(b=>b.classList.remove('active'));
					btn.classList.add('active');
					showToast(btn.textContent.trim());
				});
			});



			// 1. Wait for the DOM to be fully loaded before running script
document.addEventListener("DOMContentLoaded", function () {
  
  // Select the main grid container that holds all cards
  const cardGrid = document.querySelector(".grid");

  /**
   * NAVIGATION LOGIC
   * Maps the "data-key" from HTML to specific file paths
   */
  function navigateToPage(key) {
    // Define your routes here
    // You can easily update these paths as you create more files
    const routes = {
      "1": "week1n2py.html",      // Home
      "2": "week3n4py.html",     // About Us
      "3": "week5n6py.html",  // Memories
      "4": "week1n2c.html",   // Contact
      "5": "week3n4c.html",   // Reports
      "6": "week5n6c.html",  // Projects
      "7": "notifs.html",    // Notifications
      "8": "goals.html"      // Goals
    };

    const targetPath = routes[key];

    // If a valid path exists for the clicked key, navigate to it
    if (targetPath) {
      window.location.href = targetPath;
    } else {
      console.error("No path defined for key: " + key);
      showToast("Page under construction");
    }
  }

  /**
   * EVENT LISTENER
   * Uses Event Delegation to detect clicks on cards
   */
  cardGrid.addEventListener("click", function (event) {
    // Find the closest parent with the class 'card'
    const clickedCard = event.target.closest(".card");

    // If a card was actually clicked
    if (clickedCard) {
      // Get the data-key defined in your home.html
      const key = clickedCard.getAttribute("data-key");
      
      // Execute the navigation function
      navigateToPage(key);
    }
  });

  /**
   * TOAST NOTIFICATION LOGIC
   * Visual feedback for actions
   */
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");

      // Hide the toast after 3 seconds
      setTimeout(function () {
        toast.classList.remove("show");
      }, 3000);
    }
  }

});










// Image modal logic
document.addEventListener('DOMContentLoaded', function() {
  const imgWrappers = document.querySelectorAll('.img-wrapper');
  const imgModal = document.getElementById('imgModal');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const imgFullscreen = document.getElementById('imgFullscreen');
  const fullscreenImg = document.getElementById('fullscreenImg');
  const closeFullscreen = document.getElementById('closeFullscreen');
  let currentImg = null;

  imgWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', function() {
      currentImg = wrapper.querySelector('img');
      imgModal.classList.add('show');
    });
  });

  fullscreenBtn.addEventListener('click', function() {
    if (currentImg) {
      fullscreenImg.src = currentImg.src;
      imgFullscreen.classList.add('show');
      imgModal.classList.remove('show');
    }
  });

  cancelBtn.addEventListener('click', function() {
    imgModal.classList.remove('show');
    currentImg = null;
  });

  closeFullscreen.addEventListener('click', function() {
    imgFullscreen.classList.remove('show');
    fullscreenImg.src = '';
    currentImg = null;
  });

  // Optional: close fullscreen on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      imgFullscreen.classList.remove('show');
      fullscreenImg.src = '';
      imgModal.classList.remove('show');
      currentImg = null;
    }
  });
});





// Zoom with mouse wheel and pinch gesture on fullscreen image
(function() {
  const imgFullscreen = document.getElementById('imgFullscreen');
  const fullscreenImg = document.getElementById('fullscreenImg');
  let zoomLevel = 1;
  let lastTouchDist = null;

  function setZoom(level) {
    zoomLevel = Math.max(0.2, Math.min(level, 5));
    fullscreenImg.style.transform = `scale(${zoomLevel})`;
  }

  // Mouse wheel zoom
  fullscreenImg.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (e.deltaY < 0) setZoom(zoomLevel + 0.1);
    else setZoom(zoomLevel - 0.1);
  });

  // Touch pinch zoom
  fullscreenImg.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist) {
        const delta = dist - lastTouchDist;
        setZoom(zoomLevel + delta * 0.005);
      }
      lastTouchDist = dist;
    }
  }, { passive: false });

  fullscreenImg.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) lastTouchDist = null;
  });

  // Reset zoom when closing fullscreen
  document.getElementById('closeFullscreen').addEventListener('click', function() {
    setZoom(1);
  });
})();



(function() {
  const fullscreenImg = document.getElementById('fullscreenImg');
  let zoomLevel = 1;
  let isDragging = false;
  let startX, startY, lastX = 0, lastY = 0;

  function setTransform() {
    fullscreenImg.style.transform = `scale(${zoomLevel}) translate(${lastX}px, ${lastY}px)`;
  }

  // Mouse drag
  fullscreenImg.addEventListener('mousedown', function(e) {
    if (zoomLevel === 1) return; // No pan if not zoomed
    isDragging = true;
    startX = e.clientX - lastX;
    startY = e.clientY - lastY;
    fullscreenImg.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    lastX = e.clientX - startX;
    lastY = e.clientY - startY;
    setTransform();
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    fullscreenImg.style.cursor = '';
  });

  // Touch drag
  fullscreenImg.addEventListener('touchstart', function(e) {
    if (zoomLevel === 1 || e.touches.length !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX - lastX;
    startY = e.touches[0].clientY - lastY;
  });

  fullscreenImg.addEventListener('touchmove', function(e) {
    if (!isDragging || e.touches.length !== 1) return;
    lastX = e.touches[0].clientX - startX;
    lastY = e.touches[0].clientY - startY;
    setTransform();
  });

  fullscreenImg.addEventListener('touchend', function() {
    isDragging = false;
  });

  // Integrate with your zoom code:
  fullscreenImg.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (e.deltaY < 0) zoomLevel += 0.1;
    else zoomLevel -= 0.1;
    zoomLevel = Math.max(0.2, Math.min(zoomLevel, 5));
    setTransform();
  });

  // Reset on close
  document.getElementById('closeFullscreen').addEventListener('click', function() {
    zoomLevel = 1;
    lastX = 0;
    lastY = 0;
    setTransform();
  });
})();