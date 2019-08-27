// text is string and tiaSpeaker is true if it is tia speaking, false if student
function sendTTS( text, tiaSpeaker ) {

    synthesisObject.ttsServerFault = false;
    //console.log('text:', text);

    // checks if speech has arrived from server
    synthesisObject.gotNewSpeech = false;

    synthesisObject.text = text;

    $.ajax({
        url: "/tts",
        type: "GET",
        data: {
            'gender': conversationVariables.gender,
            'sentence': text,
            'tiaSpeaker': tiaSpeaker,
            'pitch': synthesisObject.pitch,
            'speaking_rate': synthesisObject.speaking_rate,
            'sessionID': conversationVariables.session_id,
            //'caller': caller,
            'blob_no_text': conversationVariables.blob_no_text,
            'blob_no_text_sent_id': conversationVariables.blob_no_text_sent_id,
        },
        success: function(json) {

            if ( json.synthURL === 'fault' ) {

                synthesisObject.gotNewSpeech = true;
                synthesisObject.ttsServerFault = true;

            } else {

                var synthAudioURL = prefixURL + json.synthURL;
                synthesisObject.synthAudio = document.getElementById( 'synthClip' );
                synthesisObject.synthAudio.src = synthAudioURL;

                // now this is true, other functions waiting on it can continue
                synthesisObject.gotNewSpeech = true;
                
                //if ( tiaSpeaker ) {

                //} else {

                    //// listen is when the user click the listen button so want the audio to play asap
                    ////if ( caller === "listen" ) {

                        ////setTimeout( function() {

                            ////synthesisObject.synthAudio.play();

                        ////}, 500 );

                    ////} else {
                    
                        //console.log('talk speech synth made');

                    ////}

                //}

            }

        },
        error: function() {
            console.log("that's wrong");
        },

    });

}

function sendBlobToServer( blob_to_send ) {

    let fd = new FormData();
    fd.append('data', blob_to_send);
    fd.append('sessionID', conversationVariables.session_id);
    fd.append('interference', conversationVariables.interference);
    fd.append('blob_no_text', conversationVariables.blob_no_text);
    fd.append('blob_no_text_sent_id', conversationVariables.blob_no_text_sent_id);

    
    $.ajax({
        url: "/store_blob",
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        success: function(json) {
            conversationVariables.totalAudioLength = json.audio_length;
            conversationVariables.Aud_Fname = json.audio_file;
            conversationVariables.blob_no_text = true;
            conversationVariables.blob_no_text_sent_id = json.sent_id;
            console.log('got response from sending blob to server');
            conversationVariables.alternatives = json.alternatives;
            conversationVariables.currentAudID = json.audio_pk;
            conversationVariables.preSent = conversationVariables.alternatives[ 0 ][ 'transcript' ]
            returnFromListenToSpeechSynthesis();
        },
        error: function() {
            console.log("that's wrong");
        },

    });

}

function correctids(ids){
 var i;
 var out =[];
 for(i=0;i<ids.length;i++){
    out.push(correctID(ids[i]));
 }
 return out
}
function correctID(id){
    var count = 0;
    var i;
    for(i=0;i < id;i++){
        count += $('#upper_'+i).text().trim().split(" ").length;
    }
    return count;
}



function getRemainingAudio(){
    let fd = new FormData();  
   fd.append("ids",conversationVariables.correct_audio);
    var audio_ends = [];
    var i;
    var new_ids = correctids(conversationVariables.correct_audio);
    
    for(i=0;i<new_ids.length;i++){
        var val = $('#upper_'+conversationVariables.correct_audio[i]).text().trim().split(" ").length;
        val = val - 1;
        audio_ends.push(new_ids[i]+val);
    }
    fd.append('ends',audio_ends);
    fd.append("poss",new_ids);
    fd.append("fn", conversationVariables.Aud_Fname);
    fd.append('sessionID',conversationVariables.session_id);
    fd.append("ids",conversationVariables.correct_audio);
    fd.append("poss", new_ids);
    fd.append("fn", conversationVariables.Aud_Fname);
    fd.append('sessionID',conversationVariables.session_id);
    $.ajax({                     
        url: "/get_remaining_audio", 
        type: "POST",             
        data: fd,
        processData: false,
        contentType: false,
        success: function(json) {
            var i;
            var base = "http://127.0.0.1:8000/";
            for(i=0;i<conversationVariables.correct_audio.length;i++){
                document.getElementById("audio_"+conversationVariables.correct_audio[i]).src = base+json['paths'][i];
                $("#audio_"+conversationVariables.correct_audio[i]).attr('duration',json['lens'][i]);
            }
            getAudioLength();
        },
       error: function() {
       },

    } );

}



