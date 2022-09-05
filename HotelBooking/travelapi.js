/*get the geo id from the API*/
const TRAVELAPIKEY = "99402abc1emsh2c6d2a1e2219d67p1f96d7jsn01c8b3cca65a"; //latest
const TRAVELHOST = "travel-advisor.p.rapidapi.com";



function getGeoId() {
	
	let data1 = null;
	let geoId, cityLat, cityLong;
	let city = sessionStorage.getItem("city");
	city = city.replace(/ /g, "%");
	let apiURL = "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete?query="+city+"&lang=en_US&units=km";
	let xhr1 = new XMLHttpRequest();
	xhr1.withCredentials = true;
	xhr1.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonFormat = JSON.parse(this.responseText);
			geoId = jsonFormat.data.Typeahead_autocomplete.results[0].detailsV2.route.typedParams.geoId;
			cityLat = jsonFormat.data.Typeahead_autocomplete.results[0].detailsV2.geocode.latitude;
			cityLong = jsonFormat.data.Typeahead_autocomplete.results[0].detailsV2.geocode.longitude;
		}
	};
xhr1.open("GET", apiURL,false);
xhr1.setRequestHeader("X-RapidAPI-Key", TRAVELAPIKEY);
xhr1.setRequestHeader("X-RapidAPI-Host", TRAVELHOST);
xhr1.send(data1);
sessionStorage.setItem("cityLatitude",cityLat);
sessionStorage.setItem("cityLongitude",cityLong);
let url = "list.html?city="+city+"&geoId="+geoId+"&cityLat="+cityLat+"&cityLong="+cityLong;
window.location.href= url;
}

//function to invoke the function to get the hotels list
function callGetHotelList(geoIdG,cityLatG,cityLongG){
	getHotelList(geoIdG,cityLatG,cityLongG);
}

