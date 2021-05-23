(function GameWindowReady()
{
	var dcHTL = document.documentElement;
	var gameWindow = document.querySelector('.gameWindow');
	
	gameWindow.style.height = dcHTL.clientHeight + 'px';
	
	var gameWindowWidth = Math.floor(dcHTL.clientHeight / 16 * 9);    //适配全面屏
	if(gameWindowWidth > dcHTL.clientWidth)
	{
		gameWindowWidth = dcHTL.clientWidth;
	}
	gameWindow.style.width = gameWindowWidth + 'px';
})();

window.onload = function() {
var Run = null;
var FlySpeed = 1.6;

//获取背景元素
var _background = document.querySelector('.background');
//获取floor元素
var floorRun = true;
var floorA = document.getElementById('floorA');
var floorB = document.getElementById('floorB');
//获取galo图片元素数组
var galoMove = null;
var animaIdex = 0;
var IsFall = false;
var galoWeight = 20;
var upward = 28;
var galoImgArr = document.querySelectorAll('.galo img');
//获取水管元素
var pipeRun = false;
var pipeArea = 24;  //通过空间百分比
var pipeBoxs = document.querySelectorAll('.pipeBox');
//碰撞字段
var frontPipe = 0;  //记录galo面前的水管
//计分板
var sum = 0;
var sumBox = document.querySelector('.sum').children[0];
//y音乐
var bgm = document.querySelector('.bgm');
var soundEffect = document.querySelector('.Soundeffect');
var deathEffect = document.querySelector('.deathEffect');


//------------------------menu-----------------------------------------------------
var menu = document.querySelector('.menuBox');
var MaxNum = document.querySelector('.menuBox .maxNum');
var Num = document.querySelector('.menuBox .Num');
var menuButton = document.querySelector('.menuBox input');
var NumArr = new Array();
function menuShow(){
	menu.style.display = 'block';
	if(NumArr.length != 0)
	{
		Num.innerHTML = '得分： '+ sum;
		var max = sum;
		for (let i = 0; i < NumArr.length; i++) {
			max = max < NumArr[i] ? NumArr[i] : max
		}
		MaxNum.innerHTML = '历史最高得分： '+ max;
		menuButton.setAttribute('value','重新开始');
	}
}

menuButton.onclick = function () {
	menu.style.display = 'none';
	GameStart();
}


//////////////////////////////////游戏周期函数//////////////////////////////////////
function Start(){
	var gameWindow = document.querySelector('.gameWindow');
	var _width = gameWindow.offsetWidth;
	var _height = Math.floor(_width / 9 * 14);// 除开地板的横宽是9:14
	//背景初始化
	_background.style.width = _width + 'px';
	_background.style.height = _height + 'px';
	//地板初始化  
	floorA.style.bottom = -floorA.offsetHeight + (gameWindow.offsetHeight - _height) + 'px';
	floorB.style.bottom = -floorB.offsetHeight + (gameWindow.offsetHeight - _height) + 'px';
	//galo初始化
	var galo = galoImgArr[0].parentNode;
	galo.style.top = '40%';
	galo.style.left = '16%';
	for(var i = 1; i < galoImgArr.length; i++)
	{
		galoImgArr[i].style.display = 'none';
	}
	//水管初始化
	for(var j = 0; j < pipeBoxs.length; j++)
	{
		pipeBoxs[j].style.left = _width + (j * 4 * pipeBoxs[j].offsetWidth) + 'px';  //(j * 4 * pipeBoxs[j].offsetWidth)表示与上一个的距离
		//------------------改变通过位置----------------
		var pipeHeight = Math.ceil(Math.random() * (95 - pipeArea));  //pipeHeight为上方的百分比  95是给下方设置最低值
		pipeHeight = pipeHeight < 5  ? 5 : pipeHeight;  //设定最低值为5
		var pipe = pipeBoxs[j].children[0];           //上方水管
		pipe.style.top = -pipe.offsetHeight + (_height / 100)*pipeHeight + 'px';  //(_height / 100)*pipeHeight为上方的长度
		pipe = pipeBoxs[j].children[1];                 //下方水管
		pipe.style.top = (_height / 100)*(pipeHeight+pipeArea) + 'px';
	}
}
Start();

function Update(){
	//地板移动------------------------------------------------------------------------------
	if(floorRun)
	{
		floorA.style.left = floorA.offsetLeft - FlySpeed + 'px';
		floorB.style.left = floorB.offsetLeft - FlySpeed + 'px';
		if(floorA.offsetLeft <= -floorA.offsetWidth)
		{
			floorA.style.left = floorB.offsetLeft + floorB.offsetWidth + 'px';
			//floorA.style.left = '100%';
		}
		else if (floorB.offsetLeft <= -floorB.offsetWidth)
		{
			floorB.style.left = floorA.offsetLeft + floorA.offsetWidth + 'px';
			//floorB.style.left = '100%';
		}
		
	}
	//水管移动------------------------------------------------------------------------------
	if(!pipeRun)
	{
		for(var j = 0; j < pipeBoxs.length; j++)
		{
			pipeBoxs[j].style.left = pipeBoxs[j].offsetLeft - FlySpeed + 'px';  
			
			if(pipeBoxs[j].offsetLeft < 0 - pipeBoxs[j].offsetWidth)  //如果水管消失 将跳到最后面
			{

				frontPipe = j == pipeBoxs.length - 1 ? 0 : j + 1;  //获取galo面前的水管  碰撞层使用
				var i = j == 0 ? pipeBoxs.length - 1 : j - 1;   //i是j的前面一个元素
				pipeBoxs[j].style.left = pipeBoxs[i].offsetLeft + (4 * pipeBoxs[j].offsetWidth) + 'px';
				//-------------------改变通过位置--
				var _height = _background.offsetHeight; 
				var pipeHeight = Math.ceil(Math.random() * (95 - pipeArea));  //pipeHeight为上方的百分比
				pipeHeight = pipeHeight < 5 ? 5 : pipeHeight;  //设定最低值为5
				var pipe = pipeBoxs[j].children[0];           //上方水管
				pipe.style.top = -pipe.offsetHeight + (_height / 100)*pipeHeight + 'px';  //(_height / 100)*pipeHeight为上方的长度
				pipe = pipeBoxs[j].children[1];                 //下方水管
				pipe.style.top = (_height / 100)*(pipeHeight+pipeArea) + 'px';
			}
		}
	}
	//galo状态------------------------------------------------------------
	var galo = galoImgArr[0].parentNode;
	var power = -upward + galoWeight;
	power = power > galoWeight ? galoWeight : power;
	if(power > 5)
	{
		IsFall = true;
	}
	galo.style.top = galo.offsetTop + power +'px';
	upward -= 0.5;

	//碰撞-----------------------------------------------------------------------------------------------
	//上下边碰撞
	var galoRigidbody = document.querySelector('.galoRigidbody');

	if((galo.offsetTop + galoRigidbody.offsetTop) < 0)
	{
		galo.style.top = 0;
		 End();
	}
	 else if((galo.offsetTop + galoRigidbody.offsetHeight) > _background.offsetHeight)
	{
		galo.style.top = _background.offsetHeight - galoRigidbody.offsetHeight - 10 + 'px';
		 End();
	}
	 //------水管碰撞-------------------------------
	 var x = 0, y = 0;//记录两矩形边长的和
	 var upPipe = pipeBoxs[frontPipe].children[0];
	 x = galoRigidbody.offsetWidth + upPipe.offsetWidth;
	 y = galoRigidbody.offsetHeight + upPipe.offsetHeight;
	 
	 var x01 = galo.offsetLeft + galoRigidbody.offsetLeft;  var x02 = x01 + galoRigidbody.offsetWidth;
	 var x11 = pipeBoxs[frontPipe].offsetLeft;  var x12 = x11 + pipeBoxs[frontPipe].offsetWidth;
	 var zx = Math.abs(x01 + x02 - x11 - x12);
	 
	 var y01 = galo.offsetTop + galoRigidbody.offsetTop;    var y02 = y01 + galoRigidbody.offsetHeight;
	 var y11 = upPipe.offsetTop;      var y12 = y11 + upPipe.offsetHeight;
	 var zy = Math.abs(y01 + y02 - y11 - y12);
	 if(zx <= x && zy <= y)
	 {
		 End();
	 }
	 
	 //下方水管碰撞  除了pipe的y坐标要改变  其他坐标一样
	  upPipe = pipeBoxs[frontPipe].children[1]
	  y11 = upPipe.offsetTop;   y12 = y11 + upPipe.offsetHeight;
	  zy = Math.abs(y01 + y02 - y11 - y12);
	  if(zx <= x && zy <= y)
	 {
		 End();
	 }
	 
	 //-----------------------计数和难度提升-------------------------------------------
	 if(frontPipe == (sum % pipeBoxs.length) && x02 > x12)     //是否跨过水管
	 {
		 soundEffect.play();
		 sum++;
		 sumBox.innerHTML = sum;
		 FlySpeed += 0.01;
		 pipeArea += 0.02;
	 }

}

(function KeyInput(){
/*	document.body.addEventListener('keydown',function(e){
		console.log(e.keyCode);
		if(e.keyCode == 83)
			{
			if(Run)
			{
				pause();
			}
			else{
				StartForPause();
			}
		}
		else if(e.keyCode == 71)
		{
			 GameStart();
		}
	});*/
	//鼠标点击
	document.body.addEventListener('click', function(){
		if(Run)
		{
			upward = 28;
			IsFall = false;
		}
	})
})();
function End(){
	if(Run)
	{
		window.clearInterval(Run);
	}
	if(galoMove)
	{
		window.clearInterval(galoMove);
	}
	Run = null;
	bgm.pause();
	galoDeathAnima();
	NumArr.push(sum);
	window.setTimeout(menuShow,1000);
	
}

function pause(){
	if(Run)
	{
		window.clearInterval(Run);
	}
	if(galoMove)
	{
		window.clearInterval(galoMove);
	}
	Run = null;
	bgm.pause();
	
}

function StartForPause(){
	Run = window.setInterval(Update,20);
	galoMove = window.setInterval(galoAnima,200);
	bgm.play();
	
}

function GameStart(){
	pause();
	GameDefault();
	Start();
	StartForPause();
}

function GameDefault()
{
	Run = null;
	FlySpeed = 1.6;
	floorRun = true;
	galoMove = null;
	animaIdex = 0;
	IsFall = false;
	galoWeight = 20;
	upward = 28;
	pipeRun = false;
	pipeArea = 24;  //通过空间百分比
	frontPipe = 0;  //记录galo面前的水管
	sum = 0;
	sumBox.innerHTML = sum;
	//soundEffect.setAttribute('src','voice/Sound2.mp3');
	bgm.currentTime = 0; // 重新播放
}





//////////////////////////////动画功能函数////////////////////////////////////////////
function galoAnima()
{
	//galo动画
	if(!IsFall)
	{
		galoImgArr[animaIdex].style.display = 'none';
		animaIdex = animaIdex >= galoImgArr.length - 1 ? 0 : animaIdex + 1;
		galoImgArr[animaIdex].style.display = 'block';
	}
	else
	{
		galoImgArr[animaIdex].style.display = 'none';
		animaIdex = 0;
		galoImgArr[animaIdex].style.display = 'block';
	}
}

var DeathAnima = null;
function galoDeathAnima(){
		//换图
		galoImgArr[animaIdex].style.display = 'none';
		animaIdex = 0;
		galoImgArr[animaIdex].style.display = 'block';

		//坠落动画
		DeathAnima = window.setInterval(function(){
			var galo = galoImgArr[0].parentNode;
			var galoRigidbody = document.querySelector('.galoRigidbody');
			galo.style.top = galo.offsetTop + 8 +'px';
			if((galo.offsetTop + galoRigidbody.offsetHeight) > _background.offsetHeight)
			{
				galo.style.top = _background.offsetHeight - galoRigidbody.offsetHeight - 10 + 'px';
				window.clearInterval(DeathAnima);
			}
		},10)
		deathEffect.play();		
}


}