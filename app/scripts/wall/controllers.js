var wallApp = angular.module('wallApp', ['VotingService']);

wallApp.controller('NoticeController', [ '$scope', function ($scope) {

    var self = this;

    this.notices = [ "Wifi SSID: devoxx14 password: devoxx14" ]; // <- Add String messages here

    setInterval(cycleNotices, 10 * 1000);
    var noticeIndex = 0;

    $scope.notice = this.notices.length > 0 ? this.notices[0] : null;

    function cycleNotices() {

        $scope.$apply(function(){

            if (self.notices.length == 0) {
                $scope.notice = null;
            } else {
                if (noticeIndex >= self.notices.length) {
                    noticeIndex = 0;
                }
                $scope.notice = self.notices[noticeIndex];
                noticeIndex++;
            }

        });

    }
}]);

wallApp.controller('TwallController', ['$http', '$scope', function ($http, $scope) {

    window.tc = this;
    var self = this;

    var MAX = 4;
    var maxTweetId = 0;

    this.tweetQueue = [];
    $scope.tweets = [];
    $scope.scrollClass = "";
    this.blacklist = [];

    this.refreshRemoteData = function() {

        $http.get(baseUri + "twitter/devoxx")
            .then(function(data){

                if ("" == data.data) {
                    console.error('Failed to call Twitter REST');
                    return;
                }

                var orderedTweets = _.sortBy(data.data, "id");

                orderedTweets.forEach(function (result) {
                    var tweet = new Tweet(result);
                    // Prevent the latest search results from popping up multiple times in our queue
                    if (maxTweetId < tweet.id) {
                        maxTweetId = tweet.id;
                        self.tweetQueue.push(tweet);
                    }
                });

                if ($scope.tweets.length == 0) {
                    setTimeout(self.tweetQueueProcessor, 0); // Populate on init (via timeout to avoid nested scope.apply)
                }
            });
    };

    this.tweetQueueProcessor = function() {
        $scope.$apply(function(){

            // Initialisation
            if ($scope.tweets.length < MAX) {
                while ($scope.tweets.length < MAX && self.tweetQueue.length > 0) {
                    $scope.tweets.push(self.tweetQueue.shift());
                }

            }
            // Regular operation
            else if (self.tweetQueue.length > 0) {
                $scope.tweets.push(self.tweetQueue.shift());
                $scope.scrollClass = "scrollup";
                setTimeout(shiftTweets, 1900);
            }

        });

        function shiftTweets() {

            $scope.$apply(function(){
                $scope.tweets.shift();
                $scope.scrollClass = "";
            });
        }
    };

    setTimeout(init, 0);
    function init() {
        self.refreshRemoteData();
        setInterval(self.refreshRemoteData, 10000);
        setInterval(self.tweetQueueProcessor, 3000);
    }
}]);

var lsc = new LocalStorageController();

