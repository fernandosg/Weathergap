function configurationActivity(activity) {

  var action = null;

  var onAction = function(evt) {

  };

  /*
  Function for handle the change in radio buttons for settings configuration
  */
  var onChangeOption=function(e){
    console.log("Cambiiiieeee =)");
    console.dir(e);
    if(e.target.value=="city")
      document.getElementById("container_city_name").style="display:block";
    else
      document.getElementById("container_city_name").style="display:none";
  }

  activity.onCreate(function() {
    document.getElementById("btnSaveSettings").addEventListener("click",saveSetting);
    var options_for_detection=  document.getElementsByName("value_detecting");
    if(localStorage.getItem("detection")=="city"){
      options_for_detection[0].checked=true;
      document.getElementById("container_city_name").style="display:block";
    }else
      options_for_detection[1].checked=true;
  });

  activity.onReady(function(){
    var options_for_detection=  document.getElementsByName("value_detecting");
    for(var i=0,length=options_for_detection.length;i<length;i++)
      options_for_detection[i].addEventListener("change",onChangeOption);
  })

  var saveSetting=function(e){
    var value_detecting;
    var values_detecting = document.getElementsByName('value_detecting');
    for(var i = 0; i < values_detecting.length; i++)
    if(values_detecting[i].checked){
      if(value_detecting=="city")
        localStorage.setItem("city_for_weather",document.getElementById("city_name").value);
      value_detecting = values_detecting[i].value;
      break;
    }
    var alert = phonon.alert("Configuration saved ", "Changes in configuration", true, "Accept");
    alert.on('confirm', function() {
    } );
    localStorage.setItem("detection",value_detecting);
  }

  activity.onClose(function(self) {
    self.close();
  });

  activity.onHidden(function() {
    action = null;
  });


  activity.onHashChanged(function(pizza) {
    //document.querySelector('.pizza').textContent = pizza;
  });
}
