const removeAllActiveClasses = () =>{
    tabs.forEach(tab =>{
        tab.querySelector("div").classList.remove("active")
    })
}

const tabs = document.querySelectorAll("#filters a");
const rightArrow = document.querySelector("#filters-main .right_img_button i");
const leftArrow = document.querySelector("#filters-main .left_img_button i");
const tabList = document.querySelector("#filters");


const leftArrowContainer = document.querySelector(".left_img_button");

const rightArrowContainer = document.querySelector(".right_img_button");


tabs.forEach(tab =>{
    tab.addEventListener("click", (e)=>{
        // e.preventDefault();
        removeAllActiveClasses();
        tab.querySelector("div").classList.add("active");
    });
});

const manageIcons = () =>{
    if(tabList.scrollLeft >= 20){
        leftArrowContainer.classList.add("active")
    } else{
        leftArrowContainer.classList.remove("active");
    };
    let maxScrollValue = tabList.scrollWidth - tabList.clientWidth - 20;

    if(tabList.scrollLeft >= maxScrollValue){
        rightArrowContainer.classList.remove("active");
    } else{
        rightArrowContainer.classList.add("active")
    };
};

rightArrow.addEventListener("click", ()=>{
    tabList.scrollLeft += 600;
    manageIcons();
});

leftArrow.addEventListener("click", ()=>{
    tabList.scrollLeft -= 600;
    manageIcons();
});

tabList.addEventListener("scroll", manageIcons);

let dragging = false;

let drag = (e) =>{
    if(!dragging) return;
    tabList.classList.add("dragging");
    tabList.scrollLeft -= e.movementX;
}

tabList.addEventListener("mousedown", ()=>{
    dragging = true;
});

tabList.addEventListener("mousemove", drag);

document.addEventListener("mouseup", ()=>{
    dragging = false;
    tabList.classList.remove("dragging");
})