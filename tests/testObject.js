export default {
  hello: function(actually = true) {
    this.helloNode = document.getElementById('hello');
  },
  hide: function(actually = true, okactually) {
    if (actually || okactually) {
      this.helloNode.style.display = 'none';
    }
  },
  show: function() {
    this.helloNode.style.display = 'block';
  },
  add: function(num1, num2) {
    return num1 + num2;
  },
  addAgain: function(num1, num2) {
    return num1 + num2;
  },
  showNum: function(num) {
    document.getElementById('number').innerText = num;
  }
}