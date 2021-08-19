const navbar = document.getElementById("nav");
// initial
navbar.style.visibility = "hidden";
navbar.style.display = 'none';

window.addEventListener("scroll", () => {
  const scrollHeight = window.pageYOffset;
  const navHeight = navbar.getBoundingClientRect().height;
  console.log('s', scrollHeight, 'n:' , navHeight);
  if (scrollHeight > 650) {
    navbar.style.visibility = "visible";
    navbar.style.display = "block";
    navbar.classList.add('fixed-top')
  } else {
    navbar.style.visibility = "hidden";
    navbar.classList.remove("fixed-top");
  }
});
