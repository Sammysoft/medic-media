jQuery(document).ready(function($){
	"use strict";

    function alignModal(){
        var modalDialog = $(this).find(".modal-dialog");        
        // Applying the top margin on modal dialog to align it vertically center
        modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
    }

    // Align modal when it is displayed
    $(".modal").on("shown.bs.modal", alignModal);
    
    // Align modal when user resize the window
    $(window).on("resize", function(){
        $(".modal:visible").each(alignModal);
    });   

	$('.rt-content, .rt-sidebar').theiaStickySidebar({
		  // Settings
		  additionalMarginTop: 200,
		  additionalMarginBottom: 200
		});
	  
	//*loadmore ajax*/
	$('.departments_info').on('click', 'a.departments_title', function(e){
		e.preventDefault();
		var _this = $(this),
			id = _this.data('id'),
			target = _this.parents('#department-lode-area').find('.sigle-department-data');

		$.ajax({
			url: medilinkObj.ajaxurl,
			data: { action : 'rt_single_department', id: id},
			type: 'POST',
			beforeSend: function(){
				target.find('.loading').fadeIn('slow');
			},
			success: function(resp){
				target.find('.loading').fadeOut('slow');
				target.html(resp.html);				
			},
			error: function(e){
			}
		});
		return false;
	});
	
	$('.loadmore').on('click', 'a.rt-loadmore', function(e){
		e.preventDefault();
		var _this = $(this),
		container = _this.parents('.rt-departments'),
		wtgetData = container.data("settings"),
		paged = container.attr('data-paged'),
		contentWrap = container.find('.menu-list'),
		loadmore = container.find('.loadmore'),				
		loadmorebtntxt= loadmore.find('a').text();
		$.ajax({
			url: medilinkObj.ajaxurl,
			data: { action : 'rt_loadmore_department', data: wtgetData, page: parseInt(paged, 10)},
			type: 'POST',
			beforeSend: function(){
				loadmore.find('a').text('Loading...');					
			},
			success: function(resp){
				console.log(resp);
				container.attr('data-paged', parseInt(resp.page));
				if(resp.remaining){
					loadmore.find('a').text(loadmorebtntxt);
				}else{
					loadmore.find('a').text('No data remaining').attr('disabled', true);
				}	
				var t = $(resp.html)
				t.find('.rtin-item').addClass('test');						
				contentWrap.append(resp.html);				
			},
			error: function(e){
				console.log(e);
			}
		});

	});

  //Header Search
    $('a[href="#header-search"]').on("click", function (event) {
        event.preventDefault();
        $("#header-search").addClass("open");
        $('#header-search > form > input[type="search"]').focus();
    });

    $("#header-search, #header-search button.close").on("click keyup", function (event) {
        if (
            event.target === this ||
            event.target.className === "close" ||
            event.keyCode === 27
        ) {
            $(this).removeClass("open");
        }
    });

	
	/* Scroll to top */
	$('.scrollToTop').on('click',function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});

	/* Nav smooth scroll */
	$('#site-navigation .menu').onePageNav({
		extraOffset: medilinkObj.extraOffset,
	});

	/* Search Box */
	$(".search-box-area").on('click', '.search-button, .search-close', function(event){
		event.preventDefault();
		if($('.search-text').hasClass('active')){
			$('.search-text, .search-close').removeClass('active');
		}
		else{
			$('.search-text, .search-close').addClass('active');
		}
		return false;
	});



    /*-------------------------------------
    Menu fixded
    -------------------------------------*/
    if ($('header .header-main').length && $('header .header-main').hasClass('header-sticky')) {
        var header_position = $('header .header-main').offset(),
            lastScroll = 100;
        $(window).on('scroll load', function (event) {
            var st = $(this).scrollTop();
            if (st > header_position.top) {
                ($(".header-table").length) ? $('header .header-table').addClass("header-fixed"): $('header .header-main').addClass("header-fixed");
            } else {
                ($(".header-table").length) ? $('header .header-table').removeClass("header-fixed"): $('header .header-main').removeClass("header-fixed");
            }
            if (st > lastScroll && st > header_position.top) {
                ($(".header-table").length) ? $('header .header-table').addClass("hidden-menu"): $('header .header-main').addClass("hidden-menu");
            } else if (st <= lastScroll) {
                ($(".header-table").length) ? $('header .header-table').removeClass("hidden-menu"): $('header .header-main').removeClass("hidden-menu");
            }
            lastScroll = st;
            if (st === 0) {
                ($(".header-table").length) ? $('header .header-table').removeClass("header-fixed"): $('header .header-main').removeClass("header-fixed");
            }
        });
    }

		var  makeSticky = function() {
			if ($(".masthead-container").length > 0) {
				var stc 	= $(".site-content ");
				var out 	= $(".site-header");
				var headertop 	= $(".header-top-bar");
				var s 			= $(".masthead-container");
				var sw 			= $(".non-trheader .site-wrp");
				var pos 		= stc.position();
				var tHeight 	= out.outerHeight();
				$(window).scroll(function() {
				var windowpos = $(window).scrollTop();
				if (windowpos >= pos.top + 1) {
				    //s.removeClass("animated fadeIn");
				    sw.removeClass("opt-slideInUp");
				    s.addClass("stick animated slideInDown");
				    sw.addClass("opt-slideInUp");			
					sw.css('padding-top', tHeight + 'px');	
				    headertop.addClass("animated slideInDown");	
				} else {
				    s.removeClass("stick animated slideInDown");
				    //s.addClass("animated slideInUp");
				    sw.removeClass("opt-slideInUp");
				    headertop.removeClass("animated slideInDown");
				     //s.addClass("animated fadeIn");
				    sw.css('padding-top', 0);
				}
				});
			}
		}
		if ( $('body').hasClass('non-stick') ) {
			makeSticky();
		}


		/* MeanMenu - Mobile Menu */
		/*$('#site-navigation nav').meanmenu({
		meanMenuContainer: '#meanmenu',
		meanScreenWidth: medilinkObj.meanWidth,
		removeElements: "#masthead",
		siteLogo: medilinkObj.siteLogo
		});
		*/

	/* Header Right Menu */
	$('.additional-menu-area').on('click', '.side-menu-trigger', function (e) {
		e.preventDefault();
		var width = $('.sidenav').width();
		if (width==280) {
			$('.sidenav').width(0);
		}
		else{
			$('.sidenav').width(280);
		}
	});
	$('.additional-menu-area').on('click', '.closebtn', function (e) {
		e.preventDefault();
		$('.sidenav').width(0);
	});

	/* Mega Menu */
	$('.site-header .main-navigation ul > li.mega-menu').each(function() {
        // total num of columns
        var items = $(this).find(' > ul.sub-menu > li').length;
        // screen width
        var bodyWidth = $('body').outerWidth();
        // main menu link width
        var parentLinkWidth = $(this).find(' > a').outerWidth();
        // main menu position from left
        var parentLinkpos = $(this).find(' > a').offset().left;

        var width = items * 220;
        var left  = (width/2) - (parentLinkWidth/2);

        var linkleftWidth  = parentLinkpos + (parentLinkWidth/2);
        var linkRightWidth = bodyWidth - ( parentLinkpos + parentLinkWidth );

        // exceeds left screen
        if( (width/2)>linkleftWidth ){
        	$(this).find(' > ul.sub-menu').css({
        		width: width + 'px',
        		right: 'inherit',
        		left:  '-' + parentLinkpos + 'px'
        	});        
        }
        // exceeds right screen
        else if ( (width/2)>linkRightWidth ) {
        	$(this).find(' > ul.sub-menu').css({
        		width: width + 'px',
        		left: 'inherit',
        		right:  '-' + linkRightWidth + 'px'
        	}); 
        }
        else{
        	$(this).find(' > ul.sub-menu').css({
        		width: width + 'px',
        		left:  '-' + left + 'px'
        	});            
        }
    });
	// Scripts needs loading inside content area
	rdtheme_content_ready_scripts();
	/* WooCommerce */
	rdtheme_wc_scripts($);
	rdtheme_imgslider_scripts($);

});

