var button = document.getElementById('send');

button.addEventListener("click", function(){
  button.disabled = true;
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
        var responseMusic = JSON.parse(response.result);
        var output = "";
        for(var i = 0; i < responseMusic.length; i++){
          output += (noteToTab(responseMusic[i]) + " ");
        }
        console.log(output);
        jtab.render($('#mytab'),output);
        oOutput.innerHTML = "Uploaded!" + JSON.stringify(response);
        button.disabled = false;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(textStatus);
        oOutput.innerHTML = "Error " + errorThrown + " occurred when trying to upload your file.<br \/>";
      }
  });
});

function noteToTab(num){
  var output = "";
  if (num >= 90) return output
  var temp = [40, 45, 50, 55, 60, 65];
  for(var i = 5; i < temp.length; i--){
    if(num >= temp[i]) {
      output += ("$" + Math.abs(i-6) + " " + (num - temp[i]));
      break;
    }
  }
  return output;
}
