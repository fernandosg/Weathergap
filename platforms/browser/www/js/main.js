phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: './tpl'
    },
    i18n: null // for this example, we do not use internationalization
});


var app = phonon.navigator();

/**
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
*/
app.on({page: 'home', preventClose: false, content: null},function(activity){
  var onAction = function(evt) {

  };
  var creating=false;
  activity.onCreate(function() {
    getInformationApi();
    creating=true;
  });

  function getInformationApi(){
    var url="http://api.apixu.com/v1/current.json?"
    url+="key="+key+"&";
    url+="q=Panuco";
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
      getInformationApi();
    }else
      creating=false;
    state_before=localStorage.getItem("detection");
  })

  activity.onHashChanged(function(pizza) {
      //document.querySelector('.pizza').textContent = pizza;
  });
});

/**
 * However, on the second page, we want to define the activity scope.
 * [1] On the create callback, we add tap events on buttons. The OnCreate callback is called once.
 * [2] If the user does not tap on buttons, we cancel the page transition. preventClose => true
 * [3] The OnReady callback is called every time the user comes on this page,
 * here we did not implement it, but if you do, you can use readyDelay to add a small delay
 * between the OnCreate and the OnReady callbacks
*/
app.on({page: 'configuration', preventClose: true, content: 'configuration.html', readyDelay: 1}, function(activity) {

    var action = null;

    var onAction = function(evt) {

    };

    activity.onCreate(function() {
      document.getElementById("btnSaveSettings").addEventListener("click",saveSetting);
      var options_for_detection=  document.getElementsByName("value_detecting");
      if(localStorage.getItem("detection")=="city")
        options_for_detection[0].checked=true;
      else
        options_for_detection[1].checked=true;
    });

    var saveSetting=function(e){
      var value_detecting;
      var values_detecting = document.getElementsByName('value_detecting');
      for(var i = 0; i < values_detecting.length; i++)
          if(values_detecting[i].checked){
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
});

// Let's go!
app.start();