(function($){
	"use strict";
    
    /*-------------------------------------
     Select2 activation code
     -------------------------------------*/
    if ($('select.select2').length) {
        $('select.select2').select2({
            theme: 'classic',
            dropdownAutoWidth: true,
            width: '100%'
        });
    }
    // Window Load+Resize
    $(window).on('load resize', function () {
        // Define the maximum height for mobile menu
        var wHeight = $(window).height();
        wHeight = wHeight - 50;
        $('.mean-nav > ul').css('max-height', wHeight + 'px');
    });

    // Window Load
    $(window).on('load', function () {
    	// Owl Slider
    	rdtheme_content_load_scripts();
        // Preloader
        $('#preloader').fadeOut('slow', function () {
        	$(this).remove();
        });
        
        // Onepage Nav on meanmenu
        $('#meanmenu .menu').onePageNav({
        	extraOffset: medilinkObj.extraOffsetMobile,
        	end: function() {
        		$('.meanclose').trigger('click');
        	} 
        });
        	rdtheme_imgslider_scripts();
    });
    // Slider Resize
    $(window).on('resize', function () {
    	rdtheme_slider_fullscreen();
    		rdtheme_imgslider_scripts();
    });

    // Sticky Menu Resize
    $(window).on('resize', function () {   
	if ($(".masthead-container").length > 0) {
			var s = $(".masthead-container");
			var sw = $(".site-wrp");
			var pos = s.position();
			var tHeight = s.outerHeight();
			$(window).scroll(function() {
			var windowpos = $(window).scrollTop();
			if (windowpos >= pos.top + 1) {
			    s.removeClass("slideInUp");
			    sw.removeClass("opt-slideInUp");
			    s.addClass("stick animated slideInDown");
			    sw.addClass("opt-slideInUp");			
				//sw.css('padding-top', tHeight + 'px');				
			} else {
			    s.removeClass("stick animated slideInDown");
			    sw.removeClass("opt-slideInUp");
			    s.addClass("animated slideInUpCustonAnimetion");
			    //sw.css('padding-top', 0);
			}
			});
		}
   	
    });

	// Elementor
	$( window ).on( 'elementor/frontend/init', function() {
		if (elementorFrontend.isEditMode()) { 
			elementorFrontend.hooks.addAction( 'frontend/element_ready/widget', function(){
				rdtheme_content_ready_scripts()
				rdtheme_content_load_scripts();
				rdtheme_imgslider_scripts();

			} );
		}
	} );

})(jQuery);


