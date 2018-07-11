export default function () {
  const graphs = []

  const graph = {}

  graph.type = 'column'
  graph.valueField = 0
  graph.showBalloon = false
  graph.fillAlphas = 0.75
  graph.fillColors = '#409eff'
  graph.lineColor = '#409eff'

  graphs.push(graph)

  return graphs
}
