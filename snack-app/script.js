$('.btn').on('click', toggleBtn);


function toggleBtn() {
  btn = this;
  btn.classList.add('is-active');
  
  setTimeout(function () {
      btn.classList.remove('is-active');
  }, 2500)
}

function toggleBtn() {
    btn = this;
    btn.classList.add('is-active');
    
    // Remove the 'is-active' class after 2.5 seconds
    setTimeout(function () {
        btn.classList.remove('is-active');
    }, 2500);
  
    // Redirect to home.html after 2 seconds
    setTimeout(function () {
        window.location.href = './home/index.html';
    }, 1500); // Redirect after 2 seconds
  }










  