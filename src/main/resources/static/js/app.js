    var $loginContent = $('.login-content'),
        $errorContent = $('.error-content'),
        $loginData = $('.login-data'),
        authenticated = false,
        headers = {},

        loadProtectedResources = function (data) {

            if (data && data.name) {

                $('.user-value').append(data.name);

                $.ajax('http://localhost:8080/resource', {
                    headers: headers,
                    contentType: 'application/json; charset=UTF-8',
                    success: function (data, status) {

                        $('.id-value').append(data.id);
                        $('.data-value').append(data.content);

                        $errorContent.hide();
                        $loginContent.show();
                    },
                    error: function (qjXhr, textStatus, error) {

                        $('.error-value').append(textStatus);

                        $loginContent.hide();
                        $errorContent.show();
                    }
                });

            } else {
                authenticated = false;
            }
        },

        clearLoginData = function() {
            $('.error-value').empty();
            $loginData.empty();
        },

        onLogout = function() {
            authenticated = false;
            $loginContent.hide();
            updateAuthenticationStatus();
        },

        updateAuthenticationStatus = function() {
            $('.authentication-status').empty();
            $('.authentication-status').append('<p>Authenticated: ' + authenticated + '</p>');
        }

        authenticate = function (credentials, beforeAuthenticate, onSuccessfulAuthenticate) {
            var headers = credentials ? {
                'X-Request-With': 'XMLHttpRequest',
                'Authorization': "Basic " + btoa(credentials.username + ":" + credentials.password)
            } : {};

            if ($.isFunction(beforeAuthenticate)) {
                beforeAuthenticate();
            }

            $.ajax('http://localhost:8080/user', {
                headers: headers,
                contentType: 'application/json; charset=UTF-8',
                success: $.isFunction(onSuccessfulAuthenticate) ?
                    function(data) {
                        authenticated = true;
                        onSuccessfulAuthenticate(data);
                        updateAuthenticationStatus();
                    } :
                    function() {
                        authenticated = true;
                        updateAuthenticationStatus()
                    },

                error: function (xhr, status, error) {
                    authenticated = false;
                    $('.error-value').append(error);

                    $loginContent.hide();
                    $errorContent.show();
                }
            });
        };

    $('button').on("click", function() {
        var credentials = {
            username: $("input[type='text']").val(),
            password: $("input[type='password']").val()
        };

        authenticate(
            credentials,
            clearLoginData,
            loadProtectedResources
        );
    })

    $('.logout').on('click', function() {

        $('.error-value').empty();
        $loginData.empty();

        $.ajax("http://localhost:8080/logout", {
            headers: headers,
            contentType: 'application/json; charset=UTF-8',
            success: onLogout,
            error: onLogout
        });
    });
