
$(document).ready(function(){
  console.log("yut");
  
  
////////////////////////////////////////////GET RESTAURANTS CLICK
$('#get-restaurants').click(function(){

  const theTerm = $('#restaurant-name').val();
  const theLocation = $('#location').val();


  axios.get(`/search/restaurants/${theTerm}/${theLocation}`)
    .then((response) => {
      console.log('response.data: ', response.data);


      $('.restaurant-list-container').empty();
      response.data.forEach(eachRestaurant => {
        const theName = eachRestaurant.name;
        const theAlias = eachRestaurant.alias;
        const thePhone = eachRestaurant.phone;
        const theAddress = eachRestaurant.location.address1;
        const theCity = eachRestaurant.location.city;
        const theZipCode = eachRestaurant.location.zip_code;
        const theId = eachRestaurant.id;


        $('.restaurant-list-container').append(`
        
          <div class="restaurant-info">
            <h2 class="name">Name: ${theName}</h2>
            <div class="alias">alias: ${theAlias}</div>
            <div class="phone">Phone number: ${thePhone}</div>
            <div class="address">Address:
              <p class="tabbed">${theAddress}</p>
              <p class="tabbed">${theCity}</p>
              <p class="tabbed">${theZipCode}</p>
            </div>
            <div class="the _id">${theId}</div>
          </div>
          <p> 
            Are they out of something? 
            <form action="/restaurant&&${theId}&&${theName}&&${theAlias}&&${thePhone}&&${theAddress}&&${theCity}&&${theZipCode}" method="GET" class="form-container">
              <input type="submit" value="Let everyone know!">
            </form>
          </p>

          </br></br>
        
        `)

        // /restaurant/${theId}/${theName}/${theAlias}/${thePhone}/${theAddress}/${theCity}/${theZipCode}
        
      });//endforeach
    
    })//endthen
    .catch(err=>console.log(err))//youcantusenextherebecausethisisnotroutercode


})
///////////////////////////////////////////GET RESTAURANTS END




























})