function LocalStorageController() {

    var DAY_KEY = 'day_';
    var DAYMD5_KEY = 'md5_' + DAY_KEY;
    var SPEAKER_KEY = 'speaker';
    var SCHEDULE_KEY = 'schedule';

    var self = this;

    this.hasDay = function(dayNr) {
        try {
            return localStorage.getItem(key(dayNr)) != null;
        } catch(e) {
            console.error('Error HAS day ' + dayNr + ' in LocalStorage: ' + e.message);
        }
        return false;
    };

    /**
     * Check if the ScheduleItems Array has changed.
     * @param dayNr the Day NR
     * @param dayScheduleItems ScheduleItems Array or JSON stringified
     */
    this.hasChanged = function(dayNr, dayScheduleItems) {
        try {
            var json = typeof(dayScheduleItems) == "string" ? dayScheduleItems : JSON.stringify(dayScheduleItems);
            var hashFromJson = md5(json);
            var hashFromStorage = localStorage.getItem(keymd5(dayNr));
            return hashFromStorage != hashFromJson;
        } catch(e) {
            console.error('Error MD5 day ' + dayNr + ' from LocalStorage: ' + e.message);
        }
        return true;
    };

    this.getDay = function(dayNr) {
        try {
            console.log('GET day ' + dayNr + ' from LocalStorage');
            var data = localStorage.getItem(key(dayNr));
            if (data == undefined) {
                return data;
            } else {
                return JSON.parse(data);
            }
        } catch(e) {
            console.error('Error GET day ' + dayNr + ' from LocalStorage: ' + e.message);
        }
    };

    /**
     * Set the ScheduleItems for a day.
     * @param dayNr day NR
     * @param dayScheduleItems ScheduleItems Array
     * @return TRUE if the data was changed, FALSE if it's not changed or stored
     */
    this.setDay = function(dayNr, dayScheduleItems) {
        try {
            console.log('SET day ' + dayNr + ' to LocalStorage');
            var json = JSON.stringify(dayScheduleItems);
            if (self.hasChanged(dayNr, json)) {
                var hash = md5(json);
                localStorage.setItem(key(dayNr), json);
                localStorage.setItem(keymd5(dayNr), hash);
                console.log('ScheduleItems changed for day ' + dayNr);
                logStorageSize();
                return true;
            }
        } catch(e) {
            console.error('Error SET day ' + dayNr + ' to LocalStorage: ' + e.message);
        }
        return false;
    };

    this.setSpeakers = function(speakers) {
        try {
            localStorage.setItem(SPEAKER_KEY, JSON.stringify(speakers));
            logStorageSize();
        } catch(e) {
            console.error('ERROR Storing Speakers error: ' + e.message);
        }
    };

    this.getSpeakers = function() {
        try {
            var data = localStorage.getItem(SPEAKER_KEY);
            if (data == undefined) {
                return data;
            } else {
                return JSON.parse(data);
            }
        } catch(e) {
            console.error('ERROR Loading Speakers error: ' + e.message);
        }
    };

    this.clear = function() {
        try {
            localStorage.clear();
            logStorageSize();
        } catch(e) {
            console.error('Error clearing LocalStorage: ' + e.message);
        }
    };

    this.hasSchedule = function () {
        try {
            var data = localStorage.getItem(SCHEDULE_KEY);
            return !(data == undefined || data == null);
        } catch (e) {
            return false;
        }
    };

    this.setSchedule = function (scheduleItems) {
        var map = {};
        for (var i = 0; i < scheduleItems.length; i++) {
            map[scheduleItems[i].id] = scheduleItems[i];
        }
        localStorage.setItem(SCHEDULE_KEY, JSON.stringify(map));
    };

    this.getSchedule = function () {
        try {
            var data = localStorage.getItem(SCHEDULE_KEY);
            if (data == undefined) {
                return data;
            } else {
                return JSON.parse(data);
            }
        } catch(e) {
            console.error('ERROR Loading Speakers error: ' + e.message);
        }
    };

    function key(dayNr) {
        checkDay(dayNr);
        return DAY_KEY + dayNr;
    }

    function keymd5(dayNr) {
        checkDay(dayNr);
        return DAYMD5_KEY + dayNr;
    }

    function checkDay(dayNr) {
        if (typeof(dayNr) == 'number' && dayNr >= 1 && dayNr <= 5) {
            return;
        }
        console.error("Invalid dayNr: " + dayNr);
    }

    function logStorageSize() {
        var size = 0;
        for (var i = 0; i < localStorage.length; i++) {
            size += localStorage.getItem(localStorage.key(i)).length;
        }
        console.log(size, 'Bytes in LocalStorage,', 2.5 * 1024 * 1024 - size, 'available.');
    }
}

var scheduleLoadedDefer = $.Deferred();
var scheduleLoaded = scheduleLoadedDefer.promise();

/**
 * ScheduleController, instantiated by AngularJS.
 * @param $xhr
 * @param $defer
 * @param $updateView
 */
