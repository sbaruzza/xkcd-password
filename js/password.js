var xkcd = {} // Will transform into a namespace declaration
xkcd.available = [
	{name: 'english-common-5k', description:'English common words (5K)'},
	{name: 'english-nouns-55k', description:'English nouns (55K)'}
];
xkcd.selected = "english-common-5k";

xkcd.generatePassword = function() {
	if (xkcd.wordList.length == 0) {
		throw "Unable to generate password, empty words list.";
	}
	var words = [];
	while (words.length < 4) {
		var needle = Math.floor(Math.random() * (xkcd.wordList.length - 1));
		words.push(xkcd.wordList[needle]);
	}
	return words.join(' ');
}

xkcd.showPassword = function() {
	$('#password').text(xkcd.generatePassword());
}

xkcd.loadWordsList = function(name) {
	$('#words-list-button').text("Loading...")
	$('#generate').addClass('disabled').prop('disabled', true);
	$.getJSON('js/' + name +'.json').done(function(data){
		xkcd.wordList = data;
		$('#generate').removeClass('disabled').prop('disabled', false); 
		var title = xkcd.available.filter(function(menu){return menu.name === name;})[0].description;
		$('#words-list-button').text(title);
		console.log('Loaded ' + title + ' with ' + data.length + ' words.');
	}).fail(function(){
		console.log('Failed to load words list.', arguments);
	});
}

$(document).ready(function(){
	$('#generate').click(xkcd.showPassword);
	xkcd.available.forEach(function(menu){
		var a = document.createElement("a");
		a.setAttribute("href", "#");
		a.setAttribute("id", menu.name);
		a.textContent=menu.description;
		var li = document.createElement("li");
		li.appendChild(a);
		$('#words-lists').append(li);
	});
	
	$('#english-common-5k').click(function(){xkcd.loadWordsList('english-common-5k')});
	$('#english-nouns-55k').click(function(){xkcd.loadWordsList('english-nouns-55k')});
	xkcd.wordList = [];
	xkcd.loadWordsList(xkcd.available[0].name);
})