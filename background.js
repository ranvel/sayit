const TITLE_APPLY = "Say it!";
const TITLE_REMOVE = "Don't say it!";
//initial state
var state = "off";

//sets toolbar icon and icon hover text
function toggleSI(tab) {
	browser.tabs.query({active: true, currentWindow: true}, function(tab) {
		function gotTitle(title) {
			if (title === TITLE_APPLY) {
				//extension active
				browser.browserAction.setIcon({tabId: tab.id, path: "icons/speak-on-96.png"});
				browser.browserAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
				state = "on";
				sendMessage();
			} else {
				//extension disabled
				browser.browserAction.setIcon({tabId: tab.id, path: "icons/speak-off-96.png"});
				browser.browserAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
				state = "off";
				sendMessage();
			}
		}
		var gettingTitle = browser.browserAction.getTitle({tabId: tab.id});
		gettingTitle.then(gotTitle);
	}); 
}

//mostly copied and pasted from this stack overflow answer b/c I couldn't figure it out
//https://stackoverflow.com/a/23895822/2432552
function ensureSendMessage(tabId, message, callback){
	browser.tabs.sendMessage(tabId, message, callback);
}
function sendMessage() {
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		ensureSendMessage(tabs[0].id, {state: state});
	});
}

//when you click the icon in the toolbar, this happens
browser.browserAction.onClicked.addListener(toggleSI);

/*
Each time a tab is updated, this re-activates the jQuery listener
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
	//console.log("updated");
	sendMessage();
});