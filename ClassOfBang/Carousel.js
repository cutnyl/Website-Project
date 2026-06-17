const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".slide");
 
let currentIndex = 0;
 
function nextSlide(){
 
    currentIndex++;
 
    if(currentIndex >= slides.length){
        currentIndex = 0;
    }
 
    track.style.transform =
        `translateX(-${currentIndex * 100}%)`;
}
 
setInterval(nextSlide, 3000);