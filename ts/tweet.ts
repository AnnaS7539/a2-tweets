class Tweet {
    private text: string;
    time: Date;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
    }

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source(): string {
        if (this.text.startsWith("Watch")) {
            return "live_event";
        }

        if (this.text.startsWith("Just")) {
            return "completed_event";
        }

        if (this.text.startsWith("Achieved")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written(): boolean {
        //TODO: identify whether the tweet is written
        return this.text.includes("-");
    }

    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        const start = this.text.indexOf("-") + 1;
        const end = this.text.indexOf("http");
        return this.text.substring(start, end).trim();
    }

    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let unitIndex = this.text.indexOf(" mi ");
        if (unitIndex === -1) {
            unitIndex = this.text.indexOf(" km ");
        }
        if (unitIndex === -1) return "unknown";
        const start = unitIndex + 4;
        let end = this.text.indexOf(" - ", start);
        const withIndex = this.text.indexOf(" with ", start);
        if (end === -1 || (withIndex !== -1 && withIndex < end)) {
            end = withIndex;
        }
        if (end === -1) {
            return "unknown";
        }
        return this.text.substring(start, end).trim();
    }

    get distance(): number {
        if (this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let unitIndex = this.text.indexOf(" mi ");
        if (unitIndex !== -1) {
            const start = this.text.lastIndexOf(" ", unitIndex - 1) + 1;
            return Number(this.text.substring(start, unitIndex));
        }
        unitIndex = this.text.indexOf(" km ");
        if (unitIndex !== -1) {
            const start = this.text.lastIndexOf(" ", unitIndex - 1) + 1;
            const km = Number(this.text.substring(start, unitIndex));
            return km / 1.609;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber: number): string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}