//function to get the list of hotels
function getHotelList(geoId,cityLat,cityLong){
	let north, south, east, west;
	var map = new google.maps.Map(document.getElementById("map"), {
		center: {
  			lat: parseFloat(cityLat),
  			lng: parseFloat(cityLong)
		},
		zoom: 8,
	});
	
	google.maps.event.addListener(map, "bounds_changed", function() {
		let bounds = map.getBounds();
		north = bounds.getNorthEast().lat();
		south = bounds.getSouthWest().lat();
		east  = bounds.getNorthEast().lng();
		west  = bounds.getSouthWest().lng();
	});
	
	const data = JSON.stringify({
		"geoId": parseInt(geoId),
		"checkIn": "2022-03-10",
		"checkOut": "2022-03-15",
		"sort": "PRICE_LOW_TO_HIGH",
		"sortOrder": "asc",
		"filters": [
			{
				"id": "deals",
				"value": [
					"1",
					"2",
					"3"
				]
			},
			{
				"id": "price",
				"value": [
					"31",
					"122"
				]
			},
			{
				"id": "type",
				"value": [
					"9189",
					"9201"
				]
			},
			{
				"id": "amenity",
				"value": [
					"9156",
					"9658",
					"21778",
					"9176"
				]
			},
			{
				"id": "distFrom",
				"value": [
					"2227712",
					"25.0"
				]
			},
			{
				"id": "rating",
				"value": [
					"40"
				]
			},
			{
				"id": "class",
				"value": [
					"9572"
				]
			}
		],
		"rooms": [
			{
				"adults": 2,
				"childrenAges": [
					2
				]
			},
			{
				"adults": 2,
				"childrenAges": [
					3
				]
			}
		],
		"boundingBox": {
			"northEastCorner": {
				"latitude": +parseFloat(north),
				"longitude": +parseFloat(east) 
			},
			"southWestCorner": {
				"latitude":  +parseFloat(south),
				"longitude": +parseFloat(west)
			}
		},
		"updateToken": ""
	});
	
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
	var contentID_hotelName = {};
	var hotelCoord = [];	
	var counter = 0;

	if (this.readyState === this.DONE) {
		let rating,contentIdNew,hotelName,picURL;
		let jsonFormat = JSON.parse(this.responseText);
		for (let i = 0; i < 20 //jsonFormat.data.AppPresentation_queryAppListV2[0].sections.length
		; i++){
		
			if (jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].__typename === "AppPresentation_SingleCard"){
				hotelName = jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].singleCardContent.cardTitle.string;
				
				if (jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].singleCardContent.bubbleRating != null){
					rating = jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].singleCardContent.bubbleRating.rating+" ";
				}
				else rating = "NA";
			
				if(jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].singleCardContent.cardPhotos[0] != null){
				picURL = jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].singleCardContent.cardPhotos[0].sizes.urlTemplate;
				picURL = picURL.replace("{width}",1000);
				picURL = picURL.replace("{height}",500);
				}
				else picURL = "Not Available";
				contentIdNew = jsonFormat.data.AppPresentation_queryAppListV2[0].sections[i].singleCardContent.cardLink.route.typedParams.contentId;
				let result = Number(hotelName.indexOf("."));
					result = result + 1;
	  			var hotelName1 = hotelName.substring(result);
				
				if (!contentID_hotelName.hasOwnProperty(contentIdNew)) contentID_hotelName[hotelName1] = [];
				contentID_hotelName[hotelName1].push(contentIdNew);
				
				//Get the address of the hotel
				let dataHotelDetail = JSON.stringify({
					"contentId": contentIdNew,
					"checkIn": "2022-03-03",
					"checkOut": "2022-03-05",
					"rooms": [
						{
							"adults": 2,
							"childrenAges": [
								2
							]
						},
						{
							"adults": 2,
							"childrenAges": [
								3
							]
						}
					]
				});
				
				const xhrGetHotel = new XMLHttpRequest();
				xhrGetHotel.withCredentials = true;
				var hotelAdd,hotelLat, hotelLong;
				xhrGetHotel.addEventListener("readystatechange", function () {
					if (this.readyState === this.DONE) {
						let jsonFormat = JSON.parse(this.responseText);
						//get the address
						for (let m = 0; m < jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections.length; m++){
							if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[m].__typename == "AppPresentation_PoiLocation"){
								
								
								hotelAdd = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[m].address.address;
								hotelLat = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[m].address.geoPoint.latitude;
								hotelLong = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[m].address.geoPoint.longitude;
								
								hotelCoord.push([hotelName1,hotelLat,hotelLong]);

								break;
							}

						}//end of the main for
						buildListPage(hotelName,rating,picURL,hotelAdd);

					}
				});
				xhrGetHotel.open("POST", "https://travel-advisor.p.rapidapi.com/hotels/v2/get-details?currency=USD&units=km&lang=en_US",false);
				xhrGetHotel.setRequestHeader("content-type", "application/json");
				xhrGetHotel.setRequestHeader("X-RapidAPI-Key", TRAVELAPIKEY);
				xhrGetHotel.setRequestHeader("X-RapidAPI-Host", TRAVELHOST);
				xhrGetHotel.setRequestHeader("Retry-After",300);
				xhrGetHotel.send(dataHotelDetail);
		}
		
		}
		sessionStorage.setItem("contentId",JSON.stringify(contentID_hotelName));
		sessionStorage.setItem("hotelCoordinates",JSON.stringify(hotelCoord));
	}
});

xhr.open("POST", "https://travel-advisor.p.rapidapi.com/hotels/v2/list?currency=USD&units=km&lang=en_US",false);
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("X-RapidAPI-Key", TRAVELAPIKEY);
xhr.setRequestHeader("X-RapidAPI-Host", TRAVELHOST);
xhr.send(data);
}

