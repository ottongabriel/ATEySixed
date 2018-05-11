
$(document).ready(function(){
  console.log("yut");
  
  
////////////////////////////////////////////GET RESTAURANTS CLICK
$('#get-restaurants').click(function(event){

  const theTerm = $('#restaurant-name').val();
  const theLocation = $('#location').val();


  axios.get(`/search/restaurants/${theTerm}/${theLocation}`)
    .then((response) => {
      console.log('response.data: ', response.data);


      $('.restaurant-list-container').empty();
      response.data.forEach(eachRestaurant => {
        const thImage = eachRestaurant.image_url;
        const theName = eachRestaurant.name;
        const theAlias = eachRestaurant.alias;
        const thePhone = eachRestaurant.phone;
        const theAddress = eachRestaurant.location.address1;
        const theCity = eachRestaurant.location.city;
        const theZipCode = eachRestaurant.location.zip_code;
        const theId = eachRestaurant.id;


        $('.restaurant-list-container').append(`

        <div class="col-sm-4 ogf-margin-5">
        
          <div class="restaurant-info">
            <img class="business-img" src="${thImage}">
            <h2 class="name">Name: ${theName}</h2>
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
              <input type="submit" value="Click to find out!">
            </form>
          </p>

          </br></br>

        </div>
        
        `)

        // /restaurant/${theId}/${theName}/${theAlias}/${thePhone}/${theAddress}/${theCity}/${theZipCode}
        
      });//endforeach
    
    })//endthen
    .catch(err=>console.log(err))//youcantusenextherebecausethisisnotroutercode


})
///////////////////////////////////////////GET RESTAURANTS END





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
