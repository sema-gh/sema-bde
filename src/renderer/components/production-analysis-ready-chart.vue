<template>
  <div class="w-100 h-100 flex pa3" v-loading="isRefreshing">
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

  name: 'ProductionAnalysisReadyChart',

  i18n: {
    messages: {
      de: {
        chartTitle: 'Verfügbarkeit',
        zoomOutText: 'ALLES ANZEIGEN'
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
    readyType () {
      return this.$store.state.productionAnalysis.readyType
    },

    locale () {
      return this.$store.state.locale
    },

    dateRange () {
      return this.$store.state.productionAnalysis.dateRange
    },

    group () {
      return this.$store.state.productionAnalysis.group
    },

    chartType () {
      return this.$store.state.productionAnalysis.chartType
    },

    config () {
      return this.$store.state.productionAnalysis.chartConfig
    },

    refreshTrigger () {
      return [
        this.locale,
        this.dateRange,
        this.group,
        this.chartType
      ]
    }
  },

  watch: {
    refreshTrigger () {
      this.refresh()
    }
  },

  methods: {
    async refresh () {
      if (!this.dateRange) return

      this.isRefreshing = true

      this._chart.zoomOut()

      const docs = await models[this.readyType].getByTimestampRange(...this.dateRange)
      const dataProvider = await service.createReadyChartData(docs, { dateRange: this.dateRange, group: this.group }, this.config)
      const graphs = service.createReadyChartGraphs(this.config, { type: this.chartType, locale: this.locale }, this._chart.graphs)

      this._chart.dataProvider = dataProvider
      this._chart.graphs = graphs
      this._chart.categoryAxis.minPeriod = this.minPeriods[this.group]
      this._chart.chartCursor.categoryBalloonDateFormat = this.categoryBalloonDateFormats[this.group]

      this._chart.language = this.locale
      this._chart.allLabels[0].text = this.$t('chartTitle')

      this._chart.valueAxes[0].balloonTextFunction = this._chart.valueAxes[0].labelFunction = value => {
        return (Math.round(value * 100) / 100) + '%'
      }

      this._chart.legend.valueFunction = (graphDataItem, valueText) => {
        if (valueText.length < 2) return ''

        let value = +valueText.substring(1).replace(/,/g, '')
        value = (Math.round(value * 100) / 100) + '%'

        return valueText.charAt(0) === 'p'
          ? ' - max: ' + value
          : ' - ' + value
      }

      this._chart.validateData()

      this.isChartVisible = !!this._chart.dataProvider.length

      this.isRefreshing = false
    },

    create () {
      const options = {
        graphs: [],
        dataProvider: [],
        minMarginLeft: 75,
        marginTop: 30,
        type: 'serial',
        fontFamily: 'Nunito Sans',
        fontSize: 14,
        allLabels: [{
          text: '',
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
          periodValueText: 'p[[value.high]]',
          position: 'bottom',
          enabled: true,
          equalWidths: true,
          align: 'center',
          valueAlign: 'left',
          valueWidth: 100,
          valueText: 'v[[value]]',
          useGraphSettings: true,
          rollOverGraphAlpha: 0.1
        },
        chartCursor: {
          fullWidth: true,
          categoryBalloonEnabled: true,
          valueBalloonsEnabled: true,
          valueLineEnabled: true,
          valueLineBalloonEnabled: true,
          valueLineAlpha: 0.1,
          zoomable: true,
          valueZoomable: true,
          cursorAlpha: 0.1
        }
      }

      // eslint-disable-next-line no-undef
      this._chart = AmCharts.makeChart(this.$refs.chart, options)

      this._chart.addListener('zoomed', event => {
        this.$store.commit('SET_PRODUCTION_ANALYSIS_ZOOM_RANGE', [event.startDate, event.endDate])
      })

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
