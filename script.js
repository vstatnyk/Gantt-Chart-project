const URL =
  "https://script.google.com/macros/s/AKfycbxQJi9w4r73FJVfuP2F6J_z3A15khGim_hds8yxCc2joLIozIXCoctU573xJlkuPQ/exec";

// old url
// "https://script.google.com/macros/s/AKfycbx3-kKwOrpL1Q8shM0IZKzY-pX6HFdf561rriDu8YBePMavJHH0D1JjuV4D6Uo7WRo/exec";

// this is what the url should return
//   [DepartmentName:{Project {ProjectName: string,
//     ProjectStart : datetime,
//     ProjectEnd : datetime,
//     ProjectTasks : [{
//       TaskName : string
//       TaskStatus : string
//       TaskStartDate: datetime
//       TaskEndData: datetime
//       TaskAnticipatedEnd: datetime
//     }]}]

async function getResults(id) {
  const response = await fetch(URL + "?id=" + String(id)).then((res) =>
    res.json()
  );
  console.log(response);

  let rows = [];
  let itemid = 0;

  for (i in response) {
    // Department
    for (j in response[i]) {
      // Project
      start = splitDate(response[i][j]["start"]);
      end = splitDate(response[i][j]["end"]);

      rows.push([
        String(itemid),
        response[i][j]["name"] + "\n Status: " + response[i][j]["status"],
        i,
        new Date(Number(start[0]), Number(start[1]), Number(start[2])),
        new Date(Number(end[0]), Number(end[1]), Number(end[2])),
        null,
        100,
        null,
      ]);
      console.log(String(i) + String(j));

      for (k in response[i][j]["tasks"]) {
        // Tasks
        start = splitDate(response[i][j]["tasks"][k]["start"]);
        if (start.length == 1) {
          continue;
        }
        end = splitDate(response[i][j]["tasks"][k]["end"]);
        // anticipatedEnd = splitDate(
        //   response[i][j]["tasks"][k]["anticipatedEnd"]
        // );
        if (end.length == 1) {
          end = splitDate(response[i][j]["tasks"][k]["anticipatedEnd"]);
        }
        // if (start.length == 1) {
        //   continue;
        // }
        // console.log(response[i][j]["tasks"][k]["name"], start, end);

        rows.push([
          "task" + String(itemid) + String(k),
          response[i][j]["tasks"][k]["name"] +
            "\n Status: " +
            response[i][j]["tasks"][k]["status"],
          i,
          new Date(Number(start[0]), Number(start[1]), Number(start[2])),
          new Date(Number(end[0]), Number(end[1]), Number(end[2])),
          null,
          100,
          // response[i][j]["name"],,
          // null,
          String(itemid),
        ]);
        console.log(String(itemid));
      }
      itemid++;
    }
  }
  console.log(rows);

  for (i in rows) {
    console.log(rows[i][3]);
    if (rows[i][3] == "Invalid Date") {
      rows.splice(i, 1);
    }
  }

  console.log(rows);

  return rows;
}

function drawChart(rawData) {
  try {
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
      height: data.getNumberOfRows() * 60 + 100,
      gantt: {
        trackHeight: 60,
        barHeight: 45,
      },
    };

    var chart = new google.visualization.Gantt(
      document.getElementById("chart_div")
    );

    chart.draw(data, options);
  } catch (e) {
    console.log(e);
  }
}

