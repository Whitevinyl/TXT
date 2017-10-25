

// INIT //
var canvas;
var ctx;
var stats;

// METRICS //
var width = 0;
var height = 0;
var ratio = 1;
var TAU = 2 * Math.PI;
var device = 'desktop';


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var mouseIsDown = false;

// TEXTURE //
var textureCol = [new RGBA(0,32,185,1),new RGBA(235,98,216,1),new RGBA(10,200,200,1),new RGBA(255,245,235,1),new RGBA(5,5,5,1),new RGBA(255,160,180,1),new RGBA(255,170,170,1),new RGBA(255,140,90,1),new RGBA(245,25,35,1),new RGBA(10,10,70,1),new RGBA(255,80,100,1),new RGBA(70,0,80,1),new RGBA(120,235,200,1),new RGBA(160,150,170,1),new RGBA(220,20,80,1),new RGBA(210,150,120,1)];
var textureCol2 = [new RGBA(0,0,40,1),new RGBA(0,52,65,1),new RGBA(255,230,140,1),new RGBA(255,80,100,1),new RGBA(255,180,210,1)];
var lastPalette = 0;

var typeGen = false;
var type = [];
var bgCol = new RGBA(0,0,0,1);
var bgDest = new RGBA(0,0,0,1);
var highlight = new RGBA(255,255,255,1);
var palette = [new RGBA(0,0,0,1), new RGBA(0,32,185,1), new RGBA(10,10,70,1), new RGBA(235,100,110,1), new RGBA(70,0,80,1), new RGBA(240,25,40,1), new RGBA(255,160,180,1), new RGBA(155,150,160,1)];


//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function init() {

    // SETUP EXPERIMENT //
    setupExperiment();

    // SETUP CANVAS //
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');


    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // INTERACTION //
    //setupInteraction();

    // STATS //
    //initStats();

    // GENERATE NOISE LAYER //
    canvasNoise(200, 200, ratio, 0.025, 'noiseLayer');


    // CSS TRANSITION IN //
    var overlay = document.getElementById('overlay');
    overlay.style.top = '0';
    overlay.style.opacity = '1';

    setTimeout(function() {
        // INIT PAINT //
        resetType();

        // START LOOP //
        loop();

        // BG COL //
        setInterval(function() {
            var c = tombola.item(palette);
            setBG(c);
            resetType();
        },5500);
    }, 1500);


}

function resetType() {
    typeGen = true;
    var x = width/2;
    var y = height/2;
    var fs = 120;
    if (device==='mobile') fs = 80;
    type = [];
    type.push( new Type(ctx, x, y - ((fs * 0.05) * ratio), fs, lexicon.random('jj')) );
    if (typeGen) {
        type.push( new Type(ctx, x, y + ((fs * 0.8) * ratio), fs, lexicon.random('nn')) );
        type[1].link(type[0]);
    } else {
        resetType();
    }
}


function initStats() {
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}

function setBG(dest) {
    bgDest.R = dest.R;
    bgDest.G = dest.G;
    bgDest.B = dest.B;
}

function colorLerp(from, to, speed) {
    from.R = lerp(from.R, to.R, speed);
    from.G = lerp(from.G, to.G, speed);
    from.B = lerp(from.B, to.B, speed);
    from.A = lerp(from.A, to.A, speed);
}


//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function loop() {
    if (stats) stats.begin();
    update();
    draw();
    if (stats) stats.end();
    requestAnimationFrame(loop);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

function update() {
    if (experiment) {
        experiment.update();
    }
    var l = type.length;
    for (var i=0; i<l; i++) {
        type[i].update();
    }


    colorLerp(bgCol,bgDest,2);
}


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

function draw() {
    color.fill(ctx,bgCol);
    ctx.fillRect(0,0,width,height);

    var l = type.length;
    for (var i=0; i<l; i++) {
        type[i].draw();
    }
}
