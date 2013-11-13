function ScheduleItem(scheduleItem, speakerUrlLookup) {

    if (!scheduleItem.speakers) {
        throw new Error("No Speakers for schedule Item");
    }

    this.id = scheduleItem.id;
    this.type = scheduleItem.kind;
    this.room = getRoom(scheduleItem.room);
    this.day = getDay(scheduleItem.fromTime);
    this.date = getDate(scheduleItem.fromTime);
    this.time = getTime(scheduleItem.fromTime);
    this.speakerId = scheduleItem.speakers && scheduleItem.speakers.length > 0 && scheduleItem.speakers[0].speakerId;
    this.speakers = getSpeakers(scheduleItem.speakers);
    this.speakerImgUrl = getSpeakerImage(this.speakerId);
    this.title = scheduleItem.title;

    /**
     * Return the Speaker Image URL based on the ID from the SpeakerURI property in the JSON response.
     * @param speakerUri SpeakerURI
     */
    function getSpeakerImage(speakerId) {
        return speakerUrlLookup(speakerId);
    }

    function getTime(time) {
        return getDate(time).toString("HH:mm");
    }

    function getDate(time) {
        return Date.parseExact(time, "yyyy-MM-dd HH:mm:ss.0");
    }

    function getDay(time) {
        return day(getDate(time));
    }

    function getRoom(room) {
        return room.replace(/(Room |(B)OF )(\d+)/i, "$2$3"); // Only number for room or B prefix for BOF rooms
    }

    function getSpeakers(speakers) {

        if (!speakers) return "N/A";

        var speakerNames = _.uniq(_.pluck(speakers, "speaker")).join(", ");

        return  speakerNames;
    }

}

function Speaker(speakerItem) {

    this.id = speakerItem.id;
    this.name = speakerItem.firstName + ' ' + speakerItem.lastName;
    this.imageUrl = speakerItem.imageURI;

    this.toString = function() { return this.imageUrl; }

}

function Tweet(tweet) {

    this.id = tweet.id;
    this.author = tweet.fromUser;
    this.image = tweet.profileImageUrl;
    this.tweet = tweet.text;
    this.createdAt = tweet.createdAt;

    this.toString = function() {
        return this.author + " " + this.id;
    }
}