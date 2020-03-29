//1. Use the D3 library to read in `samples.json`.
var jsonfile = './data/samples.json';
var data;
var metadataid;
var wfreq = 0;
var initSample = 0;
var newSample = 0;
var newSample = document.getElementById("#selDataset");
var selector = d3.select("#selDataset");

d3.json(jsonfile).then(function(data) {
    //console.log(data)
    var names = data.names
    names.forEach((name) => {
    selector
        .append("option")
        .text(name)
        .property("value", name);
    });
    const initSample = names[0];
    //console.log('initSample#: ',initSample)
    makePlots(initSample);
    demoInfo(initSample);
});

function demoInfo(sampleId) {
    d3.json(jsonfile).then(function(data) {
        let metaData = data.metadata
        let sampleMeta = metaData.filter(mdata => mdata.id == sampleId);
        console.log('metaData#: ', sampleMeta[0]);
        var panelMetadata = d3.select("#sample-metadata");
        panelMetadata.html("");
        Object.entries(sampleMeta[0]).forEach(([key, value]) => {
            //console.log({key}, {value});
            panelMetadata.append("h5").text(`${key}: ${value}`);
        }); 
    });
};

function makePlots(sampleId) {
    d3.json(jsonfile).then(function(data) {
        let metaData = data.metadata
        let sampleMeta = metaData.filter(mdata => mdata.id == sampleId);
        let plotData = data.samples
        //console.log('plotData: ',plotData)
        let samplePlot = plotData.filter(pdata => pdata.id == sampleId);
        //console.log('samplePlot#: ', samplePlot[0]);
        let plot_T10_otu_ids = samplePlot[0].otu_ids.slice(0, 10);
        let plot_T10_samp = samplePlot[0].sample_values.slice(0, 10);
        let plot_T10_otu_lbl = samplePlot[0].otu_labels.slice(0, 10);
        //console.log('sample data collected')

        //Make barplot
        //console.log("barchart")
        var barTrace = {
            x: plot_T10_samp.reverse(),
            y: plot_T10_otu_ids.map(x => `OTU ${x}`).reverse(),
            text: plot_T10_otu_lbl.reverse(),
            type:"bar",
            orientation: "h",
        };
        var barData = [barTrace];
        var barLayout = {
            title: "<B>Top 10 OTU for this Subject</B>",
            yaxis: plot_T10_otu_ids,
        };
        var layout = [barLayout]
        Plotly.newPlot("bar", barData, barLayout); 

/*      //Make pieplot **note: this was a place holder for the gaugeplot
        //console.log("piechart")
        var piePlot = [{
            values: plot_T10_samp,
            lables: plot_T10_otu_ids,
            hovertext: plot_T10_otu_lbl,
            hole: .4,
            type: "pie",
            }];
        var pieLayout = {
            title: "Top 10 Percentages",
            showlegend: false,
        }
        Plotly.newPlot('pie',piePlot,pieLayout); */

        // Make guage plot
        console.log("gaugeplot")
        var wfreq = sampleMeta.map(d => d.wfreq) // used in gauge
        console.log(`Washing Freq: ${wfreq}`)
        var gaugeData = {
            domain: {x: [0, 1], 
                     y: [0, 1]},
            title: {text: "<B>Belly Button Washing Frequency</B> <br>Scrubs Per Week", 
                    font: {size: 16}},
            type: "indicator", 
            mode: "gauge",
            gauge:{
                axis: {range: [0, 9]}, 
                steps: [{range: [0, 1], color: 'rgba(255, 255, 255, 0)'},
                        {range: [1, 2], color: "floralwhite"},
                        {range: [2, 3], color: "linen"},
                        {range: [3, 4], color: 'rgba(210, 206, 145, .5)'},
                        {range: [4, 5], color: 'rgba(202, 209, 95, .5)'},
                        {range: [5, 6], color: 'rgba(170, 202, 42, .5)'},
                        {range: [6, 7], color: 'rgba(110, 154, 22, .5)'},
                        {range: [7, 8], color: "darkseagreen"},
                        {range: [8, 9], color: "forestgreen"}
                    ], 
                threshold: {line: {color: "red", width: 4},
                            thickness: 0.75, value: parseInt(wfreq)}
                },
                };
        var gaugeData = [gaugeData]
        var gaugeLayout = {margin: {t: 0, b: 0}};
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
        //Make bubbleplot
        d3.select('#bubble').html('')
        var bubbledata = {
          x: samplePlot[0].otu_ids,
          y: samplePlot[0].sample_values,
          text: samplePlot[0].otu_labels,
          mode: `markers`,
          marker: {
            size: samplePlot[0].sample_values,
            color: samplePlot[0].otu_ids,
            colorscale: "Earth"
          }
        };
    
        var bubbleData = [bubbledata];
        var bubbleLayout = {
            title: "<B>Interactive Biodiversity Bubble Chart</B>",
            height: 600,
            width: 1200,
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

function optionChanged(newSample) {
    //console.log('optionchanged#: ',newSample)
    // d3.select('#bar').html('')
    // d3.select('#pie').html('')
    // d3.select('#bubble').html('')
    makePlots(newSample);
    demoInfo(newSample);
  }