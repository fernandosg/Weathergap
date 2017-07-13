function homeActivity(activity){
  var city_for_weather="Tampico";
  var onAction = function(evt) {

  };
  var creating=false;
  var changeTitleWeatherToday=function(setting_for_detection){
    document.getElementById("title_weather_today").innerHTML="Actual weather in "+city_for_weather+", detecting from "+setting_for_detection;
  }

  activity.onCreate(function() {
    if(localStorage.getItem("city_for_weather")==undefined){
      localStorage.setItem("city_for_weather",city_for_weather);
    }
    city_for_weather=localStorage.getItem("city_for_weather");
    if(localStorage.getItem("detection")=="geoposition")
    getPosition();
    else{
      getInformationApi();
      changeTitleWeatherToday("city saved or default");
    }
    creating=true;
  });

  function getInformationApi(){
    var url="http://api.apixu.com/v1/current.json?"
    url+="key="+key+"&";
    url+="q="+city_for_weather;
    xmlHTTP=new XMLHttpRequest();
    xmlHTTP.onreadystatechange=processWeather;
    xmlHTTP.open("GET",url,true);
    xmlHTTP.send();
  }

  function processWeather(){
    var output="";
    if(xmlHTTP.readyState==4){
      var jsonResult=xmlHTTP.responseText;
      var result=JSON.parse(jsonResult);
      document.querySelector('.temperature-today').innerHTML=""+result.current.temp_c;
      document.querySelector(".condition-today").innerHTML=""+result.current.condition.text;
      document.querySelector('.icon-condition').src="http:"+result.current.condition.icon;
    }
  }

  activity.onClose(function(self) {
    self.close();
  });

  activity.onHidden(function() {
    action = null;
  });
  var state_before="city";
  /*
  If the user has change the detection setting, then the weather information is getting again from API
  */
  activity.onReady(function(){
    if(creating===false && localStorage.getItem("detection")!=state_before){
      if(localStorage.getItem("detection")=="geoposition"){
        getPosition();
        console.log("fue por geoposition ");
      }else {
        city_for_weather=localStorage.getItem("city_for_weather");
        console.log("fue por ciudad "+city_for_weather);
        getInformationApi();
        changeTitleWeatherToday("city saved or default")
      }
    }else
      creating=false;
    state_before=localStorage.getItem("detection");
  })

  var getPosition=function(){
    var options={enableHighAccuracy:true,timeout:50000};
    navigator.geolocation.getCurrentPosition(function(position){
      var lat,lng;
      lat=position.coords.latitude;
      lng=position.coords.longitude;
      getCityName(lat,lng);
    })
  }

  var getCityName=function(lat,lng){
    var url="http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&sensor=true";
    var xmlHTTP=new XMLHttpRequest();
    xmlHTTP.onreadystatechange=function(){
      if(xmlHTTP.readyState==4){
        var jsonResult=xmlHTTP.responseText
        var result=JSON.parse(jsonResult);
        city_for_weather=result.results[2].address_components[0].long_name;
        localStorage.setItem("city_for_weather",city_for_weather);
        changeTitleWeatherToday("geoposition");
        getInformationApi();
      }
    };
    xmlHTTP.open("GET",url,true);
    xmlHTTP.send();
  }

  activity.onHashChanged(function(pizza) {
    //document.querySelector('.pizza').textContent = pizza;
  });
}
