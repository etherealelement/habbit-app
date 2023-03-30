"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".title"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCover: document.querySelector(".progress__cover"),
  },
  content: {
    daysContainer: document.querySelector(".habbit-wrap"),
    daysNumber: document.querySelector(".habbit__day"),
  },
};

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
      element.addEventListener("click", () => rerender(iterator.id));
      element.innerHTML = `
				<img src="../images/${iterator.icon}.svg" alt="${iterator.name}"/>`;
      if (activeHabbit.id === iterator.id) {
        element.classList.add("menu__link-active");
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
  if (!activeHabbit) {
    return;
  }
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + " %";
  page.header.progressCover.setAttribute("style", `width: ${progress}%`);
}

// rerender Content

function rerenderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = " ";
  for (const key in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `
                <div class="habbit__day">День ${Number(key) + 1}</div>
                <div class="habbit__comment">
                  ${activeHabbit.days[key].comment}
                </div>
                <button class="habbit__delete" onclick="deleteDay(${key})">
                  <img src="../images/delete-icon.svg" alt="Удалить" />
                </button>
		`;
	page.content.daysContainer.appendChild(element)
  }
	page.content.daysNumber.innerHTML = `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
	globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
	rerenderContent(activeHabbit)
}

// work witch days
function addDays(event) {
	const form = event.target
	event.preventDefault();
	const data = new FormData(event.target);
	const comment = data.get("comment");
	if(!comment) {
		form["comment"].classList.add("error");
	}
	habbits = habbits.map(item => {
		if(item.id === globalActiveHabbitId) {
			return {
				...item,
				days: item.days.concat([{comment}]),
			}
		}
		return item;
	});
	form["comment"].value = " "; 
	rerender(globalActiveHabbitId);
	saveData();
}

// deleteDay

function deleteDay(index) {
	habbits = habbits.map(item => {
		if(item.id === globalActiveHabbitId) {
			item.days.splice(index, 1)
			return {
				...item,
				days: item.days
			};
		}
		return item;
	});
	rerender(globalActiveHabbitId);
	saveData();
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
