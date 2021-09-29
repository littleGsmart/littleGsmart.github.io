var bigBigCanvas = document.getElementById('bigbigcanvas');
var ctx = bigBigCanvas.getContext('2d');
ctx.scale(2.4,2.4);

let set_time_mot = 2000;//这个还不可以调
let set_time_acc = 3000;//这个也还不可以调

let start_mot;
let start_acc;

let kd_mode = 0;
let mot_mode = 0;
let stop_mode = 0;
let game_mode = 0;
let i_mode = 0;

let kd_enable = 0;//为了解决连跳bug引入的参数

let a = Math.round(Math.random()*80)+70;
let c = Math.round(Math.random()*80)+70;
let b = Math.round(Math.random()*(560-c))+240+c;

let score = 0;

let mot_x1 = 0;
let mot_y1 = 0;

let elapsed_acc = 0;
let elapsed_mot = 0;

function render(timestamp) {
    if (game_mode == 1){
        if (mot_mode == 1) { 
            if (start_mot === undefined)
                start_mot = timestamp;
            elapsed_mot = timestamp - start_mot;
            if (elapsed_mot > 2000) { // 在设定秒数后停止动画
                stop_mode = 1;
                mot_mode = 0;
                start_mot = undefined;
                elapsed_mot = 2000;
                render_mot();//强行定位
                judger();

                if(game_mode == 1){
                    setTimeout(function () {
                        a = c
                        c = Math.round(Math.random()*80)+70;
                        b = Math.round(Math.random()*(560-c))+240+c;
                        elapsed_mot = 0;
                        elapsed_acc = 0;
                        stop_mode = 0;
                        kd_enable = 0;
                        drawHero.eraseJumper(drawHero.posi,mot_x1,mot_y1);
                        drawHero.posi = drawHero.jumper_dis - drawHero.min_dis + 55;
                        console.log(drawHero.posi);
                        render_mot(); 
                    },1000)
                }
            }
            else render_mot();
        }  //控制jump   

        if ((kd_mode == 1) && (mot_mode == 0) && (stop_mode == 0)) {
            if (start_acc === undefined)
                start_acc = timestamp;
            elapsed_acc = timestamp - start_acc;
            if (elapsed_acc > 3000) {
                elapsed_acc = 3000;
            }
            else render_acc();
        }
            render_stg();

        console.log('running');
        
        window.requestAnimationFrame(render);
    }
}

class jumper {
    constructor(){
        this.posi = 100;
        this.jumper_dis = 0;
        this.min_dis = 0;
    }
    drawJumper(x0,x,y,color){
        ctx.fillStyle = 
        ctx.beginPath();
        ctx.moveTo(x0+x, 600-y);
        ctx.lineTo(x0+50+x, 600-y);
        ctx.lineTo(x0+25+x, 500-y);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x0+25+x, 490-y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
    }
    eraseJumper(x0,x,y){
        ctx.clearRect(x0-2+x,468-y,104,134);
    }
    changePosition(x1,y1,x2,y2,color){
        this.eraseJumper(this.posi,x1,y1);
        this.drawJumper(this.posi,x2,y2,color);
    }
    jumpFrame(horrdis,color){
        var x2 = 0.0005*elapsed_mot*horrdis;
        var y2 = 400-4e-4*(elapsed_mot*elapsed_mot -2000*elapsed_mot +1e6);
    
        this.changePosition(mot_x1,mot_y1,x2,y2,color);

        mot_x1 = x2;
        mot_y1 = y2;
    }
    drawAccBar(x_jumper,pgs){
        ctx.fillStyle = 'black';
        ctx.strokeRect(x_jumper-40,426,80,8);
        ctx.fillRect(x_jumper-40,426,0.026666666666666667*pgs,8);
        // pgs是0-3000
    }
    eraseAccBar(x_jumper){
        ctx.clearRect(x_jumper-42,424,84,12);
    }

}

class stage {
    constructor(){
    }
    drawstage(x_left,width){
        ctx.fillStyle = '#e2e2e2';
        ctx.fillRect(x_left,600,width,200);
    }
    erasestage(){
        ctx.clearRect(0,600,800,200);
    }
}

