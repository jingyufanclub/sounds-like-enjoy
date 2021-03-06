window.onload = function() {
  document.getElementById("year").innerHTML = new Date().getFullYear()

  const images = ['avocado', 'berry', 'cuke', 'flowers', 'grapefruit', 'jing', 'peony', 'plain', 'pomelo', 'tangerine']

  const colors = ['#fff4f4','#ffffff','#ff0000','#d4fc79','#c2e9fb','#cfd9df','#d9ded8','#96fbc4']

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const scaleFactor = backingScale(ctx);
  const newButton = document.querySelector('#new-button');
  const downloadButton = document.querySelector('#download-button');

  ctx.scale(scaleFactor, scaleFactor);

  function backingScale(ctx) {
    if ('devicePixelRatio' in window) {
      if (window.devicePixelRatio > 1) {
          return window.devicePixelRatio;
      }
    }
    return 1;
  }

  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
  };

  const resizeCanvas = debounce(function() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (scaleFactor > 1) {
      canvas.width = w * scaleFactor;
      canvas.height = h * scaleFactor;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      draw();
    } else {
      canvas.width = w;
      canvas.height = h;
      draw();
    }
  }, 66);

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', resizeCanvas);

  // Fisher-Yates shuffle
  function shuffle(array) {
    let currentIndex = array.length, temp, randomIndex;
    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex--);
      temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  }

  function draw() {
    let numberOfItems =  Math.floor(Math.random() * 6) + 4,
        selectedImages = shuffle(images).slice(0, numberOfItems),
        imageUrls = selectedImages.map(img => "images/" + img.toString() + ".png"),
        bgColor = shuffle(colors)[0];

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageUrls.length; i++) {
      let img = new Image();
      img.onload = function() {
        let pattern = ctx.createPattern(this, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      img.src = imageUrls[i];
    }
  }

  newButton.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  })

  function download(link, filename) {
    link.href = canvas.toDataURL();
    link.download = filename;
  }

  downloadButton.addEventListener('click', function() {
    download(this, 'livelacroix.png')
    }, false)
}
