function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	//early
	earlyTweet = tweet_array.reduce((earliest, curr) =>
		curr.time < earliest.time ? curr : earliest
	);
	document.getElementById('firstDate').innerText =
		earlyTweet.time.toLocaleDateString('en-US', options);
	//last
	latestTweet = tweet_array.reduce((latest, curr) =>
		curr.time > latest.time ? curr : latest
	);
	document.getElementById('lastDate').innerText =
		latestTweet.time.toLocaleDateString('en-US', options);

	//categories
	total = tweet_array.length;
	//complete
	completedCnt = tweet_array.filter(
		tweet => tweet.source === "completed_event"
	).length;
	document.getElementsByClassName("completedEvents")[0].innerText = completedCnt;
	document.getElementsByClassName("completedEventsPct")[0].innerText =
		(completedCnt / total * 100).toFixed(2) + "%";
	//live
	liveCnt = tweet_array.filter(
		tweet => tweet.source === "live_event"
	).length;
	document.getElementsByClassName("liveEvents")[0].innerText = liveCnt;
	document.getElementsByClassName("liveEventsPct")[0].innerText =
		(liveCnt / total * 100).toFixed(2) + "%";
	//achive
	achieveCnt = tweet_array.filter(
		tweet => tweet.source === "achievement"
	).length;
	document.getElementsByClassName("achievements")[0].innerText = achieveCnt;
	document.getElementsByClassName("achievementsPct")[0].innerText =
		(achieveCnt / total * 100).toFixed(2) + "%";
	//other
	otherCnt = tweet_array.filter(
		tweet => tweet.source === "miscellaneous"
	).length;
	document.getElementsByClassName("miscellaneous")[0].innerText = otherCnt;
	document.getElementsByClassName("miscellaneousPct")[0].innerText =
		(otherCnt / total * 100).toFixed(2) + "%";
	//write
	document.getElementsByClassName("completedEvents")[1].innerText = completedCnt;
	writeCnt = tweet_array.filter(
		tweet => tweet.source === "completed_event" && tweet.written
	).length;
	document.getElementsByClassName("written")[0].innerText = writeCnt;
	document.getElementsByClassName("writtenPct")[0].innerText =
		(writeCnt / completedCnt * 100).toFixed(2) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});