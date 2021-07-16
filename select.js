window.onload = function (){
  if(!is_mobile()){
    var logo = document.querySelector('.logo');
    logo.style.width = "258px";
    logo.style.height = "104px"

    document.querySelector('header').style.paddingBottom = "27px";
    document.querySelector('.version').style.bottom = "27px";

    var info = document.querySelector('.info');
    info.style.width = "600px";
    info.style.flexDirection = "row-reverse";
    info.style.justifyContent = "space-between";
    info.style.paddingBottom = "20px";

    var user = document.getElementsByClassName('user');
    for(var i = 0; i < user.length; i++){
      user[i].style.width = "296px";
    }

    var btn = document.getElementsByClassName('tabBtn');
    for(var i = 0; i < btn.length; i++){
      btn[i].style.width = "200px";
    }

    document.querySelector('.typeTab').style.width = "600px";

    var orangebox = document.getElementsByClassName('orangebox');
    for(var i = 0; i < orangebox.length; i++){
      orangebox[i].style.width = "600px";
      orangebox[i].style.height = "547px";
    }

    document.querySelector('.upTxt').style.marginTop = "12px";

    var msgBox = document.querySelector('.msgBox');
    msgBox.style.width = "600px";
    msgBox.style.height = "45px";
    msgBox.style.fontSize = "16px";
    msgBox.style.marginBottom = "20px"

    var sendBtn = document.querySelector('.sendBtn');
    sendBtn.style.width = "600px";
    sendBtn.style.height = "45px";
    sendBtn.style.borderRadius = "23px";

    var sendIcon = document.querySelector('.sendIcon');
    sendIcon.style.width = "19.71px";
    sendIcon.style.height = "20px";
    sendIcon.style.marginRight = "10.88px";

    //var cropPointer = document.querySelector('.cropper-point.point-se');
    //cropPointer.style.width = "22px";
    //cropPointer.style.height = "22px";
    
  }
}

function is_mobile()
{
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
  }
  
  if (typeof window.orientation !== 'undefined') {
    return true;
  }
  
  var iOSios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if(iOSios)
    return true;

  return false;    
}

var picture = document.querySelector('.picture');
var upPicBox = document.querySelector('.upPicBox');
var showPic = document.querySelector('.showPic');
var result = document.querySelector('.result');
var editBtn = document.querySelector('.editBtn');
var toggleBtn = document.querySelector('#toggleBtn')
var msgBox = document.querySelector('.msgBox');
var original_image_file = null;

function load_image(input){
  if(!input.files[0]) return;
  else{
    upPicBox.style.display = "none";

    var newImage = document.createElement("img");
    newImage.setAttribute("id", 'newPic');

    var file = input.files[0];
    original_image_file = file;
    newImage.src = URL.createObjectURL(file);

    showPic.appendChild(newImage);

    showPic.style.display = "block";
    picture.style.marginBottom = "0px";
    var opt = document.getElementsByClassName('option');
    for(var i = 0; i < opt.length; i++){
      opt[i].style.display = "block";
    }

    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newImage.style.objectFit = "contain";
    //newImage.style.objectFit = "cover";
    //container.style.overflow = "hidden";
    newImage.style.filter = "none";
    //newImage.style.maxWidth = "100%";

    edit_image();

    editBtn.style.display = "flex";
    if(!is_mobile()){ editBtn.style.top = "502px"; }
  }
}

var cropper;

function edit_image(){
  const image = document.getElementById('newPic');
  cropper = new Cropper(image, {
    viewMode: 1,
    dragMode: 'move', //cropper 바깥에서 마우스로 사진 이동
    aspectRatio: 16 / 9, //cropper 비율
    //중앙 표시, 그리드부분 밝게, 배경 체크무늬 없게
    center: false,
    highlight: false,
    background: false,
    autoCropArea: 1, //초기 cropper 크기
    crop(event) {},
  });
}

var commands = [];  //버튼 명령을 저장하는 배열
var newCanvas = null; //자른 이미지 놓을 canvas
var btnDisable = false; //크롭 확인 버튼 비활성화

