// text is string and tiaSpeaker is true if it is tia speaking, false if student
function sendTTS( text ) {

    $.ajax({
        url: "/tts",
        type: "GET",
        data: {
            'sentence': text,
        },
        success: function(json) {

          //console.log('got tts successfully:', json.synthURL);

        },
        error: function() {
          //console.log("that's wrong");
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
    if(!conversationVariables.trying_again){
        fd.append("fn", conversationVariables.sentence_being_recorded_audio.Aud_Fname);
    }else{
        fd.append("fn", conversationVariables.previous_sent_Aud_Fname);
    }
    fd.append('sessionID',conversationVariables.conversation_dict.id);
    fd.append("ids",conversationVariables.correct_audio);
    fd.append("poss", new_ids);
    $.ajax({
        url: "/get_remaining_audio", 
        type: "POST",             
        data: fd,
        processData: false,
        contentType: false,
        success: function(json) {
            var i;
            for(i=0;i<conversationVariables.correct_audio.length;i++){
                document.getElementById("audio_"+conversationVariables.correct_audio[i]).src = prefixURL+json['paths'][i];
                $("#audio_"+conversationVariables.correct_audio[i]).attr('duration',json['lens'][i]);
            }
            getAudioLength();
        },
       error: function() {
       },

    } );

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

  //console.log('in sendSoundMicToServer:', device + " " + TF.toString());
    $.ajax({
        url: "/store_sound_mic",
        type: "GET",
        data: { 
            'device': device,
            'TF': JSON.stringify( TF ),
        },
        success: function(json) {
            
          //console.log('added device status');

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
            
          //console.log('added timings');

        },
        error: function() {
            alert("error adding timings");
        },

    });

}
