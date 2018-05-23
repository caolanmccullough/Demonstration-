//Connect to pusher by creating new pusher object with AQA pusher App secret and Cluster
$(document).ready(function(){    
    var pusherChat = new Pusher('44854cb20b4f2aed58b0', {
        cluster: 'eu',
        encrypted: false
    });


//Subscribe to channel and event named comment-added.
    let channel = pusherChat.subscribe('aqa-chat');

    //Bind to the click event named submitComment and then retrieve the comment entered from the aqaComment textbox
    channel.bind('comment-added', addComment);

    //Gets the comment to send from the page and then call the server with the comment.
    $('#submitComment').click(function(){
        const comment = $("#aqaComment").val();
        $("#aqaComment").val("");
        //Appending comment to aqaChat div
        $(".aqaChat").append({comment});
        $.post( "http://localhost:3015/aqaComment", { comment } );
    });

    function addComment(data) {
        let template = $("#new-comment").html();
        template = template.replace("{{body}}", data.comment);

        $(".aqaChat").append(template);
    }
});