function buildListPage(hotelName,rating,picURL,hotelAddress){
	let mainDivId = document.getElementById("allHotels");
	//internal div
	let internalDiv = document.createElement("div");
	internalDiv.setAttribute("class","hotelDetails col-md-6 col-lg-6");
	mainDivId.appendChild(internalDiv);

	//creation of anchor tag for directing to detail.html
	let anchorTagElement = document.createElement("a");
	anchorTagElement.href="#";
	anchorTagElement.addEventListener("click",callBuildDetails);
	internalDiv.appendChild(anchorTagElement);
	
	//creation of image tag
	let imageElement = document.createElement("img");
	imageElement.setAttribute("class","hotelImage");
	imageElement.setAttribute("src",picURL);
	imageElement.setAttribute("alt",hotelName);
	anchorTagElement.appendChild(imageElement);
	
	//creation of text div element
	let textElement = document.createElement("div");
	textElement.setAttribute("class","text");
	anchorTagElement.appendChild(textElement);
	
	//hotelName display
	let hotelNameElement = document.createElement("p");
	hotelNameElement.setAttribute("class","hotelImg");
	hotelNameElement.setAttribute("id","hotelNameId");
	hotelNameElement.innerHTML = hotelName;
	textElement.appendChild(hotelNameElement);
	
	//rating display
	let ratingElement = document.createElement("p");
	ratingElement.id="ratingId";
	ratingElement.innerHTML = rating;
	textElement.appendChild(ratingElement);
	
	//star display
	let starElement = document.createElement("span");
	starElement.setAttribute("class","fa fa-star checked");
	ratingElement.appendChild(starElement);
	
	//address to be added
	let breakElement = document.createElement("br");
	textElement.appendChild(breakElement);
	let hotelAddrElement = document.createElement("p");
	hotelAddrElement.setAttribute("class","text");
	hotelAddrElement.innerHTML = hotelAddress;
	textElement.appendChild(hotelAddrElement);
	
}

function callBuildDetails(ev){
	let hotelName = ev.target.parentElement.querySelector(".hotelImg").textContent;
	let result = Number(hotelName.indexOf("."));
		result = result + 1;
	let hotelName1 = hotelName.substring(result);
	let url = "detail.html?hotelName="+hotelName1;
	window.location.href= url;
}

/*Build the details page*/
function buildDetailsPage(hotelName){
	var contentId_hotelName = JSON.parse(sessionStorage.getItem("contentId"));
	var contentIdNew = String(contentId_hotelName[hotelName]);

	var album = [];
	var aboutHotel , rating;
	var amenities = [];


	////------------
	const data = JSON.stringify({
		"contentId": contentIdNew,
		"checkIn": "2022-03-03",
		"checkOut": "2022-03-05",
		"rooms": [
			{
				"adults": 2,
				"childrenAges": [
					2
				]
			},
			{
				"adults": 2,
				"childrenAges": [
					3
				]
			}
		]
	});
	
	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	
	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			// 
			sessionStorage.setItem("hotelDetails",this.responseText);
			let jsonFormat = JSON.parse(this.responseText);
			for (let i = 0; i < jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections.length; i++){
				//get the picture URLs for the carousel
				if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].__typename === "AppPresentation_PoiHeroStandard"){
					for (let j = 0; j < jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].albumPhotos.length;j++){
						album.push(jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].albumPhotos[j].data.photoSizeDynamic.urlTemplate);
						album[j] = album[j].replace("{width}",500);
						album[j] = album[j].replace("{height}",400);
					}
				}
				//get the amenities list and the hotel description
				if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].__typename === "AppPresentation_PoiAbout"){
					aboutHotel = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].about;
					for (let k =0; k < jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].nullableContent.length;k++){
						if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].nullableContent[k].__typename ==="AppPresentation_SmallTextListSubsection"){
							for (let l = 0; l <jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].nullableContent[k].list.length;l++ ){
								amenities.push(jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].nullableContent[k].list[l].string);
							}
		
						}
					}
		
				}

				//get the rating id
				if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].__typename === "AppPresentation_PoiOverview"){
					rating = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].rating;
				}
		
			}//end of the main for
			//
		}
	});
	
	xhr.open("POST", "https://travel-advisor.p.rapidapi.com/hotels/v2/get-details?currency=USD&units=km&lang=en_US",false);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.setRequestHeader("X-RapidAPI-Key",TRAVELAPIKEY);
	xhr.setRequestHeader("X-RapidAPI-Host", TRAVELHOST);
	
	xhr.send(data);

	////------------
	
	//Place carousel indicators
	let olId = document.getElementById("carouselIndicator");
	for (let i = 0; i < album.length;i++){
		
		$('<div class="item"><img src="'+album[i]+'"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
		$('<li data-target="#myCarousel" data-slide-to="'+i+'"></li>').appendTo('.carousel-indicators')
	
	  }
	  $('.item').first().addClass('active');
	  $('.carousel-indicators > li').first().addClass('active');
	//   $('#myCarousel').carousel();

	  //replace the hotel Name
	  	h3Id = document.getElementById("hotelName");
	  	h3Id.innerHTML= hotelName;

		//rating display
		let pId = document.getElementById("rating");
		
		let half = false;
		if ((Number(rating)%1) === 0)
	  		half = false;
			else
			half = true;
		rating = Number(parseInt(rating));
		for (let i = 0; i < rating; i++){
			let spanId = document.createElement("span");
			spanId.setAttribute("class","fa fa-star checked");
			pId.appendChild(spanId);
		}
		if (half){
			let spanIdHalf = document.createElement("span");
			spanIdHalf.setAttribute("class","fa fa-star-half-full checked");
			pId.appendChild(spanIdHalf);
		}

	//Amenities display
		let aminitiesId = document.getElementById("amenities");
		for (let i = 0 ; i < amenities.length; i++){
			let liId = document.createElement("li");
			liId.innerHTML = amenities[i];
			aminitiesId.appendChild(liId);
		}
	//about hotel
		let aboutId = document.getElementById("about");
		aboutId.innerHTML = aboutHotel;

}


