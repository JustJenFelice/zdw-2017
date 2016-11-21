var
  jsHeadroom = document.getElementById("js-headroom");

var zdwHeadroom = new Headroom(jsHeadroom, {
  "tolerance": {
    down: 50,
    up: 50
  }
}).init();
