const BASE = {
  showBalloon: false
}

const EXTENSIONS = {
  line: {
    type: 'line',
    lineThickness: 2,
    hideBulletsCount: 50,
    connect: false
  },

  column: {
    type: 'column',
    fillAlphas: 0.75
  }
}

export default function (config, { type, locale }, curGraphs = []) {
  const graphs = []

  config.graphs.forEach((e, index) => {
    const graph = Object.assign({}, BASE, EXTENSIONS[type])

    graph.valueField = index
    graph.title = e.label[locale]

    if (e.lineColor) {
      graph.lineColor = e.lineColor
    }

    if (type === 'line') {
      graph.bullet = e.bullet

      if (e.dashLength) {
        graph.dashLength = e.dashLength
      }
    }

    const curGraph = curGraphs.find(e => e.title === graph.title)

    if (curGraph) {
      graph.hidden = curGraph.hidden
    }

    graphs.push(graph)
  })

  return graphs
}
