//1. Use the D3 library to read in `samples.json`.
var jsonfile = './data/samples.json';
var data;
var metadataid;
var initSample = 0;
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
        //console.log('metaData#: ', sampleMeta[0]);
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
            title: "Top 10 OTU for this Subject",
            yaxis: plot_T10_otu_ids,
        };
        Plotly.plot("bar", barData, barLayout); 

        //Make pieplot
        //console.log("piechart")
        var pieplot = [{
            values: plot_T10_samp,
            lables: plot_T10_otu_ids,
            hovertext: plot_T10_otu_lbl,
            hole: .4,
            type: "pie",
            }];
        var pielayout = {
            title: "Top 10 Percentages",
            showlegend: false,
        }
        Plotly.plot('pie',pieplot,pielayout);

        //Make bubbleplot
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
    
        var data = [bubbledata];
        var bubblelayout = {
            title: "Interactive Biodiversity Bubble Chart",
            height: 600,
            width: 1200,
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", data, bubblelayout);
    });
};

function optionChanged(newSample) {
    //console.log('optionchanged#: ',newSample)
    makePlots(newSample);
    demoInfo(newSample);
  }