var url = [];
var response = [];
var counter = 0;
$(document).ready(function(){

//Flickr Ajax request. The photos are saved within an array.
for (var i in Model){
	Model[i].url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f4df1e23d6a578740f508e40642d3b83&per_page=10&lat='+Model[i].lat +'&lon='+Model[i].lng+'&text='+Model[i].name+ '&per_page=10&format=json&nojsoncallback=1';
	$.when(
		$.ajax({
			url: Model[i].url,
			error : function(data){
				alert("Error connecting to Flickr API. Reload the page and try again");
			}
		})
	).done(function(data){
		response.push(data);
	});
};
});

//When ajax requests complete update the infoWindow with the new infodata photos
$(document).ajaxSuccess(function(){
	Model[counter].photos=response[counter].photos.photo;
	for(x in Model[counter].photos){
				formattedDiv = 	"<img id='images' src='https://farm"+Model[counter].photos[x].farm+".staticflickr.com/"+Model[counter].photos[x].server+"/"+Model[counter].photos[x].id+"_"+Model[counter].photos[x].secret+".jpg'>";
				Model[counter].infodata = Model[counter].infodata + formattedDiv;
			};				
	Model[counter].markers.infoWindow.setContent(Model[counter].infodata);		
	counter++;
})