function splitDate(date) {
  let dateTimeString = date;

  // Isolating the date part (before the 'T')
  let dateString = dateTimeString.split("T")[0];

  // Splitting the date into year, month, and day
  date = dateString.split("-");

  return date;
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

// const URL =
//   "https://script.google.com/macros/s/AKfycbxQJi9w4r73FJVfuP2F6J_z3A15khGim_hds8yxCc2joLIozIXCoctU573xJlkuPQ/exec";

// // old url
// // "https://script.google.com/macros/s/AKfycbx3-kKwOrpL1Q8shM0IZKzY-pX6HFdf561rriDu8YBePMavJHH0D1JjuV4D6Uo7WRo/exec";

// // this is what the url should return
// //   [DepartmentName:{Project {ProjectName: string,
// //     ProjectStart : datetime,
// //     ProjectEnd : datetime,
// //     ProjectTasks : [{
// //       TaskName : string
// //       TaskStatus : string
// //       TaskStartDate: datetime
// //       TaskEndData: datetime
// //       TaskAnticipatedEnd: datetime
// //     }]}]

// async function getResults(id) {
//   const response = await fetch(URL + "?id=" + String(id)).then((res) =>
//     res.json()
//   );
//   console.log(response);

//   let rows = [];
//   let iden = 0;

//   for (i in response) {
//     // Department
//     for (j in response[i]) {
//       // Project
//       start = splitDate(response[i][j]["start"]);
//       end = splitDate(response[i][j]["end"]);

//       console.log(iden);

//       rows.push([
//         iden,
//         response[i][j]["name"] + "\n Status: " + response[i][j]["status"],
//         i,
//         new Date(Number(start[0]), Number(start[1]), Number(start[2])),
//         new Date(Number(end[0]), Number(end[1]), Number(end[2])),
//         null,
//         100,
//         null,
//       ]);
//       console.log(String(i) + String(j));

//       for (k in response[i][j]["tasks"]) {
//         // Tasks
//         start = splitDate(response[i][j]["tasks"][k]["start"]);
//         end = splitDate(response[i][j]["tasks"][k]["end"]);
//         // anticipatedEnd = splitDate(
//         //   response[i][j]["tasks"][k]["anticipatedEnd"]
//         // );
//         if (end.length == 1) {
//           end = splitDate(response[i][j]["tasks"][k]["anticipatedEnd"]);
//         }
//         if (start.length == 1) {
//           continue;
//         }
//         // console.log(response[i][j]["tasks"][k]["name"], start, end);

//         rows.push([
//           response[i][j]["tasks"][k]["name"],
//           response[i][j]["tasks"][k]["name"] +
//             "\n Status: " +
//             response[i][j]["tasks"][k]["status"],
//           i,
//           new Date(Number(start[0]), Number(start[1]), Number(start[2])),
//           new Date(Number(end[0]), Number(end[1]), Number(end[2])),
//           null,
//           100,
//           // response[i][j]["name"],,
//           // null,
//           iden,
//         ]);
//         console.log(String(i) + String(j));
//       }
//       iden++;
//     }
//   }
//   console.log(rows);

//   return rows;
// }

// function drawChart(rawData) {
//   try {
//     // console.log("hello");
//     var data = new google.visualization.DataTable();
//     data.addColumn("string", "Task ID");
//     data.addColumn("string", "Task Name");
//     data.addColumn("string", "Resource");
//     data.addColumn("date", "Start Date");
//     data.addColumn("date", "End Date");
//     data.addColumn("number", "Duration");
//     data.addColumn("number", "Percent Complete");
//     data.addColumn("string", "Dependencies");

//     data.addRows(rawData);

//     var options = {
//       height: data.getNumberOfRows() * 60 + 100,
//       gantt: {
//         trackHeight: 60,
//         barHeight: 45,
//       },
//     };

//     var chart = new google.visualization.Gantt(
//       document.getElementById("chart_div")
//     );

//     chart.draw(data, options);
//   } catch (e) {
//     console.log(e);
//   }
// }

// function splitDate(date) {
//   let dateTimeString = date;

//   // Isolating the date part (before the 'T')
//   let dateString = dateTimeString.split("T")[0];

//   // Splitting the date into year, month, and day
//   date = dateString.split("-");

//   return date;
// }

// function daysToMilliseconds(days) {
//   return days * 24 * 60 * 60 * 1000;
// }

// // Function to calculate duration in days
// function calculateDuration(startDate, endDate) {
//   if (!startDate || !endDate) return null;
//   return (endDate - startDate) / (1000 * 60 * 60 * 24); // Duration in days
// }

// function validEndDate(date1, date2) {
//   // console.log(date1);
//   // console.log(date2);

//   // console.log(date1 != "" && date1 != "TBA" && date1 != "TBD");
//   if (date1 != "" && date1 != "TBA" && date1 != "TBD") {
//     return new Date(Number(date1[0]), Number(date1[2]), Number(date1[1]));
//   } else {
//     // console.log("else");
//     return new Date(Number(date2[0]), Number(date2[2]), Number(date2[1]));
//   }
// }

// async function initiateProcess() {
//   // Get the sheet_id value from the input

//   const sheetId = document.getElementById("sheet_id").value;
//   console.log(sheetId);

//   // Call getResults with the provided sheet_id
//   const data = await getResults(sheetId);

//   // Draw the chart with the retrieved data
//   drawChart(data);
// }
