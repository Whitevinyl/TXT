
//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function Type(ctx, x, y, s, string) {

    this.ctx = ctx;
    this.string = string.toUpperCase();
    this.position = new Point(x, y);
    this.fontSize = s * ratio;

    var font = 'Oswald';
    var weight = 700;
    this.fontStyle = '' + weight + ' ' + this.fontSize + 'px ' + font;
    this.ctx.font = this.fontStyle;
    this.size = this.ctx.measureText(this.string).width;

    if (this.size > width) typeGen = false;

    this.quality = 3;
    this.rows = Math.min(600, this.fontSize / this.quality);
    this.rowHeight = Math.ceil(this.fontSize / this.rows);


    this.index1 = 100;
    this.index2 = 200;
    this.index3 = 300;
    this.index4 = 400;
    this.yIndex = 500;
    this.linkOff = 0;


    this.range = 110;
    this.range = 80;
    this.offsetRange = 500;
    this.yRange = 10;


    this.rowOffset = [];
    this.rowOffsetDest = [];
    this.rowOffsetY = [];
    this.rowOffsetYDest = [];
    var dv = 6;
    for (var i=0; i<this.rows; i++) {
        var n = tombola.range(-this.offsetRange/dv, this.offsetRange/dv);
        if (tombola.percent(10)) n = tombola.range(-this.offsetRange, this.offsetRange);
        this.rowOffset.push( n );
        this.rowOffsetDest.push( n );
        this.rowOffsetY.push( 0 );
        this.rowOffsetYDest.push( 0 );
    }

    this.noise = new SimplexNoise();

    this.peaking = tombola.percent(5);
    this.peak = tombola.rangeFloat(0, this.rows);
    this.peakOffset = tombola.range(-100, 100);

}

//-------------------------------------------------------------------------------------------
//  LINK
//-------------------------------------------------------------------------------------------

Type.prototype.link = function(master) {
    this.noise = master.noise;
    this.linkOff = (this.position.y - master.position.y) / this.quality;
};

//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


Type.prototype.update = function() {

    var i, n, ind;

    var m = 0.75;
    var dv = 190 / this.quality;
    var dv2 = 40 / this.quality;

    this.yIndex += (0.002 * m);
    this.index1 += (0.005 * m);
    this.index2 += (0.009 * m);
    this.index3 += (0.007 * m);
    this.index4 = (7 * m * this.noise.noise(10000, this.yIndex));

    for (i=0; i<this.rows; i++) {
        ind = i + this.linkOff;

        // horizontal //
        n = this.noise.noise(0, this.index1 + (ind/dv)) * this.noise.noise(this.index2 + (ind/dv), 0) * this.noise.noise(10000, this.index3 + (ind/dv));
        this.rowOffsetDest[i] = n * this.range;

        // vertical //
        n = this.noise.noise(this.index4 + (ind/dv2), 10000);
        this.rowOffsetYDest[i] = n * this.yRange;

        // peak //
        if (this.peaking && i === Math.round(this.peak)) this.rowOffsetDest[i] += this.peakOffset;

        // spike //
        if (tombola.chance(1,150000)) {
            this.rowOffsetDest[i] += tombola.range(-this.offsetRange, this.offsetRange);
            this.rowOffset[i] = this.rowOffsetDest[i];
        }

        this.rowOffset[i] = lerp(this.rowOffset[i], this.rowOffsetDest[i], 5);
        this.rowOffsetY[i] = lerp(this.rowOffsetY[i], this.rowOffsetYDest[i], 5);
    }

    // move peak //
    if (this.peaking) {
        this.peak += tombola.rangeFloat(-1, 1);
        this.peakOffset += tombola.range(-5, 5);
        this.peak = constrain(this.peak, 0, this.rows);
        this.peakOffset = constrain(this.peakOffset, -this.offsetRange, this.offsetRange);
    }

};



//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


Type.prototype.draw = function() {

    var i, l;
    var ctx = this.ctx;
    lens.ctx = this.ctx;
    var x = this.position.x;
    var y = this.position.y;
    var rx = Math.round(x - (this.size/2));
    var ry = Math.round(y - (this.fontSize * 0.9));


    color.fill(ctx, highlight);
    ctx.textAlign = 'center';
    ctx.font = this.fontStyle;


    // DRAW EACH ROW //
    for (i=0; i<this.rows; i++) {
        var bx = rx + this.rowOffset[i];
        var by = ry + (this.rowHeight * i);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + this.size, by);
        ctx.lineTo(bx + this.size, by + this.rowHeight);
        ctx.lineTo(bx, by + this.rowHeight);
        ctx.closePath();
        ctx.clip();

        ctx.fillText(this.string, x + this.rowOffset[i], y + this.rowOffsetY[i]);

        ctx.restore();
    }

};
