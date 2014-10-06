$(document).ready(function(){

	//TODO replace this things with two fixed
	// img tags.
	ID_PREFIX= "id_"
	imgid=0;
	
	//count of image uploaded
	times=0;

	//watermark's layer
	inslay=8;

	// original image's layer
	replay=4;

	var createImage = function(file,elem){
		var img = document.createElement("img");
	    $(img).attr("src",file);
	    $(img).attr('id', ID_PREFIX+imgid);
	    imgid++;
	    $(elem).append(img);
	    return img;
	}

	var lsb = function(){
		$("#out").show();
		lsb_replace(replay,inslay,"id_0","id_1","elab");
		lsb_extract(replay,inslay,"elab","extract");
	}

	//display images and starts the lsb technique
	var addImage = function(file,elem){
		var img = createImage(file,elem);

		//caman transorfms the image to greyscale
		//and also transorm an img elemnt to a canvas
		Caman("#"+$(img).attr('id'),function(){
			this.greyscale().render(function(){
				times++;
				if(times>1)
					lsb();
			});
		});

	}

	var showError = function(){
		$("#error").slideDown();
        setTimeout(function() {$("#error").slideUp();}, 10000);
	}
	var handleFile = function(files,obj)
	{
		var f= files[0];

		//is the file an image?
		if (f.type.match('image.*')) {

	        var reader = new FileReader();

	      	reader.onloadend = function(e){
	      		if (e.target.readyState == FileReader.DONE) {
	      			//ok, let's do stuff with it.
	      			addImage(e.target.result,$("#imgs"));
		      		$(obj).hide();
				}
	      	}
	      	reader.onerror = function(event) {
	      		console.log("READ ERROR: "+event.target.error.code);
            	showError();
        	};
	        // Read in the image file as a data URL.
	        reader.readAsDataURL(f);
  		}
  		else{
  			showError();
  		}
    }


	var manageEvt = function(e){
		e.stopPropagation();
		e.preventDefault();
	}

    var enableDragAndDrop= function(elem){
	    $(elem).on('dragenter', function (e) 
		{
			manageEvt(e);
			$(this).addClass('drop-enter');
		});

		$(elem).on('dragover', function (e) 
		{
			manageEvt(e);
		});

		$(elem).on('drop', function (e) 
		{

			$(this).removeClass('drop-enter');
			manageEvt(e);
			var files = e.originalEvent.dataTransfer.files;
		    handleFile(files,$(this));

		    //asks for the watermark
		    if($(elem).attr('id')=="droparea1"){
		    	enableDragAndDrop($("#droparea2"));
		    	$("#droparea2").fadeIn();
		    }
	 	});
    }

	var checkFileAPI = function(){
		if(!(window.File && window.FileReader && window.FileList && window.Blob)){
			$("#dragandrophandler").fadeOut();
			$("#out").fadeIn(function(){
				$("#out").html("Come on, get a newer browser! =)");
			});
		}
	}

	$("#ins_layer").on("change mousemove",function(event) {
		inslay=$(this).val();
		$("#inslay").html(inslay);
		lsb();
	});
	$("#rep_layer").on("change mousemove",function(event) {
		replay=$(this).val();
		$("#replay").html(replay);
		lsb();
	});

    checkFileAPI();
    enableDragAndDrop($("#droparea1"));
	
});