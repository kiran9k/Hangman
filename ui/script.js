var canvas;
var contedxt;

function initiate(){
    clearCanvas();
    setColor('#000000');
    setLineWidth(20);
    drawGallows();
    setLineWidth(4);
}
function draw(){
    drawHead();
    drawBody();
    drawRightHand();
    drawLeftHand();
    drawRightFoot();
    drawLeftFoot();
};

function continueExecution()
{
    var millis=1000;
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);

}
function clearCanvas() {
    canvas.width = canvas.width;
};

function setColor(color) {
    context.strokeStyle = color;
};

function setLineWidth(width) {
    context.lineWidth = width;
}

function drawGallows() {
    context.beginPath();
    context.moveTo(350, 450);
    context.lineTo(10, 450);
    context.lineTo(70, 450);

    context.lineTo(70, 10);
    context.lineTo(200, 10);
    context.lineTo(200, 50);
    context.stroke();
};

function drawHead() {
    context.beginPath();
    context.arc(200, 100, 50, 0, Math.PI*2, true);
    context.closePath();
    context.lineWidth = 4;
    context.stroke();
};

function drawDead() {
    context.beginPath();
    //context.arcTo(200,120,250,120,10);
    context.arc(180,90,10,0,Math.PI*2,true);
    context.fillStyle="red";
    context.fill();
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(220,90,10,0,Math.PI*2,true);
    context.fillStyle="red";
    context.fill();
    context.closePath();    context.stroke();


    context.beginPath();
    context.moveTo(180, 120);
    context.lineTo(220, 120);
    context.stroke();
    context.closePath();
    context.lineWidth = 4;


};


function drawBody() {
    context.beginPath();
    context.moveTo(200, 150);
    context.lineTo(200, 300);
    context.stroke();
};

function drawRightHand() {
    context.beginPath();
    context.moveTo(200, 170);
    context.lineTo(150, 250);
    context.stroke();
};

function drawLeftHand() {
    context.beginPath();
    context.moveTo(200, 170);
    context.lineTo(250, 250);
    context.stroke();
};

function drawRightFoot() {
    context.beginPath();
    context.moveTo(200, 300);
    context.lineTo(150, 380);
    context.stroke();
};

function drawLeftFoot() {
    context.beginPath();
    context.moveTo(200, 300);
    context.lineTo(250, 380);
    context.stroke();
};

$(document).ready(function(){
    canvas = $('#hangman')[0];
    context = canvas.getContext("2d");
    initiate();


});

function animate(){
    draw();}