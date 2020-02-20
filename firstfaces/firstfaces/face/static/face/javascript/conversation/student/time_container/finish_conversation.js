function storeFinalEmotion() {

    conversationVariables.ratings.emotion = parseInt($(this).attr('id').substring( 5, 6 ))
    $(this).css( {
        
        'background-color': '#102858',
    
    } );
    $('.emojis').unbind();
  //console.log('conversationVariables.ratings.emotion:', conversationVariables.ratings.emotion );

    $( '#feelNowContainer' ).fadeOut( function() {

        $( '#commentsContainer' ).fadeIn();

    } );

}

function endConversation() {

    $('#finishClassBtn').unbind();
    $.ajax({
        url: "/store_conversation_over",
        type: "POST",
        data: {
            'ratings': JSON.stringify(conversationVariables.ratings),
            'convId': conversationVariables.conversation_dict.id,
            'points': conversationVariables.totalPoints,
            'tutorial_complete':!conversationVariables.tutorial,
        },
        success: function(json) {

            window.location.href = "/waiting"

        },
        error: function() {
            alert("unsuccessful POST to store_conversation_over");
        },
    });


}
