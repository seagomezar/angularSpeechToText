'use strict';
(function () {

  function HomeController($scope) {
    
    $scope.recognition = new webkitSpeechRecognition();//Creamos un objeto
    $scope.start_img = 'images/mic-slash.gif';
    $scope.recognizing = false;
    
    $scope.showInfo = function (s) {
      console.log(s);
    };

    $scope.recognition.onstart = function () { //Cuanto empieza el reconocimiento
      $scope.recognizing = true; //Bandera para especificar que se esta reconociendo.
      $scope.showInfo('info_speak_now');//Un mensajito para decir que hable.
      $scope.start_img = 'images/mic-animate.gif';//Imagen del microfono parpadeando
    };

    $scope.recognition.onerror = function (event) { //Cuando falla el reconocimiento por all
      if (event.error == 'no-speech') {//No speech was detected.
        $scope.start_img = 'images/mic.gif';
        $scope.showInfo('info_no_speech');
        $scope.ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        $scope.start_img = 'images/mic.gif';
        $scope.showInfo('info_no_microphone');
        $scope.ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - $scope.start_timestamp < 100) {
          $scope.showInfo('info_blocked');
        }
        else {
          $scope.showInfo('info_denied');
        }
        $scope.ignore_onend = true;
      }
    };

    $scope.recognition.onend = function () {//Cuando acabo el reconocimiento.
      $scope.recognizing = false;
      if ($scope.ignore_onend) {
        return;
      }
      $scope.start_img = 'images/mic.gif';
      if (!$scope.final_transcript) {
        $scope.showInfo('info_start');
        return;
      }
      $scope.showInfo('');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
    };

    $scope.recognition.onresult = function (event) { //Cada vez que el reconocimiento obtenga resultados.
      var interim_transcript = '';
      if (typeof (event.results) == 'undefined') {
        $scope.recognition.onend = null;
        $scope.recognition.stop();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          $scope.final_transcript += event.results[i][0].transcript;
        } else {
          $scope.interim_transcript += event.results[i][0].transcript;
        }
      }
      $scope.final_transcript = $scope.final_transcript;
      $scope.final_span= $scope.final_transcript;
      $scope.interim_span = interim_transcript;
    };    

    $scope.startButton = function () {
      if ($scope.recognizing) {
        $scope.recognition.stop();
         $scope.start_img = 'images/mic-slash.gif';
        return;
      }
      $scope.final_transcript = '';//Aqui guardamos lo que se vaya obteniendo.
      $scope.ignore_onend = false;//No ignoramos nada al final      
      $scope.recognition.continuous = true; //Va escribiendo a medida que va teiniendo resultados
      $scope.recognition.interimResults = true;
      $scope.recognition.lang = 'en-US';//Puede ser 'es-CO'
      $scope.start_img = 'images/mic.gif';
      $scope.start_timestamp = new Date().getTime();
      $scope.showInfo('info_allow');
      $scope.recognition.start();
    };    

    $scope.showInfo('info_start');
  }
  angular.module('speechRecognition').controller('HomeController', HomeController);
})();
