const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const all = [...$$("*")];
const body = $("body");
const createBtn = $("#create-btn");
const nameTask = $("input");
const taskContain = $("#task-container");
const optionList = [...$$("ul")];
const boxList = [...$$(".task-each")];
const isEmpty = $("#is-empty");
const isCreated = $("#is-created");
const day = [...$$(".day")];
const table = $("table");
const time = $("#time");
const lesson = $("#lesson");
const downbtn = $("#down-btn");
const taskTable = $("#task-table");
const taskCreate = $("#create-task");
const rightMenu = $("#right-menu");
const defaultBtn = $("#default");
const footer = $("#footer");
const custom = $("#custom");
const preset = $("#preset");
const reset = $("#reset");
const hideCreate = $("#hide-create");
const saveBtn = $("#save");
var remainerStyle;

const renderLayout = () => {
	for (let i = 0; i < day.length; ++i) {
		day[i].style.width = (table.offsetWidth - lesson.offsetWidth - time.offsetWidth) / 7 + "px";
	}
	footer.style.height = custom.offsetHeight + "px";
	footer.style.width = custom.offsetWidth + "px";
	taskContain.style.height = body.offsetHeight - footer.offsetHeight - taskCreate.offsetHeight + 40 + "px";
};

const checkScroll = () => {
	if ($(".task")) {
		let taskBox = [...$$(".task")];
		let totalHeight = footer.offsetHeight + taskCreate.offsetHeight;
		for (let i = 0; i < taskBox.length; ++i) {
			totalHeight += taskBox[i].offsetHeight;
			if (totalHeight > taskContain.offsetHeight) taskContain.style.overflowY = "scroll";
		}
	}
};

const createOptionForTask = (text) => {
	let newTask = document.createElement("div");
	newTask.className = "task";
	newTask.innerHTML = `<div class="content">${text}</div><img src="times-circle-regular.svg" class="close" onclick="deleteTask()">`;
	taskContain.appendChild(newTask);
	checkScroll();
	// create option of each cell in table
	createOption();
};

const createTask = () => {
	let tasks = [...$$(".content")];
	if (nameTask.value) {
		isEmpty.style.display = "none";
		// check if exist the same task
		let check = tasks.find((task) => {
			return task.innerText == nameTask.value.trim();
		});
		// if not exist, create task
		if (!check) {
			isCreated.style.display = "none";
			createOptionForTask(nameTask.value.trim());
			nameTask.value = "";
		} else {
			isCreated.style.display = "block";
		}
	} else {
		isEmpty.style.display = "block";
		isCreated.style.display = "none";
	}
};

const createTaskByEnter = (e) => {
	if (e.key == "Enter") createTask();
};

const createOption = () => {
	for (let i = 0; i < optionList.length; ++i) {
		let newOption = document.createElement("li");
		newOption.innerText = nameTask.value.trim();
		// make cell could be like a drop down menu
		newOption.onclick = toggleParent;
		// append option to cell menu
		optionList[i].appendChild(newOption);
		// make ul width = cell width
		optionList[i].style.width = boxList[i].offsetWidth + "px";
		// make ul locate under cell
		optionList[i].style.top = boxList[i].offsetHeight + "px";
	}
};

