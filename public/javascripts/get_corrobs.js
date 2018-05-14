$(function () {
// BEGIN DOCUMENT READY

// THIS FILE IS ONLY LOADED ON THE RELEVANT PAGE AND WILL ONLY RUN IF THERE ARE CORROBORATION COUNTERS
// FOR EACH OF THEM
$(".corroboration-counter").each(function( index, elem ) {

  // retrieve the id of the user that is currently logged in
  const loggedInUserId = $("#logged-in-user-id").attr("theid")

  // get the id of the tip that we are currently working with
  const theTipId = $( elem ).attr("fortip")

  // make a call to get all corroborations associated with that tip
  axios.get(`/get-corroborations/${theTipId}`)
    .then(corroborations =>{

      // then for each of the corroborations
      corroborations.data.forEach(corroboration => {
        // check if the value is true in the DB 
        if (corroboration.corroborated === true){
          // and add one to the corroboration counter on the screen
          let num = +$( elem ).text() + 1;
          $( elem ).text(num);

          // then, if the user is the owner of that crroboration
          // IE the corrent logged in user has click the 'corroborate' button to indicate that they agree that it is true
          if(JSON.stringify(corroboration.owner_id) === JSON.stringify(loggedInUserId)){

            // change the color of the buttons and
            $(`[tipid='${theTipId}']`).toggleClass("btn-warning btn-danger")
            // change the text of the button to indicate that
            $(`[tipid='${theTipId}']`).text("It is True!!!")

          }
        }
      });
    })
    .catch(err=>console.log(err))
});// CORROBORATION COUNTER SETTER END



// CORROBORATE BUTTON ON CLICK BEGIN
$(".corroborate").on("click", function(){
  
  // create alias for the button that was clicked
  const corrobButton = $(this);

  // check if the previous call was finished
  if(corrobButton.hasClass("not-finished")){
    // if it has not, don't go any further
    return;
  }

  // mark the button to be able to check if the request has finished
  corrobButton.addClass("not-finished");

  // retrieve the id of the tip that is being corroborated from the button
  const tipId = corrobButton.attr("tipid")

  // make call to the database with that id
  axios.post(`/corroboration/${tipId}`,{})
  // if the call was succesful
  .then(response=>{

    // change the look of the button
    corrobButton.toggleClass("btn-warning btn-danger")

    // change the text of the button to refect the new status
    const buttonInnerText = corrobButton.text();
    if(buttonInnerText === "Is it True?"){
      // this is to indicate that the user has corroborated the tip
      corrobButton.text("It is True!!!")
  
      // add one to counter
      let num = +$(`[fortip='${tipId}']`).text() + 1;
      $(`[fortip='${tipId}']`).text(num);
  
    }
    else{
      //this is to take away a corroboration and returns the text to original status
      corrobButton.text("Is it True?")
  
      // take one away from counter
      let num = +$(`[fortip='${tipId}']`).text() - 1;
      $(`[fortip='${tipId}']`).text(num);
    }
  
    // with the database value updated an the interface updated we can listen for call again by removing the clas that stopped them
    corrobButton.removeClass("not-finished");

  })
  .catch(err=>console.log(err))

})// END CORROBORATE BUTTON ON CLICK


});// END DOCUMENT READY