wallApp.controller('ScheduleController', [ '$http', '$scope', '$q', function ($http, $scope, $q) {

    window.sc = this; // Global var to interact with from console

    var self = this;

    $scope.scheduleNow = [];
    $scope.scheduleNext = [];
    $scope.scrollClass = "";

    var speakers = [];

    var currentTime = new Date();
    var currentDay = day(currentTime);
    var currentData = [];

    setTimeout(init, 0); // Schedule init() call after Object is loaded.
    function init() {

        $scope.$apply(function(){

            var onDone = function() {

                if ( (!lsc.hasDay(currentDay)) || (! lsc.hasSchedule())) {
                    self.refreshRemoteData();
                } else {
                    currentData = lsc.getDay(currentDay);
                    updateModels();
                    console.log("Resolve after speakers");
                    scheduleLoadedDefer.resolve();
                }

                var MINUTES_10 = 1000 * 60 * 10;
                setInterval(self.refreshRemoteData, MINUTES_10);

            };

            preLoadSpeakerImageUrls(onDone);

            function preLoadSpeakerImageUrls(done) {
                console.log('Preloading all speaker images...');
                try {
                    var fullScheduleUrl = baseUriV1 + "events/10/speakers";
                    $http.get(fullScheduleUrl)
                        .then(function (data, code) {
                            if ("" == data.data) {
                                console.error('Failed to call CFP REST');
                                speakers = lsc.getSpeakers();
                            } else {

                                data.data.forEach(function (item) {
                                    speakers.push(new Speaker(item));
                                });

                                lsc.setSpeakers(speakers);
                            }

                            done();

                        });
                } catch (e) {
                    console.error('Failed to preload speaker images: ' + e.message);
                    done();
                }
            }

        });
    }

    this.nowAndNextTimer = function() {
        currentTime = new Date();
        var dayNr = day(currentTime);
        if (dayNr != currentDay) {
            currentDay = dayNr;
            currentData = lsc.getDay(dayNr);
        }
        console.log("NowAndNextTime", currentTime.toLongDateString(), currentDay);
        $scope.$apply(updateModels);
    };

    var MINUTES_1 = 1000 * 60;
    setInterval(self.nowAndNextTimer, MINUTES_1);

    this.refreshRemoteData = function() {

        $http.get(baseUriV1 + "events/10/schedule")
            .then(function(data, code) {
                if ("" == data.data) {
                    console.error('Failed to call CFP REST');
                    return;
                }
                console.log("Received Schedule");

                var tak = filterTalksAndKeynotes(data.data, speakers);

                lsc.setSchedule(tak);

                var group = [];
                var itemDay = 1;
                tak.forEach(function(item) {
                    if (item.day != itemDay) {
                        storeDay(itemDay, group);
                        itemDay = item.day;
                        group = [];
                    }
                    group.push(item);
                });
                storeDay(itemDay, group);

                function storeDay(itemDay, group) {
                    var changed = lsc.setDay(itemDay, group);
                    if (changed && currentDay == itemDay) {
                        currentData = group;
                        updateModels();
                    }
                }

            }).then(scheduleLoadedDefer.resolve());
    };

    function updateModels() {

        console.log('ScheduleItem data changed for day ' + currentDay + ' updating models...');

        var KEYNOTE = "Keynote";
        var keynoteStartTime;
        var keynoteEndTime;

        $scope.scheduleNow = [];
        $scope.scheduleNext = [];

        var slots = defineSlots(currentData);
        var nowAndNext = nowAndNextSlot(slots);

        $scope.scheduleNow = filterTime(nowAndNext[0]);
        $scope.scheduleNext = filterTime(nowAndNext[1]);
        $scope.scrollClass = $scope.scheduleNext.length != 0 ? "sidescroll" : "";

        console.log("Slots", slots, "NowAndNext", nowAndNext);
        console.log("NOW:", $scope.scheduleNow);
        console.log("NEXT:", $scope.scheduleNext);

        function defineSlots(items) {
            var slots = [];
            items.forEach(function(item) {

                var slot = item.type == KEYNOTE ? KEYNOTE : item.time;

                if (slot == KEYNOTE && keynoteStartTime == undefined) {
                    keynoteStartTime = Date.parseExact(item.time, "HH:mm").withTodaysDate();
                }
                if (slot != KEYNOTE && keynoteStartTime != undefined && keynoteEndTime == undefined) {
                    keynoteEndTime = Date.parseExact(item.time, "HH:mm").withTodaysDate();
                }

                if (slots.indexOf(slot) == -1) {
                    slots.push(slot);
                }

            });
            return slots;
        }

        function nowAndNextSlot(slots) {
            var nowAndNext = [];
            var now = currentTime;
            slots.forEach(function(slot) {

                var slotDate;
                var match = false;

                if (slot == KEYNOTE) {
                    match = now.before(keynoteStartTime.withDate(now)) || now.between(keynoteStartTime.withDate(now), keynoteEndTime.withDate(now));
                } else {
                    slotDate = Date.parseExact(slot, "HH:mm").withDate(now);
                    match = slotDate.after(now);
                }
                if (match && nowAndNext.length < 2) {
                    nowAndNext.push(slot);
                }
            });
            return nowAndNext;
        }

        function filterTime(time) {
            if (time == undefined) {
                return [];
            }
            var items = [];
            currentData.forEach(function(item) {
                if ((time == KEYNOTE && item.type == KEYNOTE) || (time == item.time)) {
                    items.push(item);
                }
            });
            return items;
        }

    }

    function filterTalksAndKeynotes(data, speakers) {
        var talks = [];

        data.forEach(function(item) {

            if (item.kind.match(/Talk|Keynote/)) {

                try {
                    var si = new ScheduleItem(item, findSpeakerImageUrl);
                    talks.push(si);
                } catch (e) {
                    // Ignore buggy scheduleitems
                    console.error(e);
                }
            }
        });


        talks = _.sortBy(talks, "date");
        _.each(talks, function(si){
            console.log("Day: "+ si.day + " Room: " + si.room + " Time: " + si.time + " Title: " + si.title + " Speakers: " + si.speakers + " SpeakerImg: " + si.speakerImgUri);
        });

        function findSpeakerImageUrl(id) {
            if (id) {
                var speakerId = parseInt(id);
                var speakerUrl = null;
                speakers.forEach(function(speaker) {
                    if (speaker.id == speakerId) {
                        speakerUrl = speaker.imageUrl;
                    }
                });

                return speakerUrl
            }
        }

        return talks;
    }

}]);

