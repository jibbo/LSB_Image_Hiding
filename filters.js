var getCanvas = function(w,h) {
	var c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return c;
};
var getPixels = function(img) {
	var c = this.getCanvas(img.width, img.height);
	var ctx = c.getContext('2d');
	ctx.drawImage(img,0,0,img.width,img.height);
	return ctx.getImageData(0,0,c.width,c.height).data;
};

//Insert the watermark  	
var lsb_replace = function (n,m,orig,water,out) {
  //set all the variables
  var img = document.getElementById(orig);
  var wimg = document.getElementById(water);
  var opx = getPixels(img);
  var wpx = getPixels(wimg);
  var c=document.getElementById(out);
  c.width = img.width;
  c.height = img.height;
  var ctx=c.getContext("2d");
  var imgData=ctx.createImageData(img.width,img.height);
  layer = n-1;
  m-=1;
  image_mask = 255-Math.pow(2,layer);

  //interesting part.
  for(i=0;i<imgData.data.length;i++){
  	imgData.data[i] = opx[i] & image_mask;
  	//is the bit set in the watermark layer?
  	if(wpx[i] & (1<<m))
  		//set the bit to 1
  		imgData.data[i] |=  (1<<layer);
  }
  ctx.putImageData(imgData,0,0);
}

//Read the watermark
var lsb_extract = function (n,m,orig,out) {
  //set all the variables
  var img = document.getElementById(orig);
  var opx = getPixels(img);
  var c=document.getElementById(out);
  c.width = img.width;
  c.height = img.height;
  var ctx=c.getContext("2d");
  var imgData=ctx.createImageData(img.width,img.height);
  layer = n-1;

  //interesting part
  for(i=0;i<imgData.data.length;i++){
    //is the bit in the layer set?
    if((opx[i]>>layer) & 1)
      //set the most significant bit.
      imgData.data[i] |=(1<<8);  
  }
  ctx.putImageData(imgData,0,0);
}