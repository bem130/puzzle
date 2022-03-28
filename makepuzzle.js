// 参考 https://qiita.com/qiiChan/items/5179a7e540257d38c181

//worker
self.addEventListener('message', function(e) {
    size = e.data[0]
    piecenum = e.data[1]

    data = new Array(size[1])
    if (size[0]*size[1]<piecenum) {
        piecenum = size[0]*size[1]
        document.getElementById("piecenum").value = piecenum
        document.getElementById("piecenum_show").innerHTML = piecenum
    }
    for (i=0;i<size[1];i++) {
        data[i] = new Array(size[0]).fill(0)
    }
    for (p=1;p<=piecenum;p++) { // first of part
        f = true;
        while (f) {
            lx = Math.floor(Math.random()*size[0]);
            ly = Math.floor(Math.random()*size[1]);
            if (data[ly][lx]==0) {
                data[ly][lx] = p;
                f = false;
            }
        }
    }
    while (isin0()) {
        for (let i=0;i<size[1];i++) {
            for (let j=0;j<size[0];j++) {
                if (data[i][j]==0) {
                    nba = nearb(j,i);
                    if (nba.length>0) {
                        md = size[0]*size[1]
                        for (let ai=0;ai<nba.length;ai++) {
                            if (md>bnum(nba[ai])) {
                                md = bnum(nba[ai]);
                            }
                        }
                        minb = []
                        for (let ai=0;ai<nba.length;ai++) {
                            if (bnum(nba[ai])==md) {
                                minb.push(nba[ai])
                            }
                        }
                        b = minb[Math.floor(Math.random()*minb.length)];
                        data[i][j] = b;
                    }
                }
            }
        }
    }
    //self.postMessage(["progress",e.data]);
    //self.postMessage(["result",e.data]);
    self.postMessage(["result",data]);
  }, false);
  
function isin0() {
    for (let i=0;i<size[1];i++) {
        for (let j=0;j<size[0];j++) {
            if (data[i][j]==0) {
                return true;
            }
        }
    }
    return false;
}
function nearb(x,y) {
    reta = []
    if (y-1>0 && data[y-1][x]!=0 && data[y-1][x]!=null) {
        reta.push(data[y-1][x]);
    }
    if (x-1>0 && data[y][x-1]!=0 && data[y][x-1]!=null) {
        reta.push(data[y][x-1]);
    }
    if (y+1<size[1] && data[y+1][x]!=0 && data[y+1][x]!=null) {
        reta.push(data[y+1][x]);
    }
    if (x+1<size[0] && data[y][x+1]!=0 && data[y][x+1]!=null) {
        reta.push(data[y][x+1]);
    }
    return reta;
}

function bnum(b) {
    let c = 0
    for (i=0;i<size[1];i++) {
        for (j=0;j<size[0];j++) {
            if (data[i][j]==b) {
                c++;
            }
        }
    }
    return c;
}