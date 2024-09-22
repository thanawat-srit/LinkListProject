function checkCookie() {
	if (getCookie("user_id") == false) {
		window.location = "index.html";
	}
}
checkCookie();

function getCookie(name) {
	var value = "";
	try {
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	} catch (err) {
		return false
	}
}
var imageFile
var originImg;
var originName;
var originLink;
var item_id;
var allTagList = ["Work","Book","Shop","Entertainment"];
var CBElm = [];
var IconElm = [];
var FavoriteCBElm;
var FavoriteIcon;


window.onload = pageLoad;
function pageLoad() {
	SetGetElementById();
	CreateTagElement();
	FavoriteCBElm.onclick = function () { UpdateFavoriteIcon(FavoriteCBElm, _favoriteIcon); }

	document.addEventListener('paste', handlePaste);
	document.getElementById('savebutton').onclick = SaveWithoutImg;
	document.getElementById('deletebutton').onclick = DeleteItem;
	GetItemById(getCookie('EditItemId'));
}
function SetGetElementById() {
	FavoriteCBElm = document.getElementById("FavoriteCB");
	FavoriteIcon = document.getElementById("tagFavorite");
	_favoriteIcon = document.getElementById('imgfavorite');
}
function CreateTagElement(){
	var header = document.getElementById("divtagList");
	for (const i in allTagList) {
		var spanhead = document.createElement("span");
		spanhead.className = "tagList";
		spanhead.id = "tag"+allTagList[i];
		IconElm.push(spanhead);
		var checkBox = document.createElement("input");
		checkBox.type = "checkbox";
		checkBox.id = allTagList[i] + "CB";
		checkBox.name = allTagList[i] + "CB";
		checkBox.value = allTagList[i];
		checkBox.hidden = true;
		checkBox.onclick = UpdateCheckTagIcon;
		CBElm.push(checkBox);
		var label = document.createElement("label");
		label.htmlFor = allTagList[i] + "CB";
		label.innerHTML = allTagList[i];
		label.className = "label";
		spanhead.appendChild(checkBox);
		spanhead.appendChild(label);
		header.appendChild(spanhead);
	}
}
function UpdateCheckTagIcon() {
	for(var i=0;i<allTagList.length;i++){
		if (CBElm[i] != null) if (CBElm[i].checked == true){IconElm[i].className = "checkedtagList";}else{IconElm[i].className = "tagList";}
	}
}
function UpdateFavoriteIcon(favoriteCheckbox, favoriteIcon) {
	if (favoriteCheckbox.checked) {
		favoriteIcon.src = '../img/sourceimg/favoriteIcon.png';
	} else {
		favoriteIcon.src = '../img/sourceimg/defaultFavoriteBlackIcon.png';
	}
}
function SaveWithoutImg() {
	if (imageFile != null) {
		uploadImage(imageFile)
	} else {
		SubmitUpdateItem("pass")
	}
}
function handlePaste(event) {
	if (event.clipboardData.types.includes('Files')) {
		const file = event.clipboardData.files[0];

		if (file.type.startsWith('image/')) {
			const imgElement = document.getElementById('showimg');
			imgElement.src = URL.createObjectURL(file);
			imageFile = file;
		}
	}
}
function uploadImage(file) {
	const formData = new FormData();
	formData.append('profile', file);

	fetch('/uploadimage', {
		method: 'POST',
		body: formData
	})
		.then(response => response.text())
		.then(data => {
			SubmitUpdateItem(data)
			console.log('Server response:', data);
		})
		.catch(error => {
			console.error('Error uploading image:', error);
		});
}
async function SubmitUpdateItem(_imageFile) {
	console.log("SubmitUpdateItem");
	var name = document.getElementById('name').value;
	var link = document.getElementById('link').value;
	var img = originImg;
	if (_imageFile != "pass") {
		img = _imageFile;
	}
	if (name == "") {
		name = originName;
	}
	if (link == "") {
		link = originLink;
	}

	var FavoriteCB = 0;
	var CB = [];

	if (document.getElementById("FavoriteCB") != null) if (document.getElementById("FavoriteCB").checked == true) FavoriteCB = 1;
	for(var i=0;i<allTagList.length;i++){
		if (document.getElementById(allTagList[i]+"CB") != null) if (document.getElementById(allTagList[i]+"CB").checked == true) {CB[i] = 1}else{CB[i] = 0};
	}

	UpdateItem(item_id, name, link, img, FavoriteCB, CB);
}

function showImg(filename) {
	if (filename != false) {
		var showpic = document.getElementById('showimg');
		showpic.innerHTML = "";
		if (filename == "defaultProfile.png") {
			showpic.src = '../img/sourceimg/' + filename;
		} else {
			showpic.src = '../img/uploadimg/' + filename;
		}
	}
}
async function DeleteItem() {
	console.log(item_id);
	await fetch('/deleteItem', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			item_id: item_id
		})
	}).then((data) => {
		data.text().then((path) => {
			window.location.href = path;
		})
	}).catch((err) => {
		console.log(err);
	});
}
async function GetItemById(id) {
	await fetch('/getItemById', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		})
	}).then((data) => {
		data.json().then((jsondata) => {
			var jsonObj = JSON.parse(JSON.stringify(jsondata));
			SetDefauldEdit(jsonObj);
		})
	}).catch((err) => {
		console.log(err);
	});
}
async function UpdateItem(item_id, name, link, img, FavoriteCB, CB) {
	await fetch('/updateItem', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			item_id: item_id,
			img: img,
			name: name,
			link: link,
			FavoriteCB: FavoriteCB,
			CB0: CB[0],
			CB1: CB[1],
			CB2: CB[2],
			CB3: CB[3]
		})
	}).then((data) => {
		data.text().then((path) => {
			window.location.href = path;
		})
	}).catch((err) => {
		console.log(err);
	});
}
function SetDefauldEdit(data) {

	originImg = data[0]["img"];
	originName = data[0]["name"];
	originLink = data[0]["link"];
	item_id = data[0]["item_id"];
	var elementName = document.getElementById("name")
	var elementLink = document.getElementById("link")
	elementName.placeholder = originName;
	elementLink.placeholder = originLink;
	showImg(originImg);

	if (data[0]["tagFavorite"] == 1) {
		FavoriteCBElm.checked = true;
		FavoriteIcon.className = "checkedtagList";
		document.getElementById("imgfavorite").src = '../img/sourceimg/favoriteIcon.png'
	} else {
		document.getElementById("imgfavorite").src = '../img/sourceimg/defaultFavoriteBlackIcon.png'
	}
	for(var i=0;i<allTagList.length;i++){
		if (data[0]["tag"+i] == 1) { document.getElementById(allTagList[i]+"CB").checked = true; IconElm[i].className = "checkedtagList"; }
	}
}