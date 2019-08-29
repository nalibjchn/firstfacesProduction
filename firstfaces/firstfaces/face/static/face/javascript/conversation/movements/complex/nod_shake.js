function initNod( depth, secs ) {

    // EX: initNod(0.1, '0.5')

    if ( nodObject.bool ) {

        //console.log('can move while still moving man!!')

    } else {
    
        nodObject.bool = true;
        
        if ( nodObject.iter === 0 ) {
         
            assignSinArrayForSpeed( secs, nodObject, quickTurnaroundSineArrays ) 
            nodObject.secs = secs;
            nodObject.depth = depth;
            nodObject.amount = nodObject.decay[ 0 ] * depth;
        
        } else {

            nodObject.amount = nodObject.depth * nodObject.decay[ nodObject.iter];

        }

        nodObject.startCount = mainCount;

        initSacc( [[0,0,0],[ -nodObject.amount / 3, 0, 0]], secs, true );
        
    }

}


function nod( main ) {

    let main_start = main - nodObject.startCount;
    let sinAmount = nodObject.sin[ main_start ]
    
    if ( main_start < nodObject.sinLength ) {

        let rotXMult = nodObject.amount * sinAmount;
        tiaObject.faceBones.head.rotation.x += rotXMult;
        tiaObject.bodyBones.spineUpperInner.rotation.x += -rotXMult / 6;

    } else {

        nodObject.bool = false;
        
        if ( nodObject.iter < 3 ) {

            nodObject.iter += 1;
            initNod( nodObject.depth, nodObject.secs );

        } else {

            nodObject.iter = 0;
            movementController( movementObject.abs.blank, nodObject.secs, nodObject.secs );

        }

    }

}


function initShake( depth, secs ) {

    if ( shakeObject.bool ) {

        //console.log('can move while still moving man!!')

    } else {
    
        shakeObject.bool = true;
        
        if ( shakeObject.iter === 0 ) {
         
            assignSinArrayForSpeed( secs, shakeObject, sineArrays ) 
            shakeObject.secs = secs;
            shakeObject.depth = depth;
            shakeObject.amount = shakeObject.decay[ 0 ] * depth;
        
        } else {

            shakeObject.amount = shakeObject.depth * shakeObject.decay[ shakeObject.iter];

        }

        shakeObject.startCount = mainCount;

        initMove( eyeObject, [[0,0,0],[0, -shakeObject.amount / 2, 0]], secs );
        
    }

}

function shake( main ) {

    let main_start = main - shakeObject.startCount;
    let sinAmount = shakeObject.sin[ main_start ]
    
    if ( main_start < shakeObject.sinLength ) {

        let rotYMult = shakeObject.amount * sinAmount;
        tiaObject.faceBones.head.rotation.y += rotYMult;

    } else {

        shakeObject.bool = false;
        
        if ( shakeObject.iter < 3 ) {

            shakeObject.iter += 1;
            initShake( shakeObject.depth, shakeObject.secs );

        } else {

            shakeObject.iter = 0;
            movementController( movementObject.abs.blank, shakeObject.secs, shakeObject.secs );

        }

    }

}

