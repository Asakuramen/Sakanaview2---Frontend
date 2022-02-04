


function myfunc_dataview_plot(args) {

  // ブラウザのwidth取得
  const plotly_width = document.getElementById('dataview_plotly').clientWidth;

  let name = args.sensorname;
  var data = [];
  var layout = {
    autosize: false,
    width: plotly_width - 30, // 左右margin15px分を引き算
    height: 380,
    margin: {
      l: 40,
      r: 30,
      b: 40,
      t: 20,
      pad: 5,
    },
    xaxis: {
      range: [args.datetime_start, args.datetime_end]
    },
    yaxis: {}
  };
  var config = {
    staticPlot: false,
    displayModeBar: false
  }

  switch (name) {
    case "ac100v1":
    case "ac100v2":
    case "ac100v3":
    case "ac100v4":
    case "ac100v5":
    case "ac100v6":
      data = [
        {
          x: args.datetimenow,
          y: args.sensordata,
          mode: 'lines+markers',
          name: 'hv',
          line: { shape: 'hv' },
        }
      ];
      layout['yaxis']['range'] = [-0.2, 1.2];
      layout['yaxis']['tickmode'] = 'array';
      layout['yaxis']['tickvals'] = [0, 1];
      layout['yaxis']['ticktext'] = ['OFF','ON'];
      break;

    case "watar_temperature":
    case "air_temperature":
      data = [
        {
          x: args.datetimenow,
          y: args.sensordata,
          mode: 'lines+markers',
          line: {shape: 'linear'},
        }
      ];
      layout['yaxis']['range'] = [14, 36];
      // layout['yaxis']['tickmode'] = 'array';
      // layout['yaxis']['tickvals'] = [15,20,25,30,35];
      layout['yaxis']['ticksuffix'] = "℃"
      break;

    case "air_humidity":
      data = [
        {
          x: args.datetimenow,
          y: args.sensordata,
          mode: 'lines+markers',
          line: {shape: 'linear'},
        }
      ];
      layout['yaxis']['range'] = [19, 101];
      layout['yaxis']['tickmode'] = 'array';
      layout['yaxis']['ticksuffix'] = "%"
      break;

    case "food_level":
      data = [
        {
          x: args.datetimenow,
          y: args.sensordata,
          mode: 'lines+markers',
          line: { shape: 'hv' },
        }
      ];
      layout['yaxis']['range'] = [-1, 101];
      layout['yaxis']['tickmode'] = 'array';
      layout['yaxis']['ticksuffix'] = "%"
      break;

    default:
      myfunc_consoleLog("myfunc_dataview_plot > unknown sensorname", DEBUG_LEVEL);

  }


  Plotly.newPlot('dataview_plotly', data, layout, config);

}



