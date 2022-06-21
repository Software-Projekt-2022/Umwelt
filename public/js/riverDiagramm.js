function riverSelect() {
    const slider = document.getElementById("riverSlider");
    const output = document.getElementById("output");

    slider.addEventListener("input", function () {
    output.value = this.value;
    document.getElementById("diagramm").src="https://pegelonline.wsv.de/webservices/rest-api/v2/stations/2f56e265-cd67-4ea1-8529-549b6ccf273a/W/measurements.png?start=P"
        +slider.value+"D&width=925&height=220";
    });

    slider.oninput = function() {
        output.innerHTML= this.value;
    }
}
riverSelect();

