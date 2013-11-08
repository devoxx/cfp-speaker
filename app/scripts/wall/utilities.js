
Date.prototype.before = function(other) {
    return this.compareTo(other) < 0;
}
Date.prototype.after = function(other) {
    return this.compareTo(other) > 0;
}
Date.prototype.withDate = function(date) {
    this.setFullYear(date.getFullYear());
    this.setMonth(date.getMonth());
    this.setDate(date.getDate());
    return this;
}
Date.prototype.withTodaysDate = function(date) {
    return this.withDate(new Date());
}

function day(date) {
    var startOfEvent = new Date(2013, 10, 11);
    var theDay = date == undefined ? Date.today() : date;
    var diff = theDay.getDayOfYear() - startOfEvent.getDayOfYear() + 1;
    var eventDay = diff >= 1 && diff <= 5 ? diff : 1; // Default to day1 to show something
    return eventDay;
}