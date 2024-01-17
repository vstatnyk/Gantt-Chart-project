const URL =
  "https://script.google.com/macros/s/AKfycbz5TUz7wei-0Wafq7y3QdFQcdI_7Pkvx6HLf4N4FGi1f-qInNzhhZkOQYI2p0mQu5A/exec";

async function getResults(id) {
  console.log(URL + "?id=" + String(id));
  const get = await fetch(URL + "?id=" + String(id)).then((res) => res.json());
  // console.log(get);
  let rows = [];

  for (i in get) {
    // console.log(get[i]);
    for (j in get[i]) {
      // console.log(get[i][j]);
      start = splitDate(get[i][j]["start"]);
      // console.log(start);
      end = splitDate(get[i][j]["end"]);
      // console.log(end);
      if (end.length == 1) {
        end = splitDate(get[i][j]["aniticipatedEnd"]);
      }
      // console.log(end);
      // aniticipatedEnd = splitDate(get[i][j]["aniticipatedEnd"]);
      rows.push([
        i + j,
        get[i][j]["name"],
        i,
        new Date(Number(start[0]), Number(start[1]), Number(start[2])),
        new Date(Number(end[0]), Number(end[1]), Number(end[2])),
        null,
        100,
        null,
      ]);
    }
  }

  return rows;
}

function splitDate(date) {
  let dateTimeString = date;

  // Isolating the date part (before the 'T')
  let dateString = dateTimeString.split("T")[0];

  // Splitting the date into year, month, and day
  date = dateString.split("-");

  return date;
}

function drawChart(rawData) {
  // console.log("hello");
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Task ID");
  data.addColumn("string", "Task Name");
  data.addColumn("string", "Resource");
  data.addColumn("date", "Start Date");
  data.addColumn("date", "End Date");
  data.addColumn("number", "Duration");
  data.addColumn("number", "Percent Complete");
  data.addColumn("string", "Dependencies");

  data.addRows(rawData);

  var options = {
    height: 10000,
  };

  var chart = new google.visualization.Gantt(
    document.getElementById("chart_div")
  );

  chart.draw(data, options);
}

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

// Function to calculate duration in days
function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return null;
  return (endDate - startDate) / (1000 * 60 * 60 * 24); // Duration in days
}

function validEndDate(date1, date2) {
  // console.log(date1);
  // console.log(date2);

  // console.log(date1 != "" && date1 != "TBA" && date1 != "TBD");
  if (date1 != "" && date1 != "TBA" && date1 != "TBD") {
    return new Date(Number(date1[0]), Number(date1[2]), Number(date1[1]));
  } else {
    // console.log("else");
    return new Date(Number(date2[0]), Number(date2[2]), Number(date2[1]));
  }
}

async function initiateProcess() {
  // Get the sheet_id value from the input

  const sheetId = document.getElementById("sheet_id").value;
  console.log(sheetId);

  // Call getResults with the provided sheet_id
  const data = await getResults(sheetId);

  // Draw the chart with the retrieved data
  drawChart(data);
}
