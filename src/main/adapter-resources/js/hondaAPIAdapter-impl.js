var CLIENT_ID = 'cb33657e-7328-45a1-b579-b87157400979';
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
}

function getOwner(ownerid) {
	getEndpoints();

	INPUT.path = baseEndpoint + ownersEndpoint + ownerid;
	INPUT.method = GET;
	return MFP.Server.invokeHttp(INPUT);
}

function getOwnerVehicles(ownerid){
	getEndpoints();

	INPUT.path = baseEndpoint + ownersEndpoint + ownerid + "/" + vehiclesEndpoint;
	INPUT.method = GET;
	return MFP.Server.invokeHttp(INPUT);
}

function getVehicle(vehicleid){
	getEndpoints();

	INPUT.path = baseEndpoint + vehiclesEndpoint + vehicleid;
	INPUT.method = GET;
	return MFP.Server.invokeHttp(INPUT);
}

function getVehicleComponents(vehicleid){
	getEndpoints();

	INPUT.path = baseEndpoint + vehiclesEndpoint + vehicleid + componentsEndpoint;
	INPUT.method = GET;
	return MFP.Server.invokeHttp(INPUT);
}

//where={"_id":"54321"}

function setVehicleComponentStatus(componentID, status){
	getEndpoints();

	var dt = new Date();

	var component =  "componentStatus=" + status;
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

	MFP.Logger.info("==> Debug");
	MFP.Logger.info(input.path);

	return MFP.Server.invokeHttp(input);
}
