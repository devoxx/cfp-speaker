// Original file by 360, slightly corrected like the main.js used in Angular, 
// used only for the statically generated pages (speakers, schedule)
$(document).ready(function() {

    $("select, input[type=file], input[type=password], input[type=text], input[type=checkbox], input[type=radio], textarea").uniform();

	$(".selector select").css("width","100%");
	
	$(window).resize(function() {
		updateFormElements();
	}); 
	
	
	$('header nav').meanmenu();
	

	$('#carousel ul').bxSlider({
		mode: 'fade',		/* */
		speed: 500,			/* */
		auto: true,			/* */
		minSlides: 1,		/* */
		maxSlides: 1,		/* */
		slideMargin: 0,		/* */
		pause: 4000,		/* timeout between animation */
		moveSlides: 1,		/* number slides to move */
		controls: false, 	/* show prev/next */
		pager: true, 		/* show pager */
		touchEnabled: false,
		swipeThreshold: 5,
		oneToOneTouch: false,
		tickerHover: true,
		adaptiveHeight: true
	});
	
	
	
	$('#news .carousel ul').bxSlider({
		mode: 'horizontal',	/* */
		speed: 500,			/* */
		auto: false,			/* */
		minSlides: 1,		/* */
		maxSlides: 40,		/* */
		slideMargin: 2,		/* */
		pause: 4000,		/* timeout between animation */
		moveSlides: 1,		/* number slides to move */
		controls: true, 	/* show prev/next */
		pager: false, 		/* show pager */
		touchEnabled: false,
		swipeThreshold: 5,
		oneToOneTouch: false,
		slideWidth: 266,
		tickerHover: true,
		adaptiveHeight: true
	});




	$("#tweetwall .carousel ul li:even").addClass("even");
	
	$('#tweetwall .carousel ul').bxSlider({
		mode: 'vertical',	/* */
		speed: 500,			/* */
		auto: true,			/* */
		minSlides: 3,		/* */
		maxSlides: 3,		/* */
		slideMargin: 0,		/* */
		pause: 4000,		/* timeout between animation */
		moveSlides: 1,		/* number slides to move */
		controls: false, 	/* show prev/next */
		pager: false, 		/* show pager */
		touchEnabled: false,
		swipeThreshold: 50,
		oneToOneTouch: false,
		easing: 'ease',
		tickerHover: true,
		adaptiveHeight: true
	});
	
	
	
	
	
	$("header nav ul li.submenu").mouseover(function(){
		$(this).addClass("open");
		$("header #submenu").stop(true,true).animate({height: 45}, 200);
		$(this).find('ul').stop(true,true).fadeIn();
		
	}).mouseleave(function() {		
		$(this).removeClass("open");
		$(this).find('ul').stop(true,true).fadeOut(200);
		$("header #submenu").stop(true,true).animate({height: 0}, 200);		
	});
	
	$("header nav ul li.popup").mouseover(function(){
		$(this).addClass("open");
		$(this).find('ul').stop(true,true).fadeIn(200);
		
	}).mouseleave(function() {		
		$(this).removeClass("open");
		$(this).find('ul').stop(true,true).fadeOut(200);	
	});
	
		
    // Fade in images so there isn't a color "pop" document load and then on window load
    $(".sponsors img").fadeIn(200);

	// Fade in images so there isn't a color "pop" document load and then on window load
	$(".sponsors img")
        .fadeIn(200)
        .each(function(){
            // clone image
            var el = $(this);
            el.wrap("<span class='img_wrapper'>")
                .clone()
                .addClass('img_grayscale')
                .css({"position":"absolute","z-index":"998","opacity":"0"})
                .insertBefore(el)
                .queue(function(){
                    var el = $(this);
                    el.parent()
                      .css({"width":el.width,"height":el.height})
                      .dequeue();
                });
            grayscale(el[0]);
        });

    // Fade image in and out on hover
	$('.img_grayscale').mouseout(function(){
		$(this).stop().animate({opacity:0}, 500);
	}).mouseover(function(){
        $(this).parent().find('img.img_grayscale').stop().animate({opacity:1}, 200);
    });
	
	
	
	
		
	// FAQ accordeon
	$('#accordion .acco_title').click(function() {
		$('#accordion .acco_content').slideUp('normal');	
		$(this).next().slideDown('normal');
	});
		
		
		

});


// Grayscale w canvas method
function grayscale(elem){
	var newImage = new Image();
	newImage.onload = (function(elem, imgObj) {
        return function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = imgObj.width;
            canvas.height = imgObj.height;
            ctx.drawImage(imgObj, 0, 0);
            var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for(var y = 0; y < imgPixels.height; y++){
                for(var x = 0; x < imgPixels.width; x++){
                    var i = (y * 4) * imgPixels.width + x * 4;
                    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                    imgPixels.data[i] = avg;
                    imgPixels.data[i + 1] = avg;
                    imgPixels.data[i + 2] = avg;
                }
            }
            ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
            elem.src = canvas.toDataURL();
        };
    })(elem, newImage);
    newImage.src = elem.src;
}


function updateFormElements() {
	
	$(".selector select").css("width","85%");
	$.uniform.update();
	$(".selector select").css("width","100%");

}

// Used to get presId param on the speaker pages
function getURLParameter(name) {
	return decodeURI(
		(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		);
}