function buildPaymentsPage(){
	let hotelName, hotelAdd, rating,ranking;
	let jsonFormat = JSON.parse(sessionStorage.getItem("hotelDetails"));
	let pic = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[0].albumPhotos[0].data.photoSizeDynamic.urlTemplate;
	pic = pic.replace("{width}",500);
	pic = pic.replace("{height}",400);
	for (let i = 0; i < jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections.length; i++){
		if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].__typename == "AppPresentation_PoiLocation"){
			hotelAdd = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].address.address;
		}
		if (jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].__typename == "AppPresentation_PoiOverview"){
			hotelName = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].name;
			
			rating = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].rating;
			
			ranking = jsonFormat.data.AppPresentation_queryAppDetailV2[0].sections[i].rankingDetails.string;
			
		}

	}	

	let mainDivId = document.getElementsByClassName("hotelDetails");
	let imageId = document.createElement("img");
	imageId.src = pic;
	imageId.alt = hotelName;
	imageId.className = "img-responsive";
	imageId.id = "hotel";
	mainDivId[0].appendChild(imageId);
	//hotel Name
	let hotelNameId = document.getElementById("hotelName");
	hotelNameId.innerHTML = hotelName;
	let rankingId = document.getElementById("ranking");
	rankingId.innerHTML = ranking;
	let addressId = document.getElementById("address");
	addressId.innerHTML = hotelAdd;
	
	
	let url = window.location.search;
	let queryStart = url.indexOf("?") + 1;
	let queryEnd = url.length;
	let query = url.slice(queryStart,queryEnd);
	let pairs = query.replace(/\+/g, " ").split("&")
	var parms = {}, i, n, v, nv;

	for (let i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);
		
        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }

	//populating the booking and tariff page
	document.getElementById("name").innerHTML = parms["nameVal"];
	document.getElementById("noOfAdults").innerHTML = parms["adultNo"];
	document.getElementById("checkInDate").innerHTML = parms["fromDateVal"];
	document.getElementById("checkOutDate").innerHTML = parms["toDateVal"];

	let fromIdValue = Date.parse(parms["fromDateVal"]);
    let toIdValue = Date.parse(parms["toDateVal"]);
    let noOfDays = (toIdValue - fromIdValue)/(1000*60*60*24);
	let adultTxtMsg;
	if (parseInt(parms["adultNo"]) > 1)
		adultTxtMsg = " Adults";
	else
		adultTxtMsg = " Adult";
	let noOfDaysMsg;
	if (noOfDays > 1)
		noOfDaysMsg = " Nights";
	else
		noOfDaysMsg = " Night";		
	document.getElementById("tariff").innerHTML = "Rs. 1000 x "+parms["adultNo"]+adultTxtMsg+" x "+noOfDays+noOfDaysMsg;
	document.getElementById("totalAmount").innerHTML = parms["total"];

}


