var CLIENT_ID = '25fcaa77-a968-4966-af49-9bbfa130aac7';
var ACCEPT = 'application/json';
var JSON_CONTENT_TYPE = 'application/json';
var URLENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';
var JSON = 'json';
var POST = 'post';
var GET = 'get';

var baseEndpoint;
var ownersEndpoint;
var vehiclesEndpoint;
var componentsEndpoint;
var updateEndpoint;
var carVinEndpoint;

var INPUT = {
	method : this.GET,
	returnedContentType : JSON,
	headers: {
		'Accept': ACCEPT,
		'Content-Type': JSON_CONTENT_TYPE,
		'x-ibm-client-id': CLIENT_ID
	}
};

function getEndpoints(){
	baseEndpoint = MFP.Server.getPropertyValue("baseEndpoint");
	ownersEndpoint = MFP.Server.getPropertyValue("ownersEndpoint");
	vehiclesEndpoint = MFP.Server.getPropertyValue("vehiclesEndpoint");
	componentsEndpoint = MFP.Server.getPropertyValue("componentsEndpoint");
	updateEndpoint  = MFP.Server.getPropertyValue("updateEndpoint");
	carVinEndpoint = MFP.Server.getPropertyValue("carVinCheckEndpoint");
}

function getOwner(ownerid) {
	getEndpoints();

	INPUT.path = baseEndpoint + ownersEndpoint + ownerid;
	INPUT.method = GET;
	var response = MFP.Server.invokeHttp(INPUT);
	response.message = "JOHN WAS HERE working on demo for honda";
	return response;
}

function getOwnerVehicles(ownerid){
	getEndpoints();

	INPUT.path = baseEndpoint + ownersEndpoint + ownerid + "/" + vehiclesEndpoint;
	INPUT.method = GET;
	var vehicles = MFP.Server.invokeHttp(INPUT);

	var owner = getOwner(ownerid);
	vehicles.owner = {};
	vehicles.owner.name = owner.name;
	vehicles.owner.phone = owner.phone;

	for (var i=0; i < vehicles.array.length; i++){

		// Verify that the vin is in the vin database.
		INPUT.path = carVinEndpoint + vehicles.array[i].vin;
		var result = MFP.Server.invokeHttp(INPUT);
		vehicles.array[i].verified = (result.array.length > 0);

		// Get the vehicle components
		var components = getVehicleComponents(vehicles.array[i].vin);
		vehicles.array[i].components = components.array;
	}

	vehicles.vehicles = vehicles["array"];
	delete vehicles["array"];

	return vehicles;
}

function getVehicle(vehicleid){
	getEndpoints();

	INPUT.path = baseEndpoint + vehiclesEndpoint + vehicleid;
	INPUT.method = GET;
	return MFP.Server.invokeHttp(INPUT);
}

function getVehicleComponents(vehicleid){
	getEndpoints();

	INPUT.path = baseEndpoint + vehiclesEndpoint + vehicleid + "/" + componentsEndpoint;

	INPUT.method = GET;
	return MFP.Server.invokeHttp(INPUT);
}

function setVehicleComponentStatus(componentID, status){
	getEndpoints();

	var dt = new Date();

	var component =  "componentStatus=" + status + '&componentDate=' + dt.toISOString();
	var where = encodeURIComponent('{"_id": "' + componentID + '"}')


	var input = {
		method : POST,
		path: baseEndpoint + componentsEndpoint + updateEndpoint + '?where=' + where,
		headers: {
			'Accept' : JSON_CONTENT_TYPE,
			'x-ibm-client-id': CLIENT_ID
		},
		body: {
			content: component,
			contentType: URLENCODED_CONTENT_TYPE
		}
	};

	return MFP.Server.invokeHttp(input);
}
