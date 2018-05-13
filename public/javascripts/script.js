
$(document).ready(function(){




  
  
////////////////////////////////////////////GET RESTAURANTS CLICK
$('#get-restaurants').click(function(event){


  const theTerm = $('#restaurant-name').val();
  const theLocation = $('#location').val();


  axios.get(`/search/restaurants/${theTerm}/${theLocation}`)
    .then((response) => {
      console.log('response.data: ', response.data);

      // make sure the container is empty
      $('.restaurant-list-container').empty();
      // find out how many items we got in the response
      const totalItemsInResponse = response.data.length;

      // open a placeholder for the html that we will add to the page
      let html = ``;

      // for every item we got in the response
      for(let i = 0; i < totalItemsInResponse; i++){
        

        // for all multiples of 3
        if(i % 3 === 0){
          // if it is not the first one
          if(i !== 0){
            // close the previous row
            html += `</div>`;
          }
          // otherwise, open the row
          html += `<div class="row">`;
          console.log('i: ', i);
        }
        
        // placeholder for the current data
        const currentData = response.data[i];

        // make shorter placeholders for the date we will need in the html
        const theImage = currentData.image_url;
        const theName = currentData.name;
        const theAlias = currentData.alias;
        const thePhone = currentData.phone;
        const theAddress = currentData.location.address1;
        const theCity = currentData.location.city;
        const theZipCode = currentData.location.zip_code;
        const theId = currentData.id;

        // populate the html
        html +=
        `<div class="col-sm-4 ogf-margin-5">
        
          <div class="restaurant-info">
            <img class="business-img" src="${theImage}">
            <h2 class="name">${theName}</h2>
            <div class="phone">Phone number: ${thePhone}</div>
            <div class="address">Address:
              <p class="tabbed">${theAddress}</p>
              <p class="tabbed">${theCity}</p>
              <p class="tabbed">${theZipCode}</p>
            </div>
          </div>
          <p> 
            Are they out of something? 
            <form action="/restaurant&&${theId}&&${theName}&&${theAlias}&&${thePhone}&&${theAddress}&&${theCity}&&${theZipCode}" method="GET" class="form-container">
              <input class="btn btn-info" type="submit" value="Click to find out!">
            </form>
          </p>

          </br></br>

        </div>`

        // if the last item is not a multiple of 3
        if(i === totalItemsInResponse - 1 && i % 3 !== 0){
          // the the last "row" needs to be closed
          html += `</div>`;
        }// this is because multiples of 3 are already closed above

        
        // /restaurant/${theId}/${theName}/${theAlias}/${thePhone}/${theAddress}/${theCity}/${theZipCode}
        
      }//end of iteration through every item in response
      
      $('.restaurant-list-container').append(html);
    })//end.then
    .catch(err=>console.log(err))//youcantusenextherebecausethisisnotroutercode


})

///////////////////////////makes the search automaticaly on going back
if ($(".restaurant-search-form").length > 0){
  if($('#restaurant-name').val() !== "" && $('#location').val() !== ""){
    $('#get-restaurants').click();
  }
}

//////////////////////////activate restaurant search form by pressing enter
$('.restaurant-search-form').keydown(function(event) {
  if ( event.which == 13 ) {
    $('#get-restaurants').click();
  }
})

//////////////////////////////////////////////////////GET RESTAURANTS END










})// END DOCUMENT READY 



$(".corroborate").on("click", function(){
  // console.log($(this).attr("tipid"))
  // console.log($(this).attr("ownerid"))

  const tipId = $(this).attr("tipid")
  // const ownerId = $(this).attr("ownerid")


  //deactivate clicks on the button
  // $(".corroborate").off();


  $(this).toggleClass("btn-warning btn-danger")

  const buttonInnerText = $(this).text();
  // swap text
  if(buttonInnerText === "Is it True?"){
    $(this).text("It is True!!!")

    // add one to counter
    let num = +$(`[fortip='${tipId}']`).text() + 1;
    $(`[fortip='${tipId}']`).text(num);

  }
  else{
    $(this).text("Is it True?")

    // take one away from counter
    let num = +$(`[fortip='${tipId}']`).text() - 1;
    $(`[fortip='${tipId}']`).text(num);

  }
  // ownerId => took this out of the string to test
  handleCorroboration(tipId);
})

// theOwnerId => took this out
function handleCorroboration(theTipId){

  // make call to database and see if we have a corroborate
  // to create one or edit one if necessary
  // whether call is succesful or not, reactivate button

  // ${theOwnerId} => took this out 
  axios.post(`/corroboration/${theTipId}`,{})
  .then(response=>{
    console.log('EDIT SUCCESS! response: ', response);
  })
  .catch(err=>console.log(err))

}
