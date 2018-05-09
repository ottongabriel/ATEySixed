$(function () // on document.ready()
{
  console.log("hey");



    if ($('div.on-single-restaurant-page').length > 0)
    {
        console.log("yuhoo");
    }
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