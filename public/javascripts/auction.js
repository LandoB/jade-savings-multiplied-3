'use strict';

jQuery(document).ready(function($) { // Begins jQuery


		  $.ajax({ // Go get the data
						  url : "https://fiery-torch-1175.firebaseio.com/.json",
						  dataType : "jsonp",
						  success : function(data) {
								  console.log(data);
									for (var i = 0; i <= data.length - 1; i++) {

											$("#imagesDiv").append("<div class='col-md-3'>" + "<img src=" + data[i].image + " width='110' height='90'><br><br>" + data[i].title + "<br>" + data[i].price + "<br>" + data[i].seller + "<br>" + data[i].endDate + "</div>");

									}; // end of for loop

						  } // end of success
		  }); // end of ajax



}); // Ends jQuery









