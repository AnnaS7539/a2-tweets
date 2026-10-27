function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	// Only use completed activities with a known activity type
	const validTweets = tweet_array.filter(
		tweet => tweet.source === "completed_event" && tweet.activityType !== "unknown"
	);

	const typeCnt = {};
	validTweets.forEach(tweet => {
		let type = tweet.activityType;
		typeCnt[type] = (typeCnt[type] || 0) + 1;
	});

	const sortedActivities = Object.entries(typeCnt).sort((a, b) => b[1] - a[1]);
	document.getElementById("numberActivities").innerText = sortedActivities.length;
	document.getElementById("firstMost").innerText = sortedActivities[0][0];
	document.getElementById("secondMost").innerText = sortedActivities[1][0];
	document.getElementById("thirdMost").innerText = sortedActivities[2][0];
	//3 long short
	//[run walk bike]
	const topThree = sortedActivities.slice(0, 3).map(item => item[0]);
	const distanceStats = {};
	validTweets.forEach(tweet => {
		const type = tweet.activityType;
		if (topThree.includes(type)) {
			if (!distanceStats[type]) {
				distanceStats[type] = { total: 0, count: 0 };
			}
			distanceStats[type].total += tweet.distance;
			distanceStats[type].count++;
		}
	});
	const sortedDistances = Object.entries(distanceStats)
		.map(([type, stats]) => [type, stats.total / stats.count])
		.sort((a, b) => b[1] - a[1]);
	document.getElementById("longestActivityType").innerText = sortedDistances[0][0];
	document.getElementById("shortestActivityType").innerText = sortedDistances[2][0];
	//week
	const longestType = sortedDistances[0][0];
	let weekdayTotal = 0, weekdayCount = 0;
	let weekendTotal = 0, weekendCount = 0;
	validTweets.forEach(tweet => {
		if (tweet.activityType === longestType) {
			const day = tweet.time.getDay();
			if (day === 0 || day === 6) {
				weekendTotal += tweet.distance;
				weekendCount++;
			} else {
				weekdayTotal += tweet.distance;
				weekdayCount++;
			}
		}
	});
	let result = "unknown";
	const weekdayAvg = weekdayTotal / weekdayCount;
	const weekendAvg = weekendTotal / weekendCount;
	result = weekdayAvg > weekendAvg ? "weekdays" : "weekends";
	document.getElementById("weekdayOrWeekendLonger").textContent = result;
	///part2
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": validTweets
		},
		//TODO: Add mark and encoding
		"width": 1000,
		"height": 400,
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "activityType",
				"type": "nominal",
				"title": "Activity Type",
				"sort": "-y",
				"axis": {
					"labelAngle": 0
				}
			},
			"y": {
				"aggregate": "count",
				"type": "quantitative",
				"title": "Number",
				"axis": {
					"tickCount": 10
				}
			},
			"tooltip": {
				"aggregate": "count",
				"type": "quantitative",
				"title": "Number"
			}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, { actions: false });

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	// Prepare data for the distance visualizations
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const distanceData = validTweets.filter(tweet => topThree.includes(tweet.activityType))
		.map(tweet => ({
			activityType: tweet.activityType,
			distance: tweet.distance,
			day: days[tweet.time.getDay()]
		}));
	//plot2
	const distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A plot of the distances by day of the week for three most tweeted-about activities.",
		"data": {
			"values": distanceData
		},
		"width": 500,
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"axis": {
					"labelAngle": 0
				},
				"type": "ordinal",
				"title": "time (day)",
				"sort": days
			},
			"y": {
				"field": "distance",
				"type": "quantitative"
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"title": "Activity Type"
			}
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });
	//plot3
	const mean_distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A plot of the mean distances by day of the week for three most tweeted-about activities.",
		"data": { "values": distanceData },
		"width": 500,
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"axis": {
					"labelAngle": 0
				},
				"type": "ordinal",
				"title": "time (day)",
				"sort": days
			},
			"y": {
				"field": "distance",
				"aggregate": "mean",
				"type": "quantitative",
				"title": "Mean of distance"
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"title": "Activity Type"
			}
		}
	};
	vegaEmbed('#distanceVisAggregated', mean_distance_vis_spec, { actions: false });
	//button
	const aggregateButton = document.getElementById("aggregate");
	const distanceVis = document.getElementById("distanceVis");
	const meanDistanceVis = document.getElementById("distanceVisAggregated");

	aggregateButton.style.display = "block";
	aggregateButton.style.position = "relative";
	aggregateButton.style.marginBottom = "10px";

	meanDistanceVis.style.display = "none";

	aggregateButton.addEventListener("click", function () {
		const showingMeans = meanDistanceVis.style.display === "none";
		//change 2
		distanceVis.style.display = showingMeans ? "none" : "block";
		meanDistanceVis.style.display = showingMeans ? "block" : "none";
		//change button
		aggregateButton.textContent = showingMeans
			? "Show all activities"
			: "Show means";
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});