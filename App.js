var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());


wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
var placemarkLayer = new WorldWind.RenderableLayer();


function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML = h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);

    myFunction(today)
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

var count;
//console.log(x);
document.getElementById("deb1").onclick = function () { count = 1 };
document.getElementById("deb2").onclick = function () { count = 2 };
document.getElementById("deb3").onclick = function () { count = 3 };
document.getElementById("deb4").onclick = function () { count = 4 };


function myFunction(date) {
    var name;
    var ISS_TLE;


    switch (count) {
        case 1:
            ISS_TLE =
                `1 22675U 93036A   21276.31805575  .00000003  00000-0  10870-4 0  9998
        2 22675  74.0390 232.2629 0025688 327.0976  32.8575 14.32581666478399`;
            name = "COSMOS 2251"
            break;
        case 2:
            ISS_TLE =
                `1 25730U 99025A   21276.53408920  .00000621  00000-0  33537-3 0  9994
        2 25730  99.0479 301.0921 0015563 105.6683  12.1916 14.16378497154327`;
            name = "FENGYUN 1C"
            break;
        case 3:
            ISS_TLE =
                `1 44383U 19006DE  21276.31603912  .00044475  10780-5  58867-3 0  9993
            2 44383  96.1743 281.4268 0630341  90.1580 277.1817 14.51242132123043`;
            name = "MICROSAT-R DEB";
            break;
        case 4:
            ISS_TLE =
                `1 24946U 97051C   21276.47553234  .00000104  00000-0  30327-4 0  9992
            2 24946  86.3921 349.8832 0008639 155.8720 204.2882 14.33751214258863`;
            name = "IRIDIUM 33";
            break;
        default:
            ISS_TLE =
                `1 22675U 93036A   21276.31805575  .00000003  00000-0  10870-4 0  9998
        2 22675  74.0390 232.2629 0025688 327.0976  32.8575 14.32581666478399`;
            name = "COSMOS 2251"
    }

    wwd.addLayer(placemarkLayer);

    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.3,
        WorldWind.OFFSET_FRACTION, 0.0);

    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.0);

    placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";
    placemarkAttributes.imageScale = .2;


    const satrec = satellite.twoline2satrec(
        ISS_TLE.split('\n')[0].trim(),
        ISS_TLE.split('\n')[1].trim()
    );

    placemarkLayer.removeAllRenderables()

    var positionAndVelocity = satellite.propagate(satrec, date)
    var gmst = satellite.gstime(date);

    var positionEci = positionAndVelocity.position

    var positionGd = satellite.eciToGeodetic(positionEci, gmst)
    var longitude = positionGd.longitude,
        latitude = positionGd.latitude,
        height = positionGd.height;

    //  Convert the RADIANS to DEGREES.
    var longitudeDeg = satellite.degreesLong(longitude),
        latitudeDeg = satellite.degreesLat(latitude);

    var position = new WorldWind.Position(latitudeDeg, longitudeDeg, height * 1000);

    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

    placemark.label = name + "\n" +
        "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
        "Alt " + placemark.position.altitude.toPrecision(4).toString() + "\n" +
        "Lon " + placemark.position.longitude.toPrecision(5).toString();

    placemarkLayer.addRenderable(placemark);

}