function toggle_cropper(){
  if(toggleBtn.getAttribute('value') === 'on'){
    toggle_set();
  }
  else{
    toggle_reset();
  }
}
function toggle_reset(){
  cropper.crop();
  btnDisable = false;
  toggleBtn.setAttribute('value', 'on');
  toggleBtn.setAttribute('src', 'img/toggle_grid_on@3x.png');
}
function toggle_set(){
  cropper.clear();
  btnDisable = true;
  toggleBtn.setAttribute('value', 'off');
  toggleBtn.setAttribute('src', 'img/toggle_grid_off@3x.png');
}

function rotateLeft(){
  cropper.rotate(-90);
  commands.push("rotate_L");
}

function rotateRight(){
  cropper.rotate(90);
  commands.push("rotate_R");
}

function get_image(){
  if(btnDisable){return;}
  else{
    newCanvas = null;
    newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", 'newCanvas');

    if(is_mobile()){
      newCanvas = cropper.getCroppedCanvas({
        width: 297,
        height: 359
      });
    }
    else{
      newCanvas = cropper.getCroppedCanvas({
      width: 594,
      height: 541
    });
    }
    
    result.appendChild(newCanvas);

    result.style.display = "flex";
    result.style.alignItems = "center";
    showPic.style.display = "none";
    btnDisable = true;
    commands.push("done");
  }
}

function undo(){
  var lastCommand = commands.pop();
  if(!lastCommand) return;
  switch(lastCommand){
    case "rotate_L":
      cropper.rotate(90);
      break;
    case "rotate_R":
      cropper.rotate(-90);
      break;
    case "done":
      showPic.style.display = "block";
      result.style.display = "none";
      while (result.firstChild) {
        result.removeChild(result.firstChild);
      }
      newCanvas = null;
      btnDisable = false;
      break;
  }
}

function reset_image_box(){
  //편집 버튼, 이미지창, 메시지칸, 확인버튼 안보이도록
  editBtn.style.display = "none";
  result.style.display = "none";
  var opt = document.getElementsByClassName('option');
  for(var i = 0; i < opt.length; i++){
    opt[i].style.display = "none";
  }
  //업로드 박스 다시 보이도록
  upPicBox.style.display = "block";
  picture.style.marginBottom = "30px";
  //이전 이미지 지우고 메시지, 명령배열 등 초기화
  while (showPic.firstChild) {
    showPic.removeChild(showPic.firstChild);
  }
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }  
  newCanvas = null;
  msgBox.value='';
  btnDisable = false;
  commands = [];
  toggle_reset();
}

function cancelUpload(){
  cropper.destroy();
  showPic.style.display = "none";
  reset_image_box();
}

function upload_image(){
  //추출그리드 off인 경우
  if(toggleBtn.getAttribute('value') == 'off'){
    // newCanvas = null;
    // newCanvas = document.createElement("canvas");
    // newCanvas.setAttribute("id", 'newCanvas');

    // var ctx = newCanvas.getContext('2d');
    // var targetImage = document.querySelector('.cropper-container img');
    
    // ctx.drawImage(targetImage, 0, 0);
    
    //newCanvas = document.querySelector('.cropper-container img');
    newCanvas = document.querySelector('#newPic');
    newCanvas.classList.remove('cropper-hidden');

    result.appendChild(newCanvas);

    result.style.display = "flex";
    result.style.alignItems = "center";
    result.style.justifyContent = "center";
    showPic.style.display = "none";
    toggleBtn.setAttribute('value', 'on');
  }
  //영역을 선택하지 않았을 때
  if(newCanvas == null){
    alert("영역을 선택하세요");
    return;
  }
  //메시지를 입력하지 않았을 때
  var msg = msgBox.value.trim();
  console.log(msg);
  if(msg == null || msg == ""){
    alert("메시지를 입력하세요");
    return;
  }
/*
  try{
    if(!btnDisable)
      parent.sunny.uploadToGD_base64(newCanvas.toDataURL("image/PNG",1),msg);
    else
    {

      parent. document.getElementById("sunny_spinner").classList.remove("d-none");
      {
        parent.sunny.send_orginal_image_v2("audience_photo",original_image_file,"Canvas1","Canvas2",msg,function(rst){
        });
      
      }
      
      

    }
  }
  catch(err)
  {

  }
*/  
  //parent.sunny.uploadToGD_base64(newCanvas.toDataURL("image/PNG",1),msg,);

  reset_image_box();
}