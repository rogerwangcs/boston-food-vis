const MapBox = async (container) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZW5qYWxvdCIsImEiOiJjaWhtdmxhNTIwb25zdHBsejk0NGdhODJhIn0.2-F2hS_oTZenAWc0BMf_uw";
  //Setup mapbox-gl map
  let map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/enjalot/cihmvv7kg004v91kn22zjptsc",
    center: [-71.0989, 42.35],
    zoom: 12.3,
  });
  // map.addControl(new mapboxgl.NavigationControl());

  // Setup our svg layer that we can manipulate with d3
  var container = map.getCanvasContainer();
  var svg = d3.select(container).append("svg");

  // we calculate the scale given mapbox state (derived from viewport-mercator-project's code)
  // to define a d3 projection
  function getD3() {
    var bbox = document.body.getBoundingClientRect();
    var center = map.getCenter();
    var zoom = map.getZoom();
    // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
    var scale = ((512 * 0.5) / Math.PI) * Math.pow(2, zoom);

    var d3projection = d3
      .geoMercator()
      .center([center.lng, center.lat])
      .translate([bbox.width / 2, bbox.height / 2])
      .scale(scale);

    return d3projection;
  }
  // calculate the original d3 projection
  var d3Projection = getD3();

  var path = d3.geoPath();

  var url = "http://enjalot.github.io/wwsd/data/UK/london_stations.topojson";
  const data = await d3.json(url);
  var points = topojson.feature(data, data.objects.london_stations);
  var dots = svg.selectAll("circle.dot").data(points.features);
  dots.enter().append("circle").classed("dot", true).attr("r", 1).style({
    fill: "#0082a3",
    "fill-opacity": 0.6,
    stroke: "#004d60",
    "stroke-width": 1,
  });

  function render() {
    d3Projection = getD3();
    path.projection(d3Projection);

    dots.attr({
      cx: function (d) {
        var x = d3Projection(d.geometry.coordinates)[0];
        return x;
      },
      cy: function (d) {
        var y = d3Projection(d.geometry.coordinates)[1];
        return y;
      },
    });
  }

  // re-render our visualization whenever the view changes
  map.on("viewreset", function () {
    render();
  });
  map.on("move", function () {
    render();
  });
  // render our initial visualization
  render();

  const update = (data) => {};

  return {
    update,
  };
};

export default MapBox;
