var synth = window.speechSynthesis;
var state = "off";

//enumerate voices for the list
function populateVoiceList() {
  voices = synth.getVoices();

  for(i = 0; i < voices.length ; i++) {
	var option = document.createElement('option');
	option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
		
	if(voices[i].default) {
	  option.textContent += ' -- DEFAULT';
	}

	option.setAttribute('data-lang', voices[i].lang);
	option.setAttribute('data-name', voices[i].name);
	//voiceSelect.appendChild(option);
  }
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

//voice setup
function speakSelection(paragraph) {
	//var spokenText = window.getSelection().toString().trim();
	var utterThis = new SpeechSynthesisUtterance(paragraph);
	var selectedOption = 'Karen';
	for(i = 0; i < voices.length ; i++) {
		if(voices[i].name === selectedOption) {
			utterThis.voice = voices[i];
		}
	}
	utterThis.pitch = 1;
	utterThis.rate = 1.5;
	synth.speak(utterThis);
}
//DOM  jQuery listeners
//entering 'p'
$('p').mouseenter(function(){
	// Code from https://www.sanwebe.com/2014/04/select-all-text-in-element-on-click
	if (state == "on") {	
		var sel, range;
		var el = $(this)[0];
		sel = window.getSelection();
		window.setTimeout(function(){
			range = document.createRange(); //range object
			range.selectNodeContents(el); //sets Range
			sel.removeAllRanges(); //remove all ranges from selection
			sel.addRange(range);//add Range to a Selection.
		},1);
		speakSelection($(this).text());
	}
});

//leaving 'p'
$('p').mouseleave(function(){
	if (state == "on") {	
		synth.cancel();
	}
});

//listener for activity from background.js
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	state = request.state;
  	if(request.ping) {sendResponse({pong: state}); return; }
});