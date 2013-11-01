$.ajaxSetup({
    contentType: 'application/json',
    processData: false
});

function getCurrentUserToken() {
    return $.cookie('userToken');
}

function userIsLogged() {
    var url = window.DEVOXX_CONFIG.url + '/v2/auth/token';
    var userToken = getCurrentUserToken();
    if (!userToken) {
        return $.Deferred().reject();
    }
    url += '?userToken=' + userToken;
    return $.post(url, {});
}

function presIsFavorite(presId) {
    var defer = $.Deferred();
    if (presId) {
        fetchFavorites() //
            .done(function (favorites) {
                var presIds = getAndSavePresIds(favorites);
                var found = presIds.some(function (id) {
                    return id === presId;
                });
                defer.resolve(found);
            }) //
            .fail(function () {
                defer.reject();
            });

    } else {
        defer.reject();
    }
    return defer.promise();
}

function addToFavorite(presId) {
    var favorite = $.localStorage('favorite');

    var index = favorite.presentationIds.indexOf(presId);
    if (index < 0) {
        favorite.presentationIds.push(presId);
    }
    return updateFavorite(favorite);
}

function updateFavorite(favorite) {
    var url = window.DEVOXX_CONFIG.url + '/v2/info/userSchedule?userToken=' + getCurrentUserToken();

    return $.ajax({
        url: url,
        type: 'PUT',
        data: JSON.stringify([favorite]),
        contentType: 'application/json'
    });
}

function delFromFavorite(presId) {
    var favorite = $.localStorage('favorite');

    var index = favorite.presentationIds.indexOf(presId);
    if (index >= 0) {
        favorite.presentationIds.splice(index, 1);
    }
    return updateFavorite(favorite);
}

function fetchFavorites() {
    var userToken = getCurrentUserToken();
    var url = window.DEVOXX_CONFIG.url + '/v2/info/userSchedule';
    url += '?userToken=' + userToken;
    return $.ajax({
        url: url,
        type: 'PUT',
        data: '[]',
        contentType: 'application/json'
    });
}

var favoriteTemplate = {
    "eventId": window.DEVOXX_CONFIG.id,
    "deleted": false,
    "presentationIds": []
};

function getAndSavePresIds(favorites) {
    if (favorites) {
        var favorites = favorites.filter(function (favorite) {
            return favorite.eventId === window.DEVOXX_CONFIG.id;
        });
        if (favorites && favorites.length) {
            $.localStorage('favorite', favorites[0]);
            return favorites[0].presentationIds;
        }
    }
    $.localStorage('favorite', favoriteTemplate);
    return [];
}

function manageFavoritesLinks() {

    var favoritesLinks = $(".favorite");

    favoritesLinks.each(function () {
        var presId = parseInt($(this).attr('data-pres'));
        bindFavoriteButton(presId, false, $(this), false);
    });

    userIsLogged() //
        .done(function () {
            favoritesLinks.show();
            fetchFavorites() //
                .done(function (favorites) {
                    var presIds = getAndSavePresIds(favorites);
                    $.each(presIds, function (index, value) {
                        var link = favoritesLinks.filter("[data-pres='" + value + "']");
                        link.addClass('on');
                        var presId = parseInt(link.attr('data-pres'));
                        bindFavoriteButton(presId, true, link, false);
                    });
                });
        });
}

function bindFavoriteButton(presId, isFavorite, favButton, hasText) {
    favButton.unbind('click');
    if (isFavorite) {
        if (hasText) {
            favButton.text('UNFAVORITE');
        } else {
            favButton.addClass('on');
        }
        favButton.click(function () {
            delFromFavorite(presId).done(function (favorites) {
                getAndSavePresIds(favorites);
                bindFavoriteButton(presId, !isFavorite, favButton, hasText);
            });
        });
    } else {
        if (hasText) {
            favButton.text('ADD TO FAVORITES');
        } else {
            favButton.removeClass('on');
        }
        favButton.click(function () {
            addToFavorite(presId).done(function (favorites) {
                getAndSavePresIds(favorites);
                bindFavoriteButton(presId, !isFavorite, favButton, hasText);
            });
        });
    }
}

function managePresentationFavorite(presId) {
    var favButton = $('#addToFavorites');
    userIsLogged() //
        .done(function () {
            presIsFavorite(presId) //
                .done(function (isFavorite) {
                    favButton.show();
                    favButton.attr('data-favorite', isFavorite);
                    bindFavoriteButton(presId, isFavorite, favButton, true);
                }).fail(function () {
                    favButton.hide();
                });
        });
}
