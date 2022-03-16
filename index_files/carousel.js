$(window).on('load', function(){
    var slick = $('#slick-carousel');

    /*var settings = {
        items:4,
        itemsDesktop : [1000,5], //5 items between 1000px and 901px
        itemsDesktopSmall : [900,3], // betweem 900px and 601px
        itemsTablet: [600,2], //2 items between 600 and 0
        itemsMobile : false, // itemsMobile disabled - inherit from itemsTablet option
        nav: true,
        dots:true,
        dotsEach: true,
        loop: true,
        navText: [
            "<i class='icon-chevron-left icon-white'> < </i>",
            "<i class='icon-chevron-right icon-white'> > </i>"
        ],
        rewindNav : true
    };*/
let options = {
        dots: false,
        infinite: false,
        speed: 300,
        centerMode: false,
        rows: 2,
        responsive: [
            {
                breakpoint: 5000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1080,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            }

        ]
    };

    slick.slick(options);

    $("a.colorbox").colorbox({rel:'program-img', maxWidth:'90%'});
    $('a.report-img').colorbox({ maxWidth:'90%'});

    $('.report-images').each(function(k, v){
        $(v).parent('.reports-body').on('click', function(){
            $(this).find('a.report-img')[0].click();
        });
    });
});