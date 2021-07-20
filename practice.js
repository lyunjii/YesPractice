var canvas = document.querySelector('.canvas');
var ctx = canvas.getContext('2d');
var target = new Image();

var showPic = document.querySelector('.showPic');
var rotateCount = 0;
var imageWidth = imageHeight = 0;
var original_image_file = null;
var original_src = null;

function draw(){
  canvas.width = target.width;
  canvas.height = target.height;
  ctx.drawImage(target, 0, 0);
}
function left(){
  canvas.width = target.height;
  canvas.height = target.width;
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.rotate((Math.PI / 180) * 270);
	ctx.drawImage(target, -(target.width/2), -(target.height/2));
  rotateCount--;
}
function right(){
  canvas.width = target.height;
  canvas.height = target.width;
	ctx.translate(canvas.width/2, canvas.height/2);
  ctx.rotate((Math.PI / 180) * 90);
	ctx.drawImage(target, -(target.width/2), -(target.height/2));
  rotateCount++;
}
function upside(){
  canvas.width = target.width;
  canvas.height = target.height;
  ctx.rotate((Math.PI / 180) * 180);
  //ctx.drawImage(target, 0, 0);
  ctx.drawImage(target, -target.width, -target.height);
}

function load_image(input){
  if(!input.files[0]) return;
  else{
    var newImage = document.createElement("img");
    newImage.setAttribute("id", 'newPic');

    var file = input.files[0];
    original_image_file = file;
    newImage.src = URL.createObjectURL(file);
    //original_src = URL.createObjectURL(file);

    var fileReader = new FileReader();
    fileReader.onload = function(e){
      var tmp = new Image();
      tmp.src = e.target.result;
      tmp.onload = function(){
        target.src = original_src = this.src;
        target.width = imageWidth = this.width;
        target.height = imageHeight = this.height;
        
        //URL.createObjectURL(file);
      };
    }
    fileReader.readAsDataURL(file);

    showPic.appendChild(newImage);
    
  }
}

function rotateOriginal(){
  var originalCanvas = document.querySelector("#originalCanvas");
  var originalContext = originalCanvas.getContext('2d');
  var originalImage = new Image();
  var editedWidth = editedHeight = 0;
  var originalRatio = imageWidth / imageHeight;
  
  originalImage.src = original_src;//URL.createObjectURL(original_image_file);
  originalImage.width = imageWidth;
  originalImage.height = imageHeight;
  //originalContext.clearRect(0, 0, imageWidth, imageHeight);
  
  var rotate = rotateCount % 4;
  if (rotate < 0) rotate += 4;

  originalCanvas.style.display = "block";

  if(rotate==0 || rotate==2){
    if(originalRatio < 16/9){
      editedHeight = originalCanvas.height;
      editedWidth = editedHeight * originalRatio;
    }
    else{
      editedWidth = originalCanvas.width;
      editedHeight = editedWidth / originalRatio;
    }
  }
  else{
    if(originalRatio < 9/16){
      editedHeight = originalCanvas.width;
      editedWidth = editedHeight * originalRatio;
    }
    else{
      editedWidth = originalCanvas.height;
      editedHeight = editedWidth / originalRatio;
    }
  }
  
  originalContext.filter = 'blur(50px)';
  switch(rotate){
    case 0:
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
      originalContext.filter = 'none';
      if(originalRatio < 16/9){
        originalContext.drawImage(originalImage, (originalCanvas.width-editedWidth)/2, 0, editedWidth, editedHeight);
      }
      else{
        originalContext.drawImage(originalImage, 0, (originalCanvas.height-editedHeight)/2, editedWidth, editedHeight);
      }
      break;
    case 1:
      originalContext.rotate((Math.PI / 180) * 90);
      originalContext.translate(0, -originalCanvas.width);
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.height, originalCanvas.width);
      originalContext.filter = "none";
      if(originalRatio < 9/16){
        originalContext.drawImage(originalImage, (originalCanvas.height-editedWidth)/2, 0, editedWidth, editedHeight);
      }
      else{
        originalContext.drawImage(originalImage, 0, (originalCanvas.width-editedHeight)/2, editedWidth, editedHeight);
      }
      break;
    case 2:
      originalContext.rotate((Math.PI / 180) * 180);
      originalContext.translate(-originalCanvas.width, -originalCanvas.height);
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
      originalContext.filter = 'none';
      if(originalRatio < 16/9){
        originalContext.drawImage(originalImage, (originalCanvas.width-editedWidth)/2, 0, editedWidth, editedHeight);
      }
      else{
        originalContext.drawImage(originalImage, 0, (originalCanvas.height-editedHeight)/2, editedWidth, editedHeight);
      }
      break;
    case 3:
      originalContext.rotate((Math.PI / 180) * 270);
      originalContext.translate(-originalCanvas.height, 0);
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.height, originalCanvas.width);
      originalContext.filter = 'none';
      if(originalRatio < 9/16){
        originalContext.drawImage(originalImage, (originalCanvas.height-editedWidth)/2, 0, editedWidth, editedHeight);
      }
      else{
        originalContext.drawImage(originalImage, 0, (originalCanvas.width-editedHeight)/2, editedWidth, editedHeight);
        }
      break;  
  }
}