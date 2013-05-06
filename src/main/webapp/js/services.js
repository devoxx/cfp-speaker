'use strict';

var genericServicesModule = angular.module('Generic Services', ['ngResource']);

genericServicesModule.factory('EventBus', function($rootScope) {
    var EVENTS_LOADED_MSG = 'devoxx:eventsLoadedMessage';
    return {
        eventsLoaded: function(events) {
            $rootScope.$broadcast(EVENTS_LOADED_MSG, {
                events: events
            });
        },
        onEventsLoaded: function($scope, handler) {
            $scope.$on(EVENTS_LOADED_MSG, function(event, msg) {
                handler(msg.events, event)
            })
        }
    };
});

genericServicesModule.factory('TalksService', function() {
    var list = [
        { id: '1', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'What’s New in JavaFX', state: 'Submitted'},
        { id: '2', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Java EE 7, Infinite Extensibility meets Infinite Reuse', state: 'Submitted'},
        { id: '3', eventfirstName: 'Devoxx', lastName: 'Belgium', title: '7 Things: How to make good teams great', state: 'Submitted'},
        { id: '4', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'What\'s new with Google App Engine and Compute Engine?', state: 'Submitted'},
        { id: '5', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Securing the client side: Building safe web applications with HTML5', state: 'Submitted'},
        { id: '6', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Engineering Elegance: The Secrets of Square\'s Stack', state: 'Submitted'},
        { id: '7', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Designing REST-ful APIs with Spring 3', state: 'Submitted'},
        { id: '8', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'On the road to JDK 8: Lambda, parallel libraries, and more', state: 'Submitted'},
        { id: '9', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'What\'s new with Android', state: 'Submitted'},
        { id: '10', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Eclipse: An Application Lifecycle Management Success Story', state: 'Submitted'},
        { id: '11', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Smart, Small, Connected: Java in the Internet of Things', state: 'Submitted'},
        { id: '12', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Using Java for robotics with Aldebaran\'s humanoid robot NAO', state: 'Submitted'},
        { id: '13', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Home Automation for Geeks', state: 'Submitted'},
        { id: '14', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'OpenShift State of the Union', state: 'Submitted'},
        { id: '15', eventfirstName: 'Devoxx', lastName: 'Belgium', title: 'Closures and Collections - the World After Eight', state: 'Submitted'},

        { id: '20', eventfirstName: 'Devoxx', lastName: 'France', title: 'Developers: Prima Donna\'s of the 21st Century', state: 'Submitted'},
        { id: '21', eventfirstName: 'Devoxx', lastName: 'France', title: 'Elastifiez votre application : du SQL au NoSQL en moins d\'une heure', state: 'Submitted'},
        { id: '22', eventfirstName: 'Devoxx', lastName: 'France', title: 'RealityIS_AGraph', state: 'Submitted'},
        { id: '23', eventfirstName: 'Devoxx', lastName: 'France', title: '"Faciliter le développement d’applications Web hors-ligne en JAVA avec GWT"', state: 'Submitted'},
        { id: '24', eventfirstName: 'Devoxx', lastName: 'France', title: 'Le Space-Mountain du développement Java d\'entreprise', state: 'Submitted'},
        { id: '25', eventfirstName: 'Devoxx', lastName: 'France', title: 'Comparing JVM Web Frameworks', state: 'Submitted'},
        { id: '26', eventfirstName: 'Devoxx', lastName: 'France', title: 'BigData@DevoxxFr, Saison 2', state: 'Submitted'},
        { id: '27', eventfirstName: 'Devoxx', lastName: 'France', title: 'Java EE 7 en détail', state: 'Submitted'},
        { id: '28', eventfirstName: 'Devoxx', lastName: 'France', title: 'No(Geo)SQL', state: 'Submitted'},
        { id: '29', eventfirstName: 'Devoxx', lastName: 'France', title: 'What Every Hipster Should Know About Functional Programming', state: 'Submitted'},
        { id: '30', eventfirstName: 'Devoxx', lastName: 'France', title: 'Architecting for Continuous Delivery', state: 'Submitted'},

        { id: '100', eventfirstName: 'Devoxx', lastName: 'France', title: '55 New features in Java SE 8', state: 'Submitted'},
        { id: '101', eventfirstName: 'Devoxx', lastName: 'France', title: 'Continuous Delivery', state: 'Submitted'},
        { id: '102', eventfirstName: 'Devoxx', lastName: 'France', title: 'JSR 347 - standardising data grids for Java', state: 'Submitted'},
        { id: '103', eventfirstName: 'Devoxx', lastName: 'France', title: 'Apache TomEE, Java EE 6 Web Profile on Tomcat', state: 'Submitted'},
        { id: '104', eventfirstName: 'Devoxx', lastName: 'France', title: 'Are your GC logs speaking to you, the G1GC edition', state: 'Submitted'},
        { id: '105', eventfirstName: 'Devoxx', lastName: 'France', title: 'Effective IDE Usage', state: 'Submitted'},
        { id: '106', eventfirstName: 'Devoxx', lastName: 'France', title: 'Banking, how hard can it be?', state: 'Submitted'},
        { id: '107', eventfirstName: 'Devoxx', lastName: 'France', title: 'Functional is cool, but do you know OO?', state: 'Submitted'},
        { id: '108', eventfirstName: 'Devoxx', lastName: 'France', title: 'Build a web app with WebRTC', state: 'Submitted'},
        { id: '109', eventfirstName: 'Devoxx', lastName: 'France', title: 'Performance Testing Java Applications', state: 'Submitted'},
        { id: '110', eventfirstName: 'Devoxx', lastName: 'France', title: 'Securing the Future with Java', state: 'Submitted'},
        { id: '111', eventfirstName: 'Devoxx', lastName: 'France', title: 'Teaching Java to a 10-year old', state: 'Submitted'},
        { id: '112', eventfirstName: 'Devoxx', lastName: 'France', title: 'Lambdas and Collections in Java 8', state: 'Submitted'},
        { id: '113', eventfirstName: 'Devoxx', lastName: 'France', title: 'Hitting the limits of your hardware with Java', state: 'Submitted'}
    ];

    return {
        allTalksForSpeaker: function() {
            return list;
        },
        byId: function(talkId) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (obj.id === talkId) {
                    return obj;
                }
            }
            return null;
        }
    };
});

genericServicesModule.factory('UsersService', function($q, $filter) {
    var currentUser = {
        id: '123321',
        firstName: 'Jan-Kees', lastName: 'van Andel',
        company: 'JPoint',
        bio: 'Jan-Kees van Andel co-founded JPoint, a Dutch Java company, and is currently working there as a ' +
            'Software Architect (http://www.jpoint.nl). Before starting JPoint, Jan-Kees worked for Ordina as a ' +
            'Java Software Architect at Ordina, where he worked on various projects for various Dutch and ' +
            'international clients. He was also co-author of the book "Software Ontwikkeling in Java EE". He has ' +
            'spoken at local Java events, business clients, JavaOne, Devoxx and Dutch universities. He has taught' +
            'many trainings, including JavaServer Faces, Java, Java EE, web, ajax and security. He currently works ' +
            'for Rabobank as build lead within the CRM department.',
        gravatarThumbUrl: 'http://devoxx.com/download/attachments/6391018/jkva_thumb.JPG?version=1&modificationDate=1346684212000',
        gravatarUrl: 'http://devoxx.com/download/attachments/6391018/jkva_thumb.JPG?version=1&modificationDate=1346684212000'
    };
    var allSpeakers = [
        { id: '1', firstName: 'Jan-Kees', lastName: 'van Andel', email: 'jankeesvanandel@gmail.com' },
        { id: '2', firstName: 'Roy', lastName: 'van Rijn', email: 'roy@jpoint.nl' },
        { id: '3', firstName: 'Edje', lastName: 'Kadetje', email: 'ed@kadet.je' },
        { id: '4', firstName: 'Pipo', lastName: 'de Clown' },
        { id: '5', firstName: 'Henkie', lastName: 'Penkie' },
        { id: '6', firstName: 'Hulk', lastName: 'Hogan' },
        { id: '7', firstName: 'Charlie', lastName: 'Sheene' },
        { id: '8', firstName: 'Al', lastName: 'Bundy' },
        { id: '9', firstName: 'Swiebertje', lastName: 'Joop Doderer' },
        { id: '10', firstName: 'Ongeschoren', lastName: 'Joessoef' },
        { id: '11', firstName: 'Lamme', lastName: 'Frans' },
        { id: '12', firstName: 'Draad', lastName: 'Staal' },
        { id: '13', firstName: 'Hans', lastName: 'Teeuwen' },
        { id: '14', firstName: 'Dit', lastName: 'van der IsEenTest' },
        { id: '15', firstName: 'Klaas', lastName: 'Vaak' },
        { id: '16', firstName: 'Tonny', lastName: 'de Beuker' },
        { id: '17', firstName: 'Bla', lastName: 'der Blaaters' },
        { id: '18', firstName: 'One', lastName: 'and only Dominator' },
        { id: '19', firstName: 'The', lastName: 'Second Dominator' },
        { id: '20', firstName: 'Pff', lastName: 'Dat is de Laatste' }
    ];
    return {
        getCurrentUser: function () {
            return currentUser;
        },
        getAllSpeakers: function() {
            return allSpeakers;
        },
        getSpeakerByEmailAddress: function(email) {
            var speakers = $filter('filter')(allSpeakers, function(s) {
                return s.email === email;
            });
            console.log(speakers)
            var defer = $q.defer();
            if (speakers.length == 1) {
                defer.resolve(speakers[0]);
            } else {
                defer.reject('No speaker found with the given email address');
            }
            return defer.promise;
        }
    }
});

var baseUri = 'http://localhost/staging-cfp/api/v2/proposal';

genericServicesModule.factory('Tags', function($resource, $q, $filter) {
    var cached;
    var map = function(list) {
        var ret = angular.copy(list);
        ret = $.map(ret, function(tag) { return tag.name; });
        return ret;
    };
    var filter = function(list, partialTagName) {
        var ret = angular.copy(list);
        ret = $filter('filter')(ret, partialTagName.toLowerCase());
        ret = $filter('orderBy')(ret, function(o) { return o.toLowerCase(); });
        ret = $filter('limitTo')(ret, 10);
        return ret;
    };
    return {
        query: function(partialTagName) {
            var defer = $q.defer();
            if (!cached) {
                var url = baseUri + '/event/1/tag?size=500';
                var res = $resource(url, { }, {
                    query: { method: 'get', isArray: false }
                });
                res.query({ }, function(data) {
                    cached = map(data.results);
                    defer.resolve(filter(cached, partialTagName));
                }, function(response) {
                    defer.reject('Error loading tags');
                });
            } else {
                defer.resolve(filter(cached, partialTagName));
            }
            return defer.promise;
        }
    }
});

genericServicesModule.factory('Events', function($resource) {
    var url = baseUri + '/event';
    return $resource(url, {}, {
        query: { method: 'get', isArray: true }
    });
});
