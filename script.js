
//The model array stores the permanent data for each location. 
var Model = [
	{name: "FC Porto", description: "Futebol Club do Porto is a well known soccer team in Portugal.", icon: 'porto-icon.png', lat: 41.1616646, lng: -8.58457},
	{name:"Ponte Luis 1", description: "A famous old bridge at the heart of Porto", icon: 'ponte-icon.jpg', lat: 41.139870, lng: -8.609427},
	{name: "Rio Douro", description: "The famous river where Porto wine originates from", icon: 'rio-icon.jpg', lat: 41.144492, lng:-8.658321},
	{name: "Coliseu do Porto", description: "A cultural site", icon: 'coliseu-icon.jpg', lat:41.1469843, lng:-8.6057978},
	{name: "Torre dos Clerigos", description: "A famous Portuguese monument. Just one of many..", icon: 'torre-icon.jpg', lat:41.145655, lng:-8.614649}
];

//The main map function adds the map to the map div. It also creates the markers for all 5 locations. 
var map;
function initMap(){
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:41.156552, lng:-8.628724},
		zoom: 13
	});
	for (var x in Model){

	Model[x].markers = new google.maps.Marker({
		position: {lat:Model[x].lat, lng:Model[x].lng},
		map: map,
		title: Model[x].name,
		animation: google.maps.Animation.DROP,
		icon: Model[x].icon
	})

	Model[x].markers.addListener('click',toggleBounce);
	
	Model[x].markers.infoWindow = new google.maps.InfoWindow({
		content : Model[x].infodata
	})

	}


};
// This function handles the animation for the markers. Specifically for the event listener attached to each marker
function toggleBounce(marker){
	if (this.getAnimation()!==null){
		this.setAnimation(null);
		viewModel.query('');
		this.infoWindow.close(map,this);
	}else {
		this.setAnimation(google.maps.Animation.BOUNCE);
		viewModel.query(this.title);
		this.infoWindow.open(map, this);
	}
}
//Add an infodata object to the Models
for (var i in Model){
	Model[i].infodata = '<div class="mainContainer"><p>'+Model[i].description+'</p>'+'<div id="photos">';				
}
//The first variable stores all the location names from the Model array. The second variable called list will store the temporary locations during the filter function 
var listNames = [];
for(var i=0;i<Model.length;i++){
	listNames.push(Model[i]);
}


//The knockout data bindings.
var viewModel = {
	//The below array stores the listNames for the inital filter list on page load.
	filterList: ko.observableArray(listNames),
	// query observable is the data-bind value within the text area 
	query: ko.observable(""),
	// The search function is attached to the query observable and runs on keyboard keyup
	//It removes all the names from the filterList array then uses the indexOf function to 
	//populate new values 
	search: function(value){
		viewModel.filterList.removeAll();
		for (var x in Model){
			Model[x].markers.setMap(null);
		}
		for (var x in Model){
			if(Model[x].name.toLowerCase().indexOf(value.toLowerCase())>=0){
				viewModel.filterList.push(Model[x]);
				Model[x].markers.setMap(map);
			}
		}
	},
	//This function is called by the click data-bind for each a tag in HTML. This will set the ko.observable query variable which will update the filterList and toggle
	//markers animation. 
	updateMarkers: function(markers){
		if (markers.getAnimation()!==null){
			markers.setAnimation(null);
			viewModel.query('');
			markers.infoWindow.close(map,markers);
		}else {
			markers.setAnimation(google.maps.Animation.BOUNCE);
			viewModel.query(markers.title);
			markers.infoWindow.open(map, markers);
		}
	}

};

//custom binding for the query observable.
viewModel.query.subscribe(viewModel.search);
ko.applyBindings(viewModel);
