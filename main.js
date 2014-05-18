var arDrone = require('ar-drone');
var leap = require('leapjs');

var client  = arDrone.createClient();
var started = false;
var isFlipping = false;

leap.loop(function(frame){
  if (!started && frame.hands.length == 2) {
    console.log("take off");
    client.takeoff();
    started = true;
  }

  if (started && frame.hands.length == 0) {
    console.log("stop and land");
    client.stop();
    client.land();
  }

  if (started && frame.hands.length == 2) {
    var leftHand = frame.hands[0].type === "left" ? frame.hands[0] : frame.hands[1];
    var rightHand = frame.hands[0].type === "left" ? frame.hands[1] : frame.hands[0];

    if (leftHand.palmPosition[1] > rightHand.palmPosition[1] + 100) {
      console.log("up");
      client.up(0.2);
    }
    if (rightHand.palmPosition[1] > leftHand.palmPosition[1] + 100) {
      console.log("down");
      client.down(0.2);
    }
    if (leftHand.palmPosition[2] > rightHand.palmPosition[2] + 100) {
      console.log("back");
      client.back(0.2);
    }
    if (rightHand.palmPosition[2] > leftHand.palmPosition[2] + 100) {
      console.log("front");
      client.front(0.2);
    }
    if (leftHand.palmNormal[0] > 0.5) {
      console.log("turn to left");
      client.left(0.2);
    }
    if (leftHand.palmNormal[0] < -0.5) {
      console.log("turn to right");
      client.right(0.2);
    }

    if (leftHand.grabStrength > 0.9 && leftHand.palmNormal[0] > 0.75) {
      if (!isFlipping) {
        console.log("flip left");
        isFlipping = true;
        client.animate('flipLeft', 500);

        setTimeout(function(){
          isFlipping = false;
        }, 2000);
      }
    }
    if (rightHand.grabStrength > 0.9 && rightHand.palmNormal[0] < -0.75) {
      if (!isFlipping) {
        console.log("flip right");
        isFlipping = true;
        client.animate('flipRight', 500);

        setTimeout(function(){
          isFlipping = false;
        }, 2000);
      }
    }
  }

});

//
// var pngStream = client.getPngStream();
// pngStream.on('data', console.log);
