// 轮播图初始化
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let slideInterval;

    // 显示指定索引的幻灯片
    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '0';
        });

        // 重置所有导航点
        dots.forEach(dot => {
            dot.style.opacity = '0.5';
            dot.style.width = '8px';
        });

        // 显示当前幻灯片
        slides[index].style.opacity = '1';
        slides[index].style.zIndex = '1';

        // 高亮当前导航点
        dots[index].style.opacity = '1';
        dots[index].style.width = '24px';

        currentSlide = index;
    }

    // 切换到下一张幻灯片
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        showSlide(nextIndex);
    }

    // 切换到上一张幻灯片
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        showSlide(prevIndex);
    }

    // 自动轮播
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // 停止自动轮播
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }

    // 点击导航点切换幻灯片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideInterval();
            startSlideInterval();
        });
    });

    // 点击上一张按钮
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideInterval();
        startSlideInterval();
    });

    // 点击下一张按钮
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideInterval();
        startSlideInterval();
    });

    // 鼠标悬停暂停自动轮播
    const carouselContainer = document.getElementById('carousel');
    carouselContainer.addEventListener('mouseenter', stopSlideInterval);
    carouselContainer.addEventListener('mouseleave', startSlideInterval);

    // 初始化显示第一张幻灯片并启动自动轮播
    showSlide(0);
    startSlideInterval();
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', initCarousel);
