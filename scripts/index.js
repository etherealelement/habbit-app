"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

// page
const page = {
	menu: document.querySelector(".menu__list"),
	header: {
		h1: document.querySelector(".title"),
		progressPercent: document.querySelector(".progress__percent"),
		progressCover: document.querySelector(".progress__cover"),
	}
}


// utils
function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render;
function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  for (const iterator of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${iterator.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", iterator.id);
      element.classList.add("menu__link");
			element.addEventListener("click", ()=> rerender(iterator.id));
			element.innerHTML = `
				<img src="../images/${iterator.icon}.svg" alt="${iterator.name}"/>`;
			if(activeHabbit.id === iterator.id) {
					element.classList.add("menu__link-active")
			}
			page.menu.appendChild(element);
			continue;
    }
    if (activeHabbit.id === iterator.id) {
      existed.classList.add("menu__link-active");
    } else {
      existed.classList.remove("menu__link-active");
    }
  }
}

// Render Content

function rerenderHead(activeHabbit) {
		if(!activeHabbit){
			return;
		};
		page.header.h1.innerText = activeHabbit.name;
		const progress = activeHabbit.days.length / activeHabbit.target > 1 ? 100 : activeHabbit.days.length / activeHabbit.target * 100;
		page.header.progressPercent.innerText = progress.toFixed(0) + " %";
		page.header.progressCover.setAttribute("style",`width: ${progress}%`)
};



function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
	rerenderHead(activeHabbit);
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
