var ADDRESS_URL_TEMPLATE = "http://gis.nola.gov/arcgis/rest/services/CompositePIN2/GeocodeServer/findAddressCandidates?f=json&SingleLine="
var DATA_URL_TEMPLATE = "http://gis.nola.gov/arcgis/rest/services/apps/WhereYat/MapServer/identify?geometry={x:{{x}},y:{{y}}}&geometryType=esriGeometryPoint&layers=all&tolerance=2&mapExtent=-10024926.71438405,3499735.513523042,-10024916.71438405,3499745.513523042&imageDisplay=20,20,96&returnGeometry=false&f=json"

var EVENTS = {
  Monday: "https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=c2FsMGEyOWI3bnVkOXVzcXA2b25nbzBuazRfMjAxNzAyMDZUMTAwMDAwWiBmbGMydmpnN3Q2ajJxM2M4ZnJocnByZ2FzZ0Bn&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com",
  Tuesday: "https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=dG1wYXFzbTlscWc2dThnYjVkdWEwYWFnMWtfMjAxNzAyMDdUMTAwMDAwWiBmbGMydmpnN3Q2ajJxM2M4ZnJocnByZ2FzZ0Bn&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com",
  Wednesday: "https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=dHNlcWVuMmp0dHRsMGlkY3JmM2lwaGU3ZGtfMjAxNzAyMDhUMTAwMDAwWiBmbGMydmpnN3Q2ajJxM2M4ZnJocnByZ2FzZ0Bn&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com",
  Thursday: "https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=MnNpaGZkOHRxMGdjZjVyajg0aHYzY2c2YmdfMjAxNzAyMDlUMTAwMDAwWiBmbGMydmpnN3Q2ajJxM2M4ZnJocnByZ2FzZ0Bn&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com",
  Friday: "https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=YTNsMWw5bmoybTZyNmxvcTg1NjZvZDY5cG9fMjAxNzAyMTBUMTAwMDAwWiBmbGMydmpnN3Q2ajJxM2M4ZnJocnByZ2FzZ0Bn&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com",
  Saturday: "https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=ZnE1M2VoNXFmdnY4cmtvdmIyamcwbGEzY28gZmxjMnZqZzd0NmoycTNjOGZyaHJwcmdhc2dAZw&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com",
}

$("#address-form").submit(function(event) {
  event.preventDefault()
  var address = $("#address").val()
  fetchAddress(address)
})

function fetchAddress(address) {
  var encodedAddress = encodeURI(address)
  var url = ADDRESS_URL_TEMPLATE + encodedAddress
  $.ajax(url).fail(handleError).done(addressesFetched)
}

function addressesFetched(response) {
  response = JSON.parse(response)
  if (!response.candidates || !response.candidates.length) {
    handleError("No results for that address")
    return
  }
  var location = response.candidates[0].location
  fetchData(location)
}

function fetchData(location) {
  var url = DATA_URL_TEMPLATE.replace("{{x}}", location.x).replace("{{y}}", location.y)
  $.ajax(url).fail(handleError).done(dataFetched)
}

function dataFetched(response) {
  response = JSON.parse(response)
  var layer = response.results.find(function(layer) {
    return layer.layerName === "Recycling Pickup"
  })
  var day = layer.attributes["Recycling Pickup Schedule"]
  results = "<h3>Pickup Day: " + day + "</h3>"
  results = results + "<p><a target='_blank' href='" + EVENTS[day] + "'>Click here to add a calendar event.</a></p>"
  results = results + "<h3>Dropoff Day For Glass & Electronics: Monthly </h3>"
  results = results + "<p><a target='_blank' href='https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=MXY1cXVxcjQ0YXZqMXIxZDZnOGV2OWRobzRfMjAxNzAyMTFUMTQwMDAwWiBmbGMydmpnN3Q2ajJxM2M4ZnJocnByZ2FzZ0Bn&amp;tmsrc=flc2vjg7t6j2q3c8frhrprgasg%40group.calendar.google.com'>Click here to add a calendar event.</a></p>"
  $("#results").html(results)
}

function handleError(error) {
  $("#results").html("<div class='alert alert-danger'><p>" + error + "</p></div>")
}
