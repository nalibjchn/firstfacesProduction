function tiaSpeak( tiaSays, cont=true, speakCb=function(){} ) {

    // tiaSays is an identifier in the synthesisObject object which contains the string, phones and URL for the wav file
    // cont=true if tia speaks multiple sentences one after the other. If false (usually prompt) a button will apppear for the user to click before continuing

    $('#recordBtnsCont').hide();
    synthesisObject.sentenceNo = 0; // this iterates when multiple sentences need to be spoken
    
    if ( !cont ) {

        synthesisObject.continuous = false;

    }

    // put this on page load somewhere so not calling it every time
    synthesisObject.audio.ondurationchange = function() {

        synthesisObject.now.noOfPhones = synthesisObject.now.phones[ synthesisObject.sentenceNo ].length;

        synthesisObject.now.noOfFrames = Math.floor( synthesisObject.audio.duration * 60 )
        synthesisObject.now.noOfFramesPerPhone = Math.floor( synthesisObject.now.noOfFrames / ( synthesisObject.now.noOfPhones - 1 ) );

        synthesisObject.now.noOfLeftoverFrames = synthesisObject.now.noOfFrames - synthesisObject.now.noOfFramesPerPhone * synthesisObject.now.noOfPhones;
        console.log('duration changed')

    }

    synthesisObject.now = synthesisObject.data[ tiaSays ];
    synthesisObject.callback = speakCb;
    showSpeechBubble( synthesisObject.now.texts[ 0 ], tiaTimings.speechBubbleFadeInDuration )
    tiaSpeakIndividualSentences();

}

function tiaSpeakIndividualSentences() {

    synthesisObject.audio.src = synthesisObject.now.URLs[ synthesisObject.sentenceNo ];
    synthesisObject.now.phoneCount = 1;
    
    animateFirstPhoneSlowly( function() {
            
        setTimeout( function() {
            
            synthesisObject.audio.play();

        }, 100 );

        animatePhonesInOrder();

    });

}

function animateFirstPhoneSlowly( cb ) {

        expressionController( expressionObject.abs[ synthesisObject.now.phones[ synthesisObject.sentenceNo ][ 0 ] ], synthesisObject.durationOfFirstAndLastPhones, cb )

}

function animatePhonesInOrder() {

    if ( synthesisObject.now.phoneCount < synthesisObject.now.noOfPhones ) {

        pronunciationController( expressionObject.abs[ synthesisObject.now.phones[ synthesisObject.sentenceNo ][ synthesisObject.now.phoneCount ] ], animatePhonesInOrder )
        synthesisObject.now.phoneCount += 1;

    // check for last phone to also be run slowly
    } else if ( synthesisObject.now.phoneCount === synthesisObject.now.noOfPhones ) { 
        
        expressionController( expressionObject.abs.talkBase, synthesisObject.durationOfFirstAndLastPhones, function(){

        //if last sentence then just show mic, but if more sentences to come then show 'next' button
            if ( synthesisObject.sentenceNo === synthesisObject.now.texts.length - 1 ) {

                synthesisObject.callback();
                buttonsMicrophoneOnly();

            } else {

                if ( synthesisObject.continuous ) {

                    listenToNextSentence();

                } else {

                    buttonsListenNextSentence();;
               
                }    

            }

        })

    }

}

function listenToNextSentence() {

    $('#listenNextSentenceBtnCont').hide();
    synthesisObject.sentenceNo += 1;
    removeSpeechText( tiaTimings.speechTextFadeOutDuration, function() {
        
        showSpeechText( synthesisObject.now.texts[ synthesisObject.sentenceNo ], tiaTimings.speechTextFadeInDuration, tiaSpeakIndividualSentences )

    })

}

function pronunciationController( expressionTo, cb ) {

    expressionObject.bool = false;//if other expression delayed, just stop it before calculating absolute position
    expressionObject.now = getAbsoluteCoordsOfExpressionNow();
    expressionObject.movement = createRelativeExpression( expressionTo );
    expressionObject.callback = cb;
    initPronunciation();

}

//// general all-purpose method for all expressions
function initPronunciation() {

    if ( synthesisObject.now.phones[ synthesisObject.sentenceNo ][ synthesisObject.now.phoneCount ][ 0 ] === 'v' ) {

        // -1 cause the frames run over
        expressionObject.sinLength = synthesisObject.now.noOfFramesPerPhone - 2;
        expressionObject.sin = sineArrays[ expressionObject.sinLength ];
    
    } else {

        // same her, but these can be tweeked to make vowels/consonants shorter/longer
        expressionObject.sinLength = synthesisObject.now.noOfFramesPerPhone - 1;
        expressionObject.sin = sineArrays[ expressionObject.sinLength ];

    }
    console.log(synthesisObject.now.noOfFramesPerPhone)
    expressionObject.startCount = mainCount;
    expressionObject.bool = true;

}

function showSpeechBubble( sentence, duration, cb ) {

    $('#speakingWordsInside').text( sentence );
    $('#speechBubbleInnerContainer').fadeIn( duration, cb );

}

function removeSpeechBubble( duration ) {

    $( '#speechBubbleInnerContainer' ).fadeOut( 
            
        duration, 
        function() { $( '#speakingWordsInside' ).text( '' ) }
    
    );

}

function showSpeechText( sentence, duration, cb ) {

    $('#speakingWordsInside').text( sentence );
    $('#speakingWordsInside').fadeIn( duration, cb );

}

function removeSpeechText( duration, cb ) {

    $( '#speakingWordsInside' ).fadeOut( 
            
        duration, 
        function() { 
            $( '#speakingWordsInside' ).text( '' )
            cb();
        }
    
    );

}






