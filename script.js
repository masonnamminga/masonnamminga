
//copyright footer
document.getElementById("year").textContent = new Date().getFullYear();


// custom cursor effects
document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.querySelector('.cursor');
  const links = document.querySelectorAll('a');
  const containers = document.querySelectorAll('.image-container');
  const iframes = document.querySelectorAll('iframe'); // Select all iframes
  const videoElements = document.querySelectorAll('video'); // Select all video elements
  const nonCursorElements = [...iframes, ...videoElements]; // Add all non-interactive elements

  let hasMouse = false;
  let mouseX = 0, mouseY = 0, containerX = 0, containerY = 0, followSpeed = 0.1;

  // Set up event listeners for each image container
  containers.forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / 15;
      mouseY = (e.clientY - rect.top - rect.height / 2) / 15;
    });

    function animateContainer() {
      containerX += (mouseX - containerX) * followSpeed;
      containerY += (mouseY - containerY) * followSpeed;
      container.style.transform = `translate(${containerX}px, ${containerY}px)`;
      requestAnimationFrame(animateContainer);
    }

    animateContainer();

    container.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });
  });

  // Handle cursor visibility and position
  document.addEventListener('mousemove', function(e) {
    if (!hasMouse) {
      hasMouse = true;
      cursor.style.visibility = 'visible';
    }
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Handle cursor hiding for touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    cursor.style.display = 'none';
  } else {
    cursor.style.visibility = 'hidden';
  }

  // Handle cursor hover effect
  document.addEventListener('mousedown', function() {
    cursor.classList.add('cursorinnerhover');
  });

  document.addEventListener('mouseup', function() {
    cursor.classList.remove('cursorinnerhover');
  });

  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      cursor.classList.add('hover');
    });
    link.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // Handle mouseout event to hide the cursor
  document.addEventListener('mouseout', function() {
    cursor.style.visibility = 'hidden';
  });

  document.addEventListener('mouseover', function() {
    if (hasMouse) {
      cursor.style.visibility = 'visible';
    }
  });

  // Detect if cursor is over non-interactive elements like iframes or videos
  nonCursorElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.visibility = 'hidden'; // Hide the cursor when over non-interactive elements
    });

    element.addEventListener('mouseleave', () => {
      cursor.style.visibility = 'visible'; // Show the cursor again when leaving the element
    });
  });

});