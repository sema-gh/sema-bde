<template>
  <div class="w-100 h-75 flex ph3 pt3" v-loading="isRefreshing">
    <div class="flex-auto flex" v-show="isChartVisible">
      <div class="w-100 h-100" ref="chart">
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/services/malfunction-analysis'
import models from '@/models'

export default {

  name: 'MalfunctionAnalysisFaultsChart',

  i18n: {
    messages: {
      de: {
        chartTitles: {
          count: 'Störungsanzahl',
          time: 'Störungsdauer'
        },
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
    locale () {
      return this.$store.state.locale
    },

    dateRange () {
      return this.$store.state.malfunctionAnalysis.dateRange
    },

    group () {
      return this.$store.state.malfunctionAnalysis.group
    },

    faultType () {
      return this.$store.state.malfunctionAnalysis.faultType
    },

    chartType () {
      return this.$store.state.malfunctionAnalysis.chartType
    },

    config () {
      return this.$store.state.malfunctionAnalysis.chartConfig
    },

    refreshTrigger () {
      return [
        this.locale,
        this.dateRange,
        this.group,
        this.faultType,
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

      const docs = await models[this.faultType].getByTimestampRange(...this.dateRange)
      const dataProvider = await service.createFaultsChartData(docs, { dateRange: this.dateRange, group: this.group }, this.config)
      const graphs = service.createFaultsChartGraphs(this.config, { type: this.chartType, locale: this.locale }, this._chart.graphs)

      this._chart.dataProvider = dataProvider
      this._chart.graphs = graphs
      this._chart.categoryAxis.minPeriod = this.minPeriods[this.group]
      this._chart.chartCursor.categoryBalloonDateFormat = this.categoryBalloonDateFormats[this.group]

      this._chart.language = this.locale

      if (this.faultType === 'fault.time') {
        this._chart.allLabels[0].text = this.$t('chartTitles.time')

        this._chart.valueAxes[0].balloonTextFunction = this._chart.valueAxes[0].labelFunction = value => {
          if (value >= 1440) return (Math.round(value / 1440 * 100) / 100) + 'd'
          if (value >= 60) return (Math.round(value / 60 * 100) / 100) + 'h'

          return (Math.round(value * 100) / 100) + 'm'
        }

        this._chart.legend.valueFunction = (graphDataItem, valueText) => {
          if (valueText.length < 2) return ''

          let value = +valueText.substring(1).replace(/,/g, '')

          if (value >= 1440) value = (Math.round(value / 1440 * 100) / 100) + 'd'
          else if (value >= 60) value = (Math.round(value / 60 * 100) / 100) + 'h'
          else value = (Math.round(value * 100) / 100) + 'm'

          return valueText.charAt(0) === 'p'
            ? ' - max: ' + value
            : ' - ' + value
        }
      } else {
        this._chart.allLabels[0].text = this.$t('chartTitles.count')

        this._chart.legend.valueFunction = this._chart.valueAxes[0].balloonTextFunction = this._chart.valueAxes[0].labelFunction = value => {
          if (value >= 1000000) return (Math.round(value / 1000000 * 100) / 100) + 'M'
          if (value >= 100000) return (Math.round(value / 100000 * 100) / 100) + 'hk'
          if (value >= 1000) return (Math.round(value / 1000 * 100) / 100) + 'k'

          return (Math.round(value * 100) / 100)
        }

        this._chart.legend.valueFunction = (graphDataItem, valueText) => {
          if (valueText.length < 2) return ''

          let value = +valueText.substring(1).replace(/,/g, '')

          if (value >= 1000000) value = (Math.round(value / 1000000 * 100) / 100) + 'M'
          else if (value >= 100000) value = (Math.round(value / 100000 * 100) / 100) + 'hk'
          else if (value >= 1000) value = (Math.round(value / 1000 * 100) / 100) + 'k'
          else value = (Math.round(value * 100) / 100)

          return valueText.charAt(0) === 'p'
            ? ' - max: ' + value
            : ' - ' + value
        }
      }

      this._chart.validateData()

      this.isChartVisible = !!this._chart.dataProvider.length

      this.isRefreshing = false
    },

    create () {
      const options = {
        graphs: [],
        dataProvider: [],
        maxZoomFactor: 1000000,
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
          autoGridCount: true,
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
        this.$store.commit('SET_MALFUNCTION_ANALYSIS_ZOOM_RANGE', [event.startDate, event.endDate])
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
  .amcharts-chart-div {
    > a { display: none !important; }
  }
</style>
