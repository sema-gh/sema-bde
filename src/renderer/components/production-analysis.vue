<template>
  <div class="w-100 h-100 flex flex-column">
    <div class="flex-fix flex items-center pa3 bb b--element-gray">
      <production-analysis-query-panel></production-analysis-query-panel>
    </div>

    <production-analysis-ready-chart></production-analysis-ready-chart>
    <production-analysis-output-chart></production-analysis-output-chart>

  </div>
</template>

<script>
import ProductionAnalysisQueryPanel from './production-analysis-query-panel'
import ProductionAnalysisReadyChart from './production-analysis-ready-chart'
import ProductionAnalysisOutputChart from './production-analysis-output-chart'

export default {

  name: 'ProductionAnalysis',

  components: {
    ProductionAnalysisQueryPanel,
    ProductionAnalysisReadyChart,
    ProductionAnalysisOutputChart
  }

}
</script>

<style lang="scss">
</style>
