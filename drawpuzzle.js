// 参考 https://qiita.com/qiiChan/items/5179a7e540257d38c181

//worker
self.addEventListener('message', function(e) {
    data = e.data[0]
    size = e.data[1]
    margin = e.data[2]
    slide = e.data[3]
    piecenum = e.data[4]
    pmd = e.data[5]
    pindex = e.data[6]
    cursorpos = e.data[7]
    bsize = e.data[8]
    x = bsize*size[0]+margin[0]*bsize*2;
    y = bsize*size[1]+margin[1]*bsize*2;

    // make play data
    pd = [];
    for (p=0;p<piecenum;p++) {
        let pa = new Array(y);
        for (i=0;i<y;i++) {
            pa[i] = new Array(x).fill(0);
        }
        pd.push(pa);
    }

    for (let i=0;i<y;i++) {
        for (let j=0;j<x;j++) {
            dy = Math.floor(i/bsize);
            dx = Math.floor(j/bsize);
            if (data[dy]!=null && data[dy][dx]!=null) {
                mvp = pmd[data[dy][dx]-1];
                pd[data[dy][dx]-1][i+margin[1]*bsize+slide[1]*bsize+mvp[1]*bsize][j+margin[0]*bsize+slide[0]*bsize+mvp[0]*bsize] = data[dy][dx];
            }
        }
    }

    // view
    iarr = new Uint8ClampedArray(x * y * 4);
    for (iy = 0; iy < y; iy++) {
        for (ix = 0; ix < x; ix++) {
            index = (iy*x+ix)*4; // index of position [ix,iy]
            if (ix>=margin[0]*bsize+slide[0]*bsize&ix<margin[0]*bsize+size[0]*bsize+slide[0]*bsize & iy>=margin[1]*bsize+slide[1]*bsize&iy<margin[1]*bsize+size[1]*bsize+slide[1]*bsize) {
                iarr[index+0] = 100; // Red
                iarr[index+1] = 100; // Green
                iarr[index+2] = 100; // Blue
                iarr[index+3] = 255; // Alpha
            }
            else {
                iarr[index+0] = 50; // Red
                iarr[index+1] = 50; // Green
                iarr[index+2] = 50; // Blue
                iarr[index+3] = 255; // Alpha
            }
        }
    }
    for (iy = 0; iy < y; iy++) {
        for (ix = 0; ix < x; ix++) {
            index = (iy*x+ix)*4; // index of position [ix,iy]
            for (p=0;p<piecenum;p++) {
                d = piececolor[pd[pindex.indexOf(p+1)][iy][ix]-1]
                if (d!=null) {
                    iarr[index+0] = d[0]; // Red
                    iarr[index+1] = d[1]; // Green
                    iarr[index+2] = d[2]; // Blue
                    iarr[index+3] = 255; // Alpha
                }
            }
        }
    }

    // draw cursor

    for (iy = 0; iy < bsize; iy++) {
        for (ix = 0; ix < bsize; ix++) {
            if (((iy<1|iy>bsize-2)&ix%2==0 | (ix<1|ix>bsize-2)&iy%2==0)) {
                i = iy+cursorpos[1]*bsize
                j = ix+cursorpos[0]*bsize
                index = (i*x+j)*4;
                iarr[index+0] = 255; // Red
                iarr[index+1] = 255; // Green
                iarr[index+2] = 255; // Blue
                iarr[index+3] = 255; // Alpha
            }
        }
    }
    
    self.postMessage(["result",iarr,pd]);

}, false);

piececolor = [
    [99,136,253],[125,25,112],[65,105,225],[200,225,155],[0,255,255],[95,158,160],[170,100,100],[178,34,34],[188,143,143],[153,50,204],[221,160,221],[244,164,96],[235,235,0],[210,18,140],[139,69,19],[123,104,238],[210,105,30],[50,205,50],[238,130,238],[240,100,80],[150,81,77],[173,125,76],[71,75,66],[68,97,123],[137,195,235],[22,94,131],[30,80,162],[34,5,112],[130,174,70],[236,109,81],[136,72,152],[151,144,164],
]