function sendSentToServer() {
    if(conversationVariables.playStage2){
        getRemainingAudio();
        
       //i getAudioLength();
    }
    // reset to false
    //conversationVariables.promptNIndexesReceived = false;
    // reset the number of recordings for the sentence to 0.
    conversationVariables.blobs = 0;

    // all below for developing
    let sent = conversationVariables.preSent;

    if ( sent.length >= 300 ) {

        alert( 'This sentence is too long. Please simplify and try again.')

    } else {

        // set this to false until judgement comes in where it will be changed to true
        conversationVariables.awaitingJudgement = true;

        if ( sent.length > 2 ) {
            
            // fade out text box
            $('#textInputContainer').fadeOut( 500 );

            talkToTia(); 
            recTimes = {};
            recTimes.clickTalkBtn = Date.now() / 1000;

            $.ajax({
                url: "/store_sent",
                type: "POST",
                data: { 
                    'sent': sent,
                    //'isItQ': isItQ,
                    'blob_no_text': conversationVariables.blob_no_text,
                    'blob_no_text_sent_id': conversationVariables.blob_no_text_sent_id,
                    'sessionID': conversationVariables.session_id
                },
                success: function(json) {
                    
                    console.log('sentence successfully sent to server');
                    //console.log('json.sent_id:', json.sent_id);
                    checkJudgement( json.sent_id );
                    conversationVariables.sentenceData = json.sentenceData;

                },
                error: function() {
                    alert("sentence failed to send to server");
                },

            });

        } else {

            alert('this is not a sentence');

        }

        //} else {

            //alert("you can only ask a 'Wh-' or 'How' question after 3 correct non-question sentences. The small red circle with the number in it will turn green when you can ask these questions.");

        //}

    }

}

function checkJudgement( sentId ) {

    $.ajax({
        url: "/check_judgement",
        type: "GET",
        data: { 
            'sessId': conversationVariables.session_id,
            'sentId': sentId,
        },
        success: function(json) {
            
            if ( json.sent_meta.receivedJudgement ) {

                console.log('got judgement');

                if (json.sent_meta.synthURL !== 'fault' ) {

                    synthesisObject.synthAudio = document.getElementById( 'synthClip' );
                    synthesisObject.synthAudio.src = prefixURL + json.sent_meta.synthURL;

                }

                judgementReceived( json.sent_meta )
            
            } else {

                console.log('checking for judgement again');
                checkJudgement( sentId );

            }

        },
        error: function() {
            alert("error awaiting judgement");
        },

    });

}

