const URL =
  "https://script.google.com/macros/s/AKfycbxjj3o0eXaiFgDM9zsTAYJFBKuH25F0l5aW8kLJqFeROqEtpCnpkna44otimrKWTtU/exec";

async function getResults() {
  // send get request to URL
  const get = await fetch(URL).then((res) => res.json());
  console.log(get);
  let rows = [];

  for (i in get) {
    // console.log(get[i]);
    for (j in get[i]) {
      start = splitDate(get[i][j]["start"]);
      console.log(start);
      end = splitDate(get[i][j]["end"]);
      aniticipatedEnd = splitDate(get[i][j]["aniticipatedEnd"]);
      rows.push([
        i + j,
        get[i][j]["name"],
        i,
        new Date(Number(start[0]), Number(start[2]), Number(start[1])),
        validEndDate(end, aniticipatedEnd),
        null,
        100,
        null,
      ]);
      // console.log(new Date(Number(end[0]), Number(end[1]), Number(end[2])));
    }
  }
  // console.log(new Date(Number(end[0]), Number(end[1]), Number(end[2])));

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
