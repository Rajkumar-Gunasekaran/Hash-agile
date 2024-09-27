document.getElementById('csvFileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            const graphData = parseCSVToGraphData(csvData);
            renderNetworkGraph(graphData);
        };
        reader.readAsText(file);
    }
}

// Function to parse CSV data into nodes and links
function parseCSVToGraphData(csv) {
    const rows = csv.split('\n').slice(1); // Skip header row
    const nodes = new Set(); // Set to hold unique nodes
    const links = []; // Array to hold link connections

    rows.forEach(row => {
        const [source, target] = row.split(',').map(cell => cell.trim());
        if (source && target) {
            nodes.add(source);
            nodes.add(target);
            links.push({ from: source, to: target });
        }
    });

    return { nodes: Array.from(nodes), links: links };
}

// Function to render the network graph using Highcharts
function renderNetworkGraph(data) {
    Highcharts.chart('container', {
        chart: {
            type: 'networkgraph',
            plotBorderWidth: 1
        },
        title: {
            text: 'Dynamic Network Graph from CSV'
        },
        plotOptions: {
            networkgraph: {
                keys: ['from', 'to']
            }
        },
        series: [{
            dataLabels: {
                enabled: true,
                linkFormat: '',
                allowOverlap: true,
                format: '{point.id}'
            },
            id: 'networkgraph',
            data: data.links
        }]
    });
}
