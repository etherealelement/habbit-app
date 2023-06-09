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
  popup: {
    index: document.getElementById("add-popup"),
    iconField: document.querySelector(".popup__form input[name='icon']"),
  }
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

function validateForm(form, fields) {
  const formData = new FormData(form);
  res = {};
  for (const iterator of fields) {
    const fieldElement = formData.get(iterator);
    form[iterator].classList.remove("error");
    if(!fieldElement) {
      form[iterator].classList.add("error");
    }
    res[iterator] = fieldElement;
  }
  let isValid = true;
  for (const iterator of fields) {
    if(!res[iterator]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
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

// open/close popup

function togglePopup() { 
    if(page.popup.index.classList.contains("cover_hidden")) {
      page.popup.index.classList.remove("cover_hidden");
    } else { 
      page.popup.index.classList.add("cover_hidden");
    }
}

// working witch habbits
page.header.h1.addEventListener("click", function(){
  console.log(this);
});

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector('.icon.icon-active');
  activeIcon.classList.remove('icon-active');
  context.classList.add("icon-active")
  
}

// addHabbit

function addHabbit(event) { 

  event.preventDefault();
}


// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