String.prototype.convertToRGB = function () {
	let hex = this.match(/[^#]{1,2}/g);
	let rgb = [parseInt(hex[0], 16), parseInt(hex[1], 16), parseInt(hex[2], 16)];
	return rgb;
};

const changeColor = (e) => {
	e = e || window.event;
	let rgb, brightness;
	let arr = [...$$(".ctrl-mode")];
	for (let i = 0; i < arr.length; ++i) {
		arr[i].style.backgroundColor = e.target.value;
		rgb = e.target.value.convertToRGB();
		brightness = Math.round((parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000);
		arr[i].style.color = brightness > 125 ? "black" : "white";
		arr[i].classList.add("custom");
	}
};

const removeCtrlMode = () => {
	preset.removeEventListener("input", changeColor);
	[...$$(".ctrl-mode")].forEach((item) => {
		item.classList.remove("ctrl-mode");
	});
};

const deleteData = (e) => {
	e = e || window.event;
	e.target.parentElement.firstChild.data = `\n\t\t\t\t\t`;
	e.target.style.display = "none";
};

const toggleTask = (e) => {
	e = e || window.event;
	// e.target.firstElementChild = <ul></ul>
	if ($(".task")) {
		if (e.ctrlKey) {
			if ($(".checked")) $(".checked").classList.remove("checked");
			e.target.classList.toggle("ctrl-mode");
			// change color directly
			preset.addEventListener("input", changeColor);
			// remove class ctrl-mode when close the color box
			preset.addEventListener("change", removeCtrlMode);
		} else {
			if (e.target.firstElementChild) {
				// close option when click on cell and continue to click another cell
				let array = [...$$("ul")];
				let check = array.find((item, index, arr) => {
					let checkIndex = arr.indexOf(e.target.firstElementChild);
					// check if exist another open menu, if true, close it
					if (index != checkIndex) {
						return item.classList.contains("checked");
					}
				});
				if (check) check.classList.remove("checked");
				// after hiding other option menu, display the menu clicking on
				e.target.firstElementChild.classList.add("checked");
			}
		}
	}
};

const removeCtrlModeWhenClickOut = (e) => {
	e = e || window.event;
	if ($(".ctrl-mode") && !e.target.classList.contains("task-each")) {
		if (e.target.id != "preset") {
			e.preventDefault();
			removeCtrlMode();
		}
	}
};

const hideOptionWhenClickOut = (e) => {
	if (!e.target.classList.contains("task-each")) {
		if ($(".checked")) {
			e.preventDefault();
			$(".checked").classList.remove("checked");
		}
	}
};

const hideOption = () => {
	// check if some option is open, if true hide it
	if ($(".checked")) $(".checked").classList.remove("checked");
	clearTimeout(remainerStyle);
	remainerStyle = setTimeout(() => {
		remainStyle();
	}, 100);
};

const toggleParent = (e) => {
	e = e || window.event;
	// e.target.parentElement = <ul></ul>
	// hide ul when click on li
	e.target.parentElement.classList.remove("checked");
	// e.target.parentElement.parentElement = <td></td>
	// append text to cell
	// innerText is not working? using firstChild
	e.target.parentElement.parentElement.firstChild.data = `${e.target.innerText}\n\t\t\t\t\t`;
	e.target.parentElement.nextElementSibling.style.display = "block";
	// return style of option when text input so long
	hideOption();
};

const deleteTask = (e) => {
	e = e || window.event;
	// remove task when click on cross button
	e.target.parentElement.remove();
	// also remove option with the same name as task
	[...$$("li")]
		.filter((check) => {
			return check.innerText == e.target.previousElementSibling.innerText;
		})
		.forEach((item) => {
			item.remove();
		});
	// also remove data in cell with same name as task
	boxList
		.filter((cell) => {
			return cell.innerText == e.target.previousElementSibling.innerText;
		})
		.forEach((cell) => {
			// still conflict with innerText? not working, it will overide all the ul and li
			cell.firstChild.data = `\n\t\t\t\t\t`;
			// hide cross button
			cell.lastElementChild.style.display = "none";
		});
};

const remainStyle = () => {
	for (let i = 0; i < optionList.length; ++i) {
		optionList[i].style.width = [...$$(".task-each")][i].offsetWidth + "px";
		optionList[i].style.top = [...$$(".task-each")][i].offsetHeight + 1 + "px";
	}
};

const downTable = () => {
	html2canvas(taskTable).then((canvas) => {
		let a = document.createElement("a");
		document.body.appendChild(a);
		a.download = "TKB.png";
		a.href = canvas.toDataURL();
		a.target = "_blank";
		a.click();
	});
};

const restoreColor = () => {
	let customData = [...$$(".custom")];
	customData.forEach((cell) => {
		cell.style.backgroundColor = "";
		cell.style.color = "black";
	});
};

for (let i = 0; i < all.length; ++i) {
	all[i].addEventListener("click", hideOptionWhenClickOut);
	all[i].addEventListener("click", removeCtrlModeWhenClickOut);
}

const resetAll = () => {
	[...$$(".close")].forEach((button) => {
		button.click();
	});
	defaultBtn.click();
};

const toggleMenu = () => {
	rightMenu.style.display = rightMenu.style.display == "none" ? "block" : "none";
};

const saveData = () => {
	if (
		boxList.find((cell) => {
			return cell.innerText;
		})
	) {
		let arr = [];
		for (let i = 0; i < boxList.length; ++i) {
			if (boxList[i].innerText) {
				arr.push({
					task: boxList[i].innerText,
					index: i,
				});
			}
		}
		sendData(arr);
	} else alert("Table data is blank! Please insert something");
};

const sendData = (arr) => {
	fetch("/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(arr),
	})
		.then(() => {
			alert("Saving successfully!");
		})
		.catch((err) => console.log(err));
};

const setup = () => {
	renderLayout();
	let arr = [];
	boxList.forEach((cell) => {
		if (cell.firstChild.data != `\n\t\t\t\t\t`) {
			cell.lastElementChild.style.display = "block";
			// check not to create same task options
			if (!arr.includes(cell.innerText)) {
				createOptionForTask(cell.innerText);
				arr.push(cell.innerText);
			}
		}
	});
	preset.value = "#ff3e3e";
};

window.addEventListener("resize", hideOption);
window.addEventListener("resize", renderLayout);
createBtn.addEventListener("click", createTask);
defaultBtn.addEventListener("click", restoreColor);
nameTask.addEventListener("keyup", createTaskByEnter);
downbtn.addEventListener("click", downTable);
reset.addEventListener("click", resetAll);
hideCreate.addEventListener("click", toggleMenu);
saveBtn.addEventListener("click", saveData);

setup();
