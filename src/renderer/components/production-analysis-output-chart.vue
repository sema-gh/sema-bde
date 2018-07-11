<template>
  <div class="w-100 h-25 flex ph3 pb3" v-loading="isRefreshing">
    <div class="flex-auto flex" v-show="isChartVisible">
      <div class="w-100 h-100" ref="chart">
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/production-analysis'
import models from '@/models'

export default {

  name: 'ProductionAnalysisOutputChart',

  i18n: {
    messages: {
      de: {
        chartTitle: 'Produzierte Menge'
      }
    }
  },

  data () {
    return {
      isRefreshing: false,

      isChartVisible: false,

      minPeriods: {
        hours: 'hh',
        days: 'DD',
        weeks: 'WW',
        months: 'MM'
      },

      categoryBalloonDateFormats: {
        hours: 'MMM DD JJ:NN',
        days: 'MMM DD',
        weeks: 'MMM DD',
        months: 'MMM YYYY'
      }
    }
  },

  computed: {
    locale () {
      return this.$store.state.locale
    },

    dateRange () {
      return this.$store.state.productionAnalysis.dateRange
    },

    group () {
      return this.$store.state.productionAnalysis.group
    },

    zoomRange () {
      return this.$store.state.productionAnalysis.zoomRange
    },

    refreshTrigger () {
      return [
        this.locale,
        this.dateRange,
        this.group
      ]
    }
  },

  watch: {
    refreshTrigger () {
      this.refresh()
    },

    zoomRange () {
      if (this._chart && this.zoomRange) {
        this._chart.zoomToDates(...this.zoomRange)
      }
    }
  },

  methods: {
    async refresh () {
      if (!this.dateRange) return

      this.isRefreshing = true

      const docs = await models['output.count'].getByTimestampRange(...this.dateRange)
      const dataProvider = await service.createOutputChartData(docs, { dateRange: this.dateRange, group: this.group })
      const graphs = service.createOutputChartGraphs()

      this._chart.dataProvider = dataProvider
      this._chart.graphs = graphs
      this._chart.categoryAxis.minPeriod = this.minPeriods[this.group]
      this._chart.chartCursor.categoryBalloonDateFormat = this.categoryBalloonDateFormats[this.group]

      this._chart.language = this.locale
      this._chart.allLabels[0].text = this.$t('chartTitle')

      this._chart.validateData()

      this.isChartVisible = !!this._chart.dataProvider.length

      this.isRefreshing = false
    },

    create () {
      const options = {
        graphs: [],
        dataProvider: [],
        zoomOutText: '',
        minMarginLeft: 75,
        marginTop: 30,
        type: 'serial',
        fontFamily: 'Nunito Sans',
        fontSize: 14,
        allLabels: [{
          bold: false,
          size: 14,
          x: 75,
          y: 0,
          rotation: 0,
          width: '100%',
          align: 'left'
        }],
        valueAxes: [{
          axisAlpha: 0,
          gridAlpha: 0.1,
          position: 'left'
        }],
        categoryField: 'timestamp',
        categoryAxis: {
          gridAlpha: 0.07,
          dateFormats: [
            { period: 'mm', format: 'JJ:NN' },
            { period: 'hh', format: 'JJ:NN' },
            { period: 'DD', format: 'MMM DD' },
            { period: 'WW', format: 'MMM DD' },
            { period: 'MM', format: 'MMM' },
            { period: 'YYYY', format: 'YYYY' }
          ],
          minorGridEnabled: true,
          minPeriod: 'DD',
          parseDates: true
        },
        legend: {
          enabled: false
        },
        chartCursor: {
          fullWidth: true,
          categoryBalloonEnabled: true,
          valueBalloonsEnabled: false,
          valueLineEnabled: true,
          valueLineBalloonEnabled: true,
          valueLineAlpha: 0.1,
          zoomable: false,
          cursorAlpha: 0.1
        }
      }

      options.valueAxes[0].balloonTextFunction = options.valueAxes[0].labelFunction = value => {
        if (value >= 1000000) return (Math.round(value / 1000000 * 100) / 100) + 'M'
        if (value >= 100000) return (Math.round(value / 100000 * 100) / 100) + 'hk'
        if (value >= 1000) return (Math.round(value / 1000 * 100) / 100) + 'k'

        return Math.round(value, -2)
      }

      // eslint-disable-next-line no-undef
      this._chart = AmCharts.makeChart(this.$refs.chart, options)
      this.refresh()
    }
  },

  mounted () {
    this.create()
  }

}
</script>

<style lang="scss">
</style>
