let col=0;
let row=0;
let m=50;
let house;
let path;
let rooms;
let first=true;


function reset(){
    row=document.querySelector('#row').value;
    col=document.querySelector('#col').value;
    path=document.querySelector('#path').value.toString().split('').filter((c)=> (c=='1'||c=='0')? true:false);
    console.log(`row: ${row} col: ${col}`);
    console.log(path);
    rooms=0;
    no=false;
    let del = document.querySelector('h1') || null;
    (del) ? del.parentNode.removeChild(del):null;
    house=[];
    this.setup();

}
function setup(){
    C=createCanvas(col*m,row*m);
    C.parent('#canvas');
    if(first){first=false;return;}
    background(51);
    stroke(255);
    textSize(30);
    textAlign(CENTER, CENTER)
// adatok beolvasása
    for(let i=0;i<row;i++){
        house[i]=[];
        for(let j=0;j<col;j++){
            house[i][j]=new Bit(i*m,j*m,path[i*col+j]);
        }
    }
    console.table(house);
// falak kezelése 

    search(0,0,1,'F')
//szobák kezelése és számolása
    for(let i=1;i<row-1;i++){
        for(let j=0;j<col-1;j++){
            if(house[i][j].type==0){
                rooms++;
                search(i,j,0,'Sz');
            }
        }
    }
// székek keresése
    for(let i=1;i<row-1;i++){
        for(let j=0;j<col-1;j++){
            if(house[i][j].type==1&&house[i+1][j].type==='Sz'&&house[i-1][j].type==='Sz'&&house[i][j+1].type==='Sz'&&house[i][j-1].type==='Sz'){
                house[i][j].type='S';
            }
        }
    }
// asztal keresés
    for(let i=1;i<row-1;i++){
        for(let j=1;j<col-1;j++){
            if( house[i][j].type==1&&(
                (house[i][j-1].type==1&&house[i-1][j-1].type==1&&house[i-1][j].type==1)||
                (house[i-1][j].type==1&&house[i-1][j+1].type==1&&house[i][j-1].type==1)||
                (house[i][j+1].type==1&&house[i+1][j+1].type==1&&house[i+1][j].type==1)||
                (house[i+1][j].type==1&&house[i+1][j-1].type==1&&house[i][j-1].type==1))){
                search(i,j,1,'A');
            }
        }
    }
// a maradék elvileg csak kanapé
    for(let i=1;i<row-1;i++){
        for(let j=0;j<col-1;j++){
            if(house[i][j].type==1){
                search(i,j,1,'K');
            }
        }
    }
    
// kirajzolás  
    for(let rows of house){
        for(let bit of rows){
            bit.show();
        }
    }
// kiirás
    var szobak=document.createElement('H1');
    szobak.textContent=`Szobak szama: ${rooms}`;
    document.body.append(szobak);

}

function search(i,j,searchType,nextType){
    if(i>=0&&i<row&&j>=0&&j<col){
        if(house[i][j].type==searchType){
            house[i][j].type=nextType;
            search(i+ 1,j, searchType, nextType);
            search(i- 1,j, searchType, nextType);
            search(i, j+1, searchType, nextType);
            search(i, j-1, searchType, nextType);
        }
    }
}

//egy épületrész
class Bit{
    constructor(y,x,type){
        this.x=x;
        this.y=y;
        this.type=type;
    }
    show(){
        if(this.type==='F'){
            fill(200)
        } else if(this.type==='Sz'){
            fill(0,200,0);
        }else if(this.type==='S'){
            fill(0,100,100);
        }else if(this.type==='A'){
            fill(139,69,19);
        }else{
            fill(255,222,173);
        }
        rect(this.x,this.y,m,m);
        fill(0,0,120);
        text(this.type,this.x+m/2,this.y+m/2)
    }

}