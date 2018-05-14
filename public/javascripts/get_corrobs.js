$(function () {



$(".corroboration-counter").each(function( index, elem ) {

    const loggedInUserId = $("#logged-in-user-id").attr("theid")


    const theTipId = $( elem ).attr("fortip")

    axios.get(`/get-corroborations/${theTipId}`)
      .then(corroborations =>{

        corroborations.data.forEach(corroboration => {
          if (corroboration.corroborated === true){
            let num = +$( elem ).text() + 1;
            $( elem ).text(num);

            if(JSON.stringify(corroboration.owner_id) === JSON.stringify(loggedInUserId)){

              $(`[tipid='${theTipId}']`).toggleClass("btn-warning btn-danger")
              $(`[tipid='${theTipId}']`).text("It is True!!!")



              // CODE THAT INDICATES YOU HAVE ALREADY CORROBORATED
              // $(this).toggleClass("btn-warning btn-danger")

              // const buttonInnerText = $(this).text();
              // // swap text
              // if(buttonInnerText === "Is it True?"){
              //   $(this).text("It is True!!!")
              // }
              // else{
              //   $(this).text("Is it True?")
              // }






            }





          }
        });

      })
      .catch(err=>console.log(err))





});






});






















///// THIS WAS A BAD IDEA OF TRYING TO DO THIS WITH AJAX
// function getAllTips(params) {

//   axios.get('/get-all-tips')
//   .then((responseFromApi) => {

//     $('.tip-container').empty();
//     responseFromApi.data.forEach(eachCharacter => {

//       $('.characters-container').append(`
      
//         <div class="character-info">
//           <div class="name">Name: ${eachCharacter.name}</div>
//           <div class="occupation">Occ: ${eachCharacter.occupation}</div>
//           <div class="cartoon">Cartoon: ${eachCharacter.cartoon}</div>
//           <div class="weapon">Weapon: ${eachCharacter.weapon}</div>
//           <div class="the _id">${eachCharacter._id}</div>
//         </div>
      
//       `)
      
//     });//endforeach
  
//   })//endthen
//   .catch(err=>console.log(err))//youcantusenextherebecausethisisnotroutercode


// }