function rdtheme_content_ready_scripts(){
	var $ = jQuery;
	
	/* Counter */
	if ( typeof $.fn.counterUp == 'function') {
		$('.rt-el-counter .rt-counter-num').counterUp({
			delay: $(this).data('rtsteps'),
			time: $(this).data('rtspeed')
		});
	}

		/* Slider */
		if ( typeof $.fn.nivoSlider == 'function') {
			$('.rt-nivoslider').nivoSlider({
				effect: 'boxRainReverse',
				slices: 15,
				boxCols: 8,
				boxRows: 4,
				animSpeed: 500,
				pauseTime: 3000,
				startSlide: 0,
				directionNav: true,
				controlNav: true,
				controlNavThumbs: false,
				pauseOnHover: false,
				manualAdvance: true,
				prevText: '',
				nextText: '',
				randomStart: false,
				beforeChange: function() {},
				afterChange: function() {},
				slideshowEnd: function() {},
				lastSlide: function() {},
				afterLoad: function() {}
			});
			rdtheme_slider_fullscreen();
		}
	}

function rdtheme_content_load_scripts(){
	var $ = jQuery;

	//Parallax Scene for Icons
	if($('.parallax-scene-1').length){
		var scene = $('.parallax-scene-1').get(0);
		var parallaxInstance = new Parallax(scene);
	}
	if($('.parallax-scene-2').length){
		var scene = $('.parallax-scene-2').get(0);
		var parallaxInstance = new Parallax(scene);
	}
	if($('.parallax-scene-3').length){
		var scene = $('.parallax-scene-3').get(0);
		var parallaxInstance = new Parallax(scene);
	}

	if($('.rt-paroller').length){
		$('.rt-paroller').paroller({
		});
	}


 /* MeanMenu - Mobile Menu */
	$('#site-navigation nav').meanmenu({
		meanMenuContainer: '#meanmenu',
		meanScreenWidth: medilinkObj.meanWidth,
		removeElements: "#masthead",
		siteLogo: medilinkObj.siteLogo
	});

 //Slick Carousel 
		var slickOptions1 = {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,   
            autoplay: false,
            asNavFor: '.carousel-nav',
            prevArrow: '<span class="slick-prev slick-navigation"><i class="fa fa-angle-left" aria-hidden="true"></i></span>',
            nextArrow: '<span class="slick-next slick-navigation"><i class="fa fa-angle-right" aria-hidden="true"></i></span>'
        }
        var slickOptions2 = {
                slidesToShow: 5,
                slidesToScroll: 1,
                asNavFor: '.carousel-content',
                dots: false,
                arrows: true,
                prevArrow: true,
                nextArrow: true,     
                centerPadding: '0px',
                focusOnSelect: true,
                responsive: [{
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                }, {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                }, {
                    breakpoint: 479,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }]
            }

        if ( medilinkObj.rtl == 'yes' ) {
        	// options 1
        	slickOptions1.rtl = true;
        	slickOptions1.prevArrow = '<span class="slick-prev slick-navigation"><i class="fa fa-angle-right" aria-hidden="true"></i></span>';
        	slickOptions1.nextArrow = '<span class="slick-next slick-navigation"><i class="fa fa-angle-left" aria-hidden="true"></i></span>';

        	// options 2
        	slickOptions2.rtl = true;

		}
		console.log('slickOptions2', slickOptions2);
        var SlickCarousel = $('.slick-carousel-wrap');
        if (SlickCarousel.length) {
            SlickCarousel.find('.carousel-content').slick(slickOptions1);
            SlickCarousel.find('.carousel-nav').slick(slickOptions2);
        }

       
	 /*-------------------------------------
        Masonry
        -------------------------------------*/
        var galleryIsoContainer = $('.no-equal-gallery');
        if (galleryIsoContainer.length) {
            var blogGallerIso = galleryIsoContainer.imagesLoaded(function() {
                blogGallerIso.isotope({
                    itemSelector: '.no-equal-item',
                    masonry: {
                        columnWidth: '.no-equal-item'
                    }
                });
            });
        }
	
	 /*-------------------------------------
    Popup
    -------------------------------------*/
    var yPopup = $(".popup-youtube");
    if (yPopup.length) {
        yPopup.magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }
    if ($('.zoom-gallery').length) {
        $('.zoom-gallery').each(function () { // the containers for all your galleries
            $(this).magnificPopup({
                delegate: 'a.ne-zoom', // the selector for gallery item
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });
    }
    
	/* Owl Slider */
	if (typeof $.fn.owlCarousel == 'function') { 

		$(".owl-custom-nav .owl-next").on('click',function(){
			$(this).closest('.owl-wrap').find('.owl-carousel').trigger('next.owl.carousel');
		});
		$(".owl-custom-nav .owl-prev").on('click',function(){
			$(this).closest('.owl-wrap').find('.owl-carousel').trigger('prev.owl.carousel');
		});

		$(".rt-owl-carousel").each(function() {
			var options = $(this).data('carousel-options');
			if ( medilinkObj.rtl == 'yes' ) {
			    options['rtl'] = true; //@rtl
			    options['navText'] = ["<i class='fa fa-angle-right'></i>","<i class='fa fa-angle-left'></i>"];
			}
			$(this).owlCarousel(options);
		});
	}

    /* Isotope */
   /* var $grid = $('.rt-masonry-grid').imagesLoaded( function() {
	$grid.masonry({
			// set itemSelector so .grid-sizer is not used in layout
			itemSelector: '.rt-grid-item',
			// use element for option
			columnWidth: '.rt-grid-sizer',
			percentPosition: true
		});
	});*/




    if (typeof $.fn.isotope == 'function') {
    	var $rtGalleryContainer = $('.rt-isotope-wrapper .rt-isotope-content');
    	$rtGalleryContainer.isotope({
    		filter: '*',
    		animationOptions: {
    			duration: 750,
    			easing: 'linear',
    			queue: false
    		}
    	});

		$('.rt-isotope-tab a').on('click',function(){
			var $parent = $(this).closest('.rt-isotope-wrapper'),
			selector = $(this).attr('data-filter');

			$parent.find('.rt-isotope-tab .current').removeClass('current');
			$(this).addClass('current');     
			$isotope_instance = $parent.find('.rt-isotope-content').isotope({
				filter: selector,
				getSortData: {
					custom_order: '[data-custom_order]', // value of attribute   
				},
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});
			//console.log('isotope_instance', $isotope_instance);			
			setTimeout(function () {			  
			  $isotope_instance.isotope({ sortBy : 'custom_order' });
			}, 500)

			return false;
		});    	
    }



/*
    if (typeof $.fn.isotope == 'function') {
    	var $rtGalleryContainer = $('.rt-isotope-wrapper .rt-isotope-content');
    	$rtGalleryContainer.isotope({
    		filter: '*',
    		animationOptions: {
    			duration: 750,
    			easing: 'linear',
    			queue: false
    		}
    	});

		$('.rt-isotope-tab a').on('click',function(){
			var $parent = $(this).closest('.rt-isotope-wrapper'),
			selector = $(this).attr('data-filter');

			$parent.find('.rt-isotope-tab .current').removeClass('current');
			$(this).addClass('current');     
			$parent.find('.rt-isotope-content').isotope({
				filter: selector,
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});
			return false;
		});    	
    }*/
}

function rdtheme_wc_scripts($){
	/* Shop change view */
	$('#shop-view-mode li a').on('click',function(){
		$('body').removeClass('product-grid-view').removeClass('product-list-view');

		if ( $(this).closest('li').hasClass('list-view-nav')) {
			$('body').addClass('product-list-view');
			Cookies.set('shopview', 'list');
		}
		else{
			$('body').addClass('product-grid-view');
			Cookies.remove('shopview');
		}
		return false;
	});


}

function rdtheme_slider_fullscreen(){
	var $ = jQuery;
	$('.rt-el-slider').each(function() {
		var width = $(window).width(),
		left = $(this).offset().left,
		$container = $(this).find('.rt-nivoslider');
		if (width<1921) {
			$container.css('margin-left', -left).width(width);
		}
		else {
			leftAlt = left-(width-1920)/2;
			$container.css('margin-left', -leftAlt).width(1920);
		}
		$container.css('opacity', 1);
	});
}


function rdtheme_imgslider_scripts($){
	
	var $ = jQuery;
	if(!$.fn.owlCarousel){
		return;
	}

	var thumbnail_owl_carousel = jQuery(".thumbnails-owl-carousel");

	var rtltrue = false;
	if ( medilinkObj.rtl == 'yes' ) {
		rtltrue = true;
	}
	if (thumbnail_owl_carousel) {
		thumbnail_owl_carousel.owlCarousel({
			items: 1,
			rtl:rtltrue
		});
	}

	 		  
			// 1) ASSIGN EACH 'DOT' A NUMBER
			dotcount = 1;	 
			jQuery('.thumbnails-owl-carousel .owl-dot').each(function() {
			  jQuery( this ).addClass( 'dotnumber' + dotcount);
			  jQuery( this ).attr('data-info', dotcount);
			  dotcount=dotcount+1;
			});

			 // 2) ASSIGN EACH 'SLIDE' A NUMBER
			slidecount = 1;

			jQuery('.thumbnails-owl-carousel .owl-item').not('.cloned').each(function() {
			  jQuery( this ).addClass( 'slidenumber' + slidecount);
			  slidecount=slidecount+1;
			});

			// SYNC THE SLIDE NUMBER IMG TO ITS DOT COUNTERPART (E.G SLIDE 1 IMG TO DOT 1 BACKGROUND-IMAGE)
			jQuery('.thumbnails-owl-carousel .owl-dot').each(function() {

			grab = jQuery(this).data('info');

			slidegrab = jQuery('.slidenumber'+ grab +' img').attr('src');
			console.log(slidegrab);

			jQuery(this).css("background-image", "url("+slidegrab+")");  

		});
			
		// THIS FINAL BIT CAN BE REMOVED AND OVERRIDEN WITH YOUR OWN CSS OR FUNCTION, I JUST HAVE IT
		// TO MAKE IT ALL NEAT 
		amount = jQuery('.thumbnails-owl-carousel .owl-dot').length;
		gotowidth = 100/amount;

		jQuery('.thumbnails-owl-carousel .owl-dot').css("width", gotowidth+"%");
		newwidth = jQuery('.thumbnails-owl-carousel .owl-dot').width();
		jQuery('.thumbnails-owl-carousel .owl-dot').css("height", newwidth+"px");
	
}