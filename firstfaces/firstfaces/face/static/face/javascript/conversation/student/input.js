function initInputReady( from, showPtsBool=false ) {
    conversationVariables.stage2 = false;
    conversationVariables.stage3 = false;
    // tia's eyelids werren't closing properly this below is a failsafe to reset them.
    movementController( movementObject.abs.blank, 1, 1 );
    hideOverlayStuff();   
    buttonsMicrophoneOnly();
    
    if ( from === 'try again' ) {
        conversationVariables.trying_again = true;
        $( '#textInputContainer' ).fadeIn();
        $( '#sentenceShowHolder').fadeIn();
        $('.play-btn').hide();
        let sentString = makeStringSentFromArray(conversationVariables.conversation_dict.completed_sentences[0].sentence);

        reset_text( sentString );

    } else {
        conversationVariables.trying_again = false;
        $( '#sentenceShowHolder').hide();
        $('.play-btn').prop( "disabled", true).hide();
    
    }

    if ( conversationVariables.conversation_dict.completed_sentences.length !== 0 && !conversationVariables.tutorial ) {
  
        $( '#prevSentsIconContainer' ).show();
        addPreviousSentences( conversationVariables.conversation_dict, 0 );
    
    }

    //console.log( 'in initInputReady' );

    if ( showPtsBool ) {

        showPts();

    }

}

function showPts() {

    if ( conversationVariables.experimental_group !== "control" ) {

        if ( conversationVariables.conversation_dict.completed_sentences.length !== 0 ) {
            
            //$( '#ErleESymbolContainer' ).html( '<img id="ErleESymbol" src="/static/face/JSON/ErleESymbolWhite.png">' )
            let totalPoints = getTotalPointsForAClass(conversationVariables.conversation_dict.completed_sentences)

            let pts = 0;
            if ( ['P', 'B' ].includes( conversationVariables.conversation_dict.completed_sentences[ 0 ].judgement ) ) {

                pts = convertCorrectSentenceLengthToPoints( conversationVariables.conversation_dict.completed_sentences[ 0 ].sentence.length )

            }

            if ( totalPoints === 0 ) {

                $( '#finishPts' ).html( totalPoints.toString() )

            } else if ( pts > 0 ) {

                $( '#finishPtsAdd' ).text( "+" + pts.toString() )
            
                $( '#finishPtsAdd' ).show( function() {

                    $( '#finishPts' ).html( totalPoints.toString() )
                    $( '#finishPts' ).css( 'font-size', '28' )
                 
                    setTimeout( function() {

                        $( '#finishPts' ).css( 'font-size', '24' )

                        setTimeout( function() {

                            $( '#finishPtsAdd' ).fadeOut();

                        }, 500 );

                    }, 500 )

                });
                        
            }

        }

    }

}

function hideOverlayStuff() {

    //playback buttons disabled until recording done
    //$('#recordBtnsCont').fadeIn(1000)
    //hide correctTranscript
    $('#correctTranscript').hide();
    //hide back button
    $('#backErrorSelection').hide();
    // hide forward button
    $('#forwardErrorSelection').hide();
    
    $('#backCorrection').hide();
    $('#submitCorrectedErrors').hide();

}
 
function makeStringSentFromArray( s ) {

    let sentString = "";
  //console.log('s:', s)
    s.forEach( function( wordArray ) {

        sentString += wordArray[ 0 ] + " ";

    });

    return sentString.trim();

}