function buildGoogleMaps(){
	
	var map;
		let cityLat = sessionStorage.getItem("cityLatitude");
		let cityLong = sessionStorage.getItem("cityLongitude");
        var hotelCo = [[],[]];
		sessionStorage.getItem("hotelCoordinates");

		var jsonData = JSON.parse(sessionStorage.getItem("hotelCoordinates"));
		
        map = new google.maps.Map(document.getElementById("mapTwo") , {
        center: { lat: parseFloat(cityLat), lng: parseFloat(cityLong)},
        zoom: 12,
		mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeId: 'satelllite',
        disableDefaultUI: true,
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
  });
	
	var infowindow = new google.maps.InfoWindow();
  	for(let i = 0; i < jsonData.length;i++){
    	
    	infowindow = new google.maps.InfoWindow({
    });

	
        var marker = new google.maps.Marker({
            position: { lat: parseFloat(jsonData[i][1]), lng: parseFloat(jsonData[i][2])},
            map: map
        });
	
        //Attach click event to the marker.
		(function (marker) {
			marker.addListener("mouseover", function (e) {
				//Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
				
				let ahref = '<a href="detail.html?hotelName='+jsonData[i][0]+'">Book Now</a>';
				var contentString = jsonData[i][0] +ahref;
				infowindow.setContent( "<div style = 'width:200px;min-height:40px'>" + contentString+ "</div>");
				infowindow.open(map, marker);
			});

		})(marker);

		function callDetails(){
			let url = "detail.html?hotelName="+jsonData[i][0];
			window.location.href = url;
		}
	}
}

function getCitiesList(){

	let dataSearch = null;
    let searchList = document.getElementById("search");
	let hugeList = document.getElementById("huge_list");
	
    // minimum number of characters before we start to generate suggestions
    let min_characters = 3;
	
    if (searchList.value.length < min_characters ) { 
        return;
    } else {  
		let xhrSearch = new XMLHttpRequest();
		xhrSearch.withCredentials = true;
        xhrSearch.addEventListener("readystatechange", function () {
			// alert(this.readyState+"-"+this.DONE);
            if (this.readyState === this.DONE) {
                // We're expecting a json response so we convert it to an object
                let response = JSON.parse(this.responseText);
                // clear any previously loaded options in the datalist
                hugeList.innerHTML = "";
				for (let i = 0; i < response.data.Typeahead_autocomplete.results.length; i++){
					if ((response.data.Typeahead_autocomplete.results[i].__typename == "Typeahead_LocationItem")&&
					(response.data.Typeahead_autocomplete.results[i].detailsV2.placeType == "CITY")){
					let eachName = response.data.Typeahead_autocomplete.results[i].detailsV2.names.name;
                    // Create a new <option> element.
                    let option = document.createElement("option");
                    option.value = eachName;
                    hugeList.appendChild(option);
					}
                };
            }
        });
		let apiURL =  "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete?query="+searchList.value+"&lang=en_US&units=km";
        xhrSearch.open("GET", apiURL,false);
		xhrSearch.setRequestHeader("X-RapidAPI-Key", TRAVELAPIKEY);
		xhrSearch.setRequestHeader("X-RapidAPI-Host", TRAVELHOST);
		 xhrSearch.send(dataSearch);
		}
    }