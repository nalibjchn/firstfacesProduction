$(window).on( 'load', function() {

    if ( waitingVariables.tutorial_complete ) {

        showTutorialCompleteDashboard()

    } else {

        $( '#tutorialNotDoneButton' ).click( function(){

            console.log(' in click tutorial button' )
            bookConversation( enterTutorial=true );
            //window.location.href = prefixURL + "conversation_student/" + waitingVariables.tutorial_conversation_id.toString();

        })

    }

    var cont_height = getContHeight();
    $('.cont_').css("height",cont_height);



});

function showTutorialCompleteDashboard() {

    addAvailablesToTimetable( waitingVariables.availables, first=true )
    if ( waitingVariables.currently_in_class ) {

        waitingVariables.conversation_id = waitingVariables.conversations[ 0 ].id;
        $('.enter-button-text').text('continue');

    }

}

function enterConversation() {

    window.location.href = prefixURL + "conversation_student/" + waitingVariables.conversation_id.toString();

}

var prefixURL;
function definePrefixURL() {

    if ( waitingVariables.in_development ) {

        prefixURL = "http://127.0.0.1:8000/"

    } else {

        prefixURL = "https://erle.ucd.ie/"

    }

}
definePrefixURL();

const mediaLocation = "media/";




function getContHeight(){
    return $('#footer').offset()['top'] - parseInt($('#navbar').css('height'));
}

