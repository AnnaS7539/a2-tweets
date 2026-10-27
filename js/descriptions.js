let wTweets = [];
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	wTweets = runkeeper_tweets
		.map(function (tweet) { return new Tweet(tweet.text, tweet.created_at); })
		.filter(function (tweet) { return tweet.written; });
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let searchBox = document.getElementById("textFilter");
	document.getElementById("searchCount").textContent = "0";
	document.getElementById("searchText").textContent = "";
	searchBox.addEventListener("input", function () {
		const query = searchBox.value.trim().toLowerCase();
		const searchCount = document.getElementById("searchCount");
		const searchText = document.getElementById("searchText");
		const tweetTable = document.getElementById("tweetTable");

		searchText.textContent = searchBox.value;
		//empty case
		if (query === "") {
			searchCount.textContent = "0";
			tweetTable.innerHTML = "";
			return;
		}
		const matchingTweets = wTweets.filter(tweet => tweet.writtenText.toLowerCase().includes(query));
		searchCount.textContent = matchingTweets.length;
		tweetTable.innerHTML = matchingTweets
			.map(function (tweet, index) {
				return tweet.getHTMLTableRow(index + 1);
			})
			.join("");
		});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});