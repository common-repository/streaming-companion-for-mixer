(function($) {
    /* trigger when page is ready */
    $(document).ready(function() {
        var mixerAPI = 'https://mixer.com/api/v1/';
        var streamName = MixerUsername;
        var logo = 'swLogo';
        var channelAPI = mixerAPI + "channels/" + streamName;
        $.ajax({
            url: channelAPI,
            type: 'GET',
            headers: {
                'Client-ID': 'c3e5e8facd13dbd4b6ff3dc5219327f8414af75f5b1d345d' /* Please Put your own Client-ID here. It can be found at https://mixer.com/lab/oauth - Just make sure to CREATE what is called an OAuth Application. Its very easy! */
            },
            success: function(data) {
                if(data.online) {
                    $('body').addClass('online');
                    $('.cp-header__indicator').addClass('cp-header__indicator--online');
                    $('.cp-header__game-playing .cp-header__middle--line-2').text(data.type.name); /* Partially Functioning. Pulls stream title rather than game */
                    $('.cp-nav__game-playing--line-2').text(data.type.name); /* Partially Functioning. Pulls stream title rather than game */
                    $('.cp-header__viewers .cp-header__middle--line-2').text(data.viewersCurrent);
                    $('.button--watch-now').attr('href', 'https://mixer.com/' + streamName);
                    console.log('Querying ' + streamName + ' - streamer online...', data.stream);
                } else {
                    console.log('Querying ' + streamName + ' - streamer offline...', data);
                }
            },
            error: function(data) {
                console.log('Querying ' + streamName + ' - Mixer API error...', data);
            }
        });



        function getStreamId(streamName){
          let ID;
        $.ajax({
            url: channelAPI,
            type: 'GET',
            headers: {
               'Client-ID': 'c3e5e8facd13dbd4b6ff3dc5219327f8414af75f5b1d345d' /* Please Put your own Client-ID here. It can be found at https://mixer.com/lab/oauth - Just make sure to CREATE what is called an OAuth Application. Its very easy! */
            },
            success: function(data) {
                ID = data.id;
            },
            error: function(data) {
              console.log('[Easy Embed Twitch] - Failed to retrieve StreamId')
            },
            complete: function(data) {
              console.log('[Easy Embed Twitch] - Success - retrieved StreamId')
              getVods(ID)
            }
        });
        }
/* FROM THIS POINT ONWARDS - THIS CODE IS NON FUNCTIONAL. It is being worked on! */
        function getVods(ID) {
            var videoURL = `https://mixer.com/api/v1/channels/${ID}/recordings?limit=6&order=createdAt:DESC`;
            $.ajax({
                url: videoURL,
                type: 'GET',
                headers: {
                    'Client-ID': 'c3e5e8facd13dbd4b6ff3dc5219327f8414af75f5b1d345d' /* Please Put your own Client-ID here. It can be found at https://mixer.com/lab/oauth - Just make sure to CREATE what is called an OAuth Application. Its very easy! */
                },                
                success: function(data) {
                    var vods = data;
                    $('.cp-blog__stream').show();
                    $('.cp-blog__posts').removeClass('cp-blog__posts--full-width');
                    if (vods !== 0) {
                        let max_vods = 6;
                        if (vods.length < max_vods){
                            max_vods = vods.length;
                        }
                        for (var i = 0; i < max_vods; i++) {
                            let preview = vods[i].vods[1].baseUrl + '720.jpg'; 
                            let vodId = vods[i].id;
                            let vodTitle = vods[i].title;
                            let template = '<div class="cp-blog__vods-tile"><a class="cp-blog__vods-link button--modal" href="https://mixer.com/embed/player/'+streamName+'?vod='+vodId+'"> <img class="cp-blog__vods-image" src="' + preview + '" /><h4 class="cp-blog__vods-title">' + vodTitle + '</h4><div class="cp-blog__vods-overlay"><span class="icon-play"></span></div></a></div>';
                            $('.cp-blog__vods').append(template);
                        }
                    } else {
                        console.log('no vods found, hiding vod section...');
                          $('.cp-blog__stream').hide();
                        $('.cp-blog__posts').addClass('cp-blog__posts--full-width');
                    }
                },
                error: function(data) {
                    console.log('no vods found, hiding vod section...');
                    $('.cp-blog__stream').hide();
                    $('.cp-blog__posts').addClass('cp-blog__posts--full-width');
                }
            });
        }

        if ($('.cp-blog__vods').length) {
            getStreamId(streamName);
        }

        $(document).on('click', '.cp-modal', function() {
            $('.cp-modal').removeClass('cp-modal--active');
            $('.cp-modal iframe').attr('src', '');
        });

        $(document).on('click', '.button--modal', function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            $('.cp-modal iframe').attr('src', url);
            $('.cp-modal').addClass('cp-modal--active');
        });
        
        if (!$('body').hasClass('broadcast-pro')) {
            if ($('.cp-affiliates').hasClass('cp-affiliates--hide')) {
                $('.cp-affiliates').removeClass('cp-affiliates--hide')
            }
            $('.cp-affiliates__wrapper').prepend('<a href="https://www.streamweasels.com/?affiliate=true" target="_blank"><img src="'+logo+'"></a>')
        }

    });
})(jQuery)