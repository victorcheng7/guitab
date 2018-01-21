var button = document.getElementById('send');

button.addEventListener("click", function(){
  var file = document.getElementById('file');
  var form = document.forms.namedItem("audio");
  var oOutput = document.getElementsByClassName("output")[0],
      oData = new FormData(form);


  oData.append('audio', file.files[0], file.files[0].name);
  $.ajax({
      url: '/postmp3',
      //data : realFile,
      data: oData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
      dataType: "json",
      success: function(response){
        console.log(response);
        //TODO get the response
        oOutput.innerHTML = "Uploaded!" + JSON.stringify(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(textStatus);
        oOutput.innerHTML = "Error " + errorThrown + " occurred when trying to upload your file.<br \/>";
      }
  });
});

//TODO use e.preventDefault()