//conversationVariables.promptNINdexesCount = 0;
//function checkForPromptNIndexes( sentId ) {

    //console.log('in checkForPromptNIndexes');
    
    //$.ajax({
        //url: "/check_prompt_indexes",
        //type: "GET",
        //data: { 
            //'sentId': sentId,
        //},
        //success: function(json) {
            
            //if ( json.sent_meta.receivedPromptNIndexes ) {

                //if ( conversationVariables.promptNIndexesReceived === false ) {

                    //console.log('got prompt n indexes');
                    //console.log('indexes:', json.sent_meta.indexes);
                    //conversationVariables.promptNINdexesCount = 0;
                    //promptNIndexesReceived( json.sent_meta )

                    ////if ( conversationVariables.lastSentToBeSent ) {

                        ////conversationVariables.classOver = true;

                    ////}

                //}
            
            //} else {

                //console.log('checking for prompt n indexes again');
                //conversationVariables.promptNINdexesCount += 1;

                //if ( conversationVariables.promptNINdexesCount < 20 ) {

                    //setTimeout( function() {

                        //checkForPromptNIndexes( sentId );

                    //}, 2000 );

                //} else {

                    //conversationVariables.promptNINdexesCount = 0;
                    //setTimeout( function() {

                        //synthesisObject.text = "Sorry, my message has take too long to come across the internet. Please continue."

                        //tiaSpeak( synthesisObject.text, needSendTTS=true, function() {
                         
                            //setTimeout( function() {
                                
                                //returnToLaptop( ' ' );

                            //}, tiaTimings.delayBeforeReturnToLaptop );

                        //})


                    //}, 2000 )

                //}

            //}

        //},
        //error: function() {

            //conversationVariables.promptNINdexesCount = 0;
            //setTimeout( function(){
            
                //console.log("error awaiting prompt n indexes");
        
                //synthesisObject.text = "Sorry, my message hasn't come across the internet quickly enough. Please continue."

                //tiaSpeak( synthesisObject.text, needSendTTS=true, function() {
                 
                    //setTimeout( function() {
                        
                        //returnToLaptop( ' ' );

                    //}, tiaTimings.delayBeforeReturnToLaptop );

                //})

            //}, 10000 )

        //},

    //});

//}

//function sendTranscriptViewToAjax( choice ) {

    ////console.log('choice:', choice);
    //$.ajax({
        //url: "/add_transcription_choice_view",
        //type: "GET",
        //data: { 
            //'choice': choice,
            //'blob_no_text_sent_id': conversationVariables.blob_no_text_sent_id,
        //},
        //success: function(json) {
            
           //// console.log('added transcription choice view');

        //},
        //error: function() {
            //alert("error adding transcription choice view");
        //},

    //});

//}

//function sendListenSynth( repeat ) {

    //listenTranscript = false;
    //diffSent = "";
    //transcriptCur = "3";
    //// if not a repeat then something different - is it one of the transcripts?
    //if ( repeat === false ) {

        //if ( synthesisObject['transcript' + synthesisObject.transcriptCur ] === $('#textInput').val() ) {
        
            //listenTranscript = true;
            //transcriptCur = synthesisObject.transcriptCur;

        //} else {

            //// something typed by the learner
            //diffSent = $('#textInput').val();

        //}

    //}

    //$.ajax({
        //url: "/add_listen_synth_data",
        //type: "GET",
        //data: { 
            //'sessId': conversationVariables.session_id,
            //'diffSent': diffSent,
            //'transcriptCur': transcriptCur,
            //'listenTranscript': listenTranscript,
            //'repeat': repeat,
            //'blob_no_text': conversationVariables.blob_no_text,
            //'blob_no_text_sent_id': conversationVariables.blob_no_text_sent_id,
        //},
        //success: function(json) {
            
            //conversationVariables.blob_no_text = true;
            //conversationVariables.blob_no_text_sent_id = json.sent_id;

            //console.log('added pronunciation data');

        //},
        //error: function() {
            //alert("error adding pronunciation data");
        //},

    //});

//}

//function sendListenVoice() {

    //$.ajax({
        //url: "/add_voice_data",
        //type: "GET",
        //data: { 
            //'blob_no_text_sent_id': conversationVariables.blob_no_text_sent_id,
            //'transcript': conversationVariables.preSent,
        //},
        //success: function(json) {
            
            //console.log('added voice data');

        //},
        //error: function() {
            //alert("error adding pronunciation data");
        //},

    //});

//}

function sendSoundMicToServer( device, TF ) {

    console.log('in sendSoundMicToServer:', device + " " + TF.toString());
    $.ajax({
        url: "/store_sound_mic",
        type: "GET",
        data: { 
            'device': device,
            'TF': JSON.stringify( TF ),
        },
        success: function(json) {
            
            console.log('added device status');

        },
        error: function() {
            alert("error adding device status");
        },

    });

}

function sendTimesToServer() {

    let sentID = conversationVariables.last_sent.sent_id

    $.ajax({
        url: "/timings",
        type: "GET",
        data: { 
            'sent_id': sentID,
            'timing_dict': JSON.stringify( recTimes ),
        },
        success: function(json) {
            
            console.log('added timings');

        },
        error: function() {
            alert("error adding timings");
        },

    });

}
