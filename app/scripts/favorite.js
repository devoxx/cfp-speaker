$.ajaxSetup({
    contentType: 'application/json',
    processData: false
});

function getCurrentUserToken() {
    return $.cookie('userToken');
}

function setCurrentUserToken(userToken) {
    $.cookie('userToken', userToken);
}

function userIsLogged() {
    var url = window.DEVOXX_CONFIG.url + '/v2/auth/token';
    var userToken = getCurrentUserToken();
    if (!userToken) {
        return $.Deferred().reject();
    }
    url += '?userToken=' + userToken;
    return $.post(url)
        .done(function (data) {
            var user = data.firstname + ' ' + data.lastname;
            $('#userNames').text(user);
            $('#login').hide();
            $('#logged').show();
        });
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

function manageFavoritesLinks(presentationId) {

    function hideFavoritesButtons() {
        $('.button.myschedule').hide();
        favButton.hide();
        favoritesLinks.hide();
    }

    var favoritesLinks = $(".favorite");

    favoritesLinks.each(function () {
        var presId = parseInt($(this).attr('data-pres'));
        bindFavoriteButton(presId, false, $(this), false);
    });

    var favButton = $('#addToFavorites' + presentationId);

    userIsLogged() //
        .done(function () {

            favoritesLinks.show();
            favButton.show();
            bindFavoriteButton(presentationId, false, favButton, true);

            fetchFavorites() //
                .done(function (favorites) {
                    var presIds = getAndSavePresIds(favorites);
                    $.each(presIds, function (index, value) {
                        var presId = parseInt(value);
                        var link = favoritesLinks.filter("[data-pres='" + value + "']");
                        if (link.length) {
                            link.addClass('on');
                            bindFavoriteButton(presId, true, link, false);
                        }
                        if (presId === presentationId) {
                            bindFavoriteButton(presId, true, favButton, true);
                        }
                    });
                }).fail(function () {
                    hideFavoritesButtons();
                });
        }).fail(function () {
            hideFavoritesButtons();
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

function staticlogin() {
    var username = $('[name="login"]').val();
    var pass = $('[name="pass"]').val();

    var url = window.DEVOXX_CONFIG.url + '/v2/auth/login';

    var data = JSON.stringify({
        login: username,
        password: pass
    });

    var log = $.ajax({
        url: url,
        type: 'POST',
        data: data,
        contentType: 'application/json'
    });

    log.done(function (data) {
        setCurrentUserToken(data.userToken);
        $('#userNames').text(data.user);
        $('#login').hide();
        $('#logged').show();

        var presId = parseInt(getURLParameter('presId') || 0);

        manageFavoritesLinks(presId);
    });

    log.fail(function (data) {
        $('#login .alert.alert-error').show().text(JSON.parse(data.responseText).msg);
        $('#logged').hide();
        $('#login').show();
    });
}

function staticlogout() {
    $.removeCookie('userToken');
}