wallApp.controller('MostPopularOfWeekController',["$scope", "$timeout","VotingService", function($scope, $timeout, VotingService) {

    function enrich (talks) {
        var schedule = lsc.getSchedule();
        angular.forEach(talks, function(value, key){
            value.scheduleItem = schedule[value.talkId];
        });
        return talks;
    }

    function filterKeyNotes (talks) {
        var filtered = [];
        angular.forEach(talks, function(value, key){
            if ((value.scheduleItem) && (value.scheduleItem.type != "Keynote")) {
                filtered.push(value);
            }
        }, filtered);
        return filtered;
    }

    var refreshInterval = 30000;

    var refresh = function() {
        $timeout(function () {
            $scope.$apply(function()  {
                try {
                    VotingService.topOfWeek(function(err, data) {
                        if (err) {
                            console.log("In Error");
                        } else {
                            var filteredData = filterKeyNotes(enrich(data));
                            $scope.topTalksOfWeek = filteredData.slice(0,3);
                            $scope.hasTopTalksOfWeek = (filteredData.length > 0);
                        }
                    });
                    VotingService.topOfToday(function(err, data) {
                        if (err) {
                            console.log("In Error");
                        } else {
                            var filteredData = filterKeyNotes(enrich(data));
                            $scope.topTalksOfToday = filteredData.slice(0,4);
                            $scope.hasTopTalksOfToday = (filteredData.length > 0);
                        }
                    });
                } catch(e) {
                    console.log(e);
                }

            });
            refresh();
        }, refreshInterval);
    };

    scheduleLoaded.then(refresh);
} ]);