function render_mot() {
    if(game_mode == 1){
        drawHero.jumpFrame(0.2*elapsed_acc,'green');
    }
}

function render_acc() {
    if(game_mode == 1){
        drawHero.drawAccBar(drawHero.posi+25,elapsed_acc);
    }
}

function render_stg() {
    if(game_mode == 1){
        stages.erasestage();    
        stages.drawstage(80,a);
        stages.drawstage(b-110,c);
        if(elapsed_acc && i_mode){
            drawHero.drawJumper(drawHero.posi,0.2*elapsed_acc,0,'rgba(255,255,255,0.2)');
        }//作弊模式代码
    }
}

class back {
    constructor(){
    }

    drawScoreboard(scr) {
        ctx.font="bold 40px Arial";
        ctx.fillText('Score:' + scr,20,45);
    }
    eraseScoreboard() {
        ctx.clearRect(0,0,800,45);
    }
    darwBeginBoard(){
        ctx.clearRect(0,0,800,800);//清空canvas
        ctx.strokeRect(80,300,640,200);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "bold 100px Arial";
        ctx.fillText('Duck小游戏',400,400);
        ctx.font = "bold 40px Arial";
        ctx.textBaseline = 'top';
        ctx.fillText('按s开始游戏',400,600);
        ctx.font = "bold 30px Arial";
        ctx.fillText('使用空格蓄力起跳，跳到对岸吧！',400,655);
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';
    }

    init_back(){
        kd_mode = 0;
        mot_mode = 0;
        stop_mode = 0;
        game_mode = 0;
        i_mode = 0;
        kd_enable = 0;
        score = 0;
        mot_x1 = 0;
        mot_y1 = 0;
        elapsed_acc = 0;
        elapsed_mot = 0;
        kd_enable = 0;
        drawHero.posi=100;

        ctx.clearRect(0,0,800,800);
    }
}

function judger() {
    drawHero.min_dis = b-110
    var max_dis = b-110+c;
    drawHero.jumper_dis = drawHero.posi+25+0.2 * elapsed_acc;
    console.log(drawHero.min_dis);
    console.log(drawHero.jumper_dis);
    console.log(max_dis);
    if ((drawHero.min_dis > drawHero.jumper_dis) || (drawHero.jumper_dis > max_dis)){
        game_mode = 0;
        alert('game over\n'+'score: '+score);
        background.init_back();
        background.darwBeginBoard();
    }
    else {
        score += 100;
        background.eraseScoreboard();
        background.drawScoreboard(score);
        console.log(score);
    }
}

document.onkeydown = function keyd(event) {
    var e = event;
    
    if (e && (e.keyCode == 32) && (mot_mode == 0) && (stop_mode == 0) && (kd_enable == 0)){       
        kd_mode = 1;
    }//按下空格开始计时
}

document.onkeyup = function keyu(event) {
    var e = event;
    if ((e && e.keyCode == 32) && (kd_enable == 0) && game_mode == 1){               
        console.log('you have u space');
        kd_mode = 0;
        kd_enable = 1;
        if(mot_mode == 0){
            start_acc = undefined;
            mot_mode = 1;
            drawHero.eraseAccBar(drawHero.posi+25);
        }
    }//松开空格起跳、停止计时
    if (e && e.keyCode == 73){    
        i_mode = (i_mode == 1)? 0 : 1;
        ctx.clearRect(0,0,800,600);
        render_mot();
        render_acc();
    }//按下i开启作弊模式

    if (e && e.keyCode == 83 && game_mode == 0){    
        game_mode = 1;//打开key
        
        ctx.clearRect(0,0,800,800);//清空canvas
        background.drawScoreboard('0');//绘画初始界面；
        drawHero.drawJumper(drawHero.posi,0,0,'green');
        window.requestAnimationFrame(render);//开始刷帧
    }//按下s开启游戏
}





const drawHero = new jumper();
console.log(drawHero.posi);
const stages = new stage();
const background = new back();

background.darwBeginBoard();
// 游戏未开始画面

//还没开始写的英雄榜部分

//还没开始写的计分方式

//还没开始写的结束动画（在掉到外面的时候在小人底部贴个图）

//还没开始写的在天上飞的bug

