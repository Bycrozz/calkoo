const text = '20'
const percentage = parseFloat(text)
var numb= (350*100)/((1+(percentage/100))*100);
var rounded = Math.round((numb + Number.EPSILON) * 100) / 100;
console.log(percentage);