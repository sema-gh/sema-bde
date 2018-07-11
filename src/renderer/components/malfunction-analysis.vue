<template>
  <div class="w-100 h-100 flex flex-column">
    <div class="flex-fix flex items-center pa3 bb b--element-gray">
      <malfunction-analysis-query-panel></malfunction-analysis-query-panel>
    </div>

    <malfunction-analysis-faults-chart></malfunction-analysis-faults-chart>
    <malfunction-analysis-output-chart></malfunction-analysis-output-chart>

  </div>
</template>

<script>
import MalfunctionAnalysisQueryPanel from './malfunction-analysis-query-panel'
import MalfunctionAnalysisFaultsChart from './malfunction-analysis-faults-chart'
import MalfunctionAnalysisOutputChart from './malfunction-analysis-output-chart'

export default {

  name: 'MalfunctionAnalysis',

  components: {
    MalfunctionAnalysisQueryPanel,
    MalfunctionAnalysisFaultsChart,
    MalfunctionAnalysisOutputChart
  }

}
</script>

<style lang="scss">
</style>
