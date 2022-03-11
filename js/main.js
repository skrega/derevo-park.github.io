$(function () {

    new Swiper(".project-slider", {
        pagination: {
            el: ".swiper-pagination",
        },

    });


    new Swiper(".awardsSlider", {
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

})