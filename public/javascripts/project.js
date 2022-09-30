$(document).ready(function () {
  $.get("/faculty/fetchallstates", function (data) {
    data.map((item) => {
      $("#state").append($("<option>").text(item.statename).val(item.stateid));
    });
  });

  $("#state").change(function () {
    $.get(
      "/faculty/fetchallcities",
      { stateid: $("#state").val() },
      function (data) {
        $("#city").empty();
        $("#city").append($("<option>").text("-city-"));
        data.map((item) => {
          $("#city").append(
            $("<option>").text(item.cityname).val(item.zipcode)
          );
        });
      }
    );
  });

  $("#city").change(function () {
    $("#zipcode").val($("#city").val());
  });
});
