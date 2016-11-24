var
  jsHeadroom = document.getElementById("js-headroom");

var zdwHeadroom = new Headroom(jsHeadroom, {
  "tolerance": {
    down: 200,
    up: 100
  }
}).init();
