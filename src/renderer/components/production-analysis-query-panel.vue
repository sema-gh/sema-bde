<template>
  <el-form label-position="top" :inline="true" class="production-analysis__query-panel w-100 flex items-end justify-center">

    <el-form-item :label="$t('readyTypeDisplay.title')">
      <el-input class="production-analysis__ready-type-display"
        size="small"
        :value="$t('readyTypeDisplay.value')"
        readonly>
      </el-input>
    </el-form-item>

    <el-form-item :label="$t('dateRangePicker.title')">
      <el-date-picker class="production-analysis__date-range-select"
        type="daterange"
        size="small"
        align="left"
        v-model="dateRange"
        :picker-options="dateRangePickerOptions"
        :range-separator="$t('dateRangePicker.seperator')"
        :start-placeholder="$t('dateRangePicker.startPlaceholder')"
        :end-placeholder="$t('dateRangePicker.endPlaceholder')"
        unlink-panels>
      </el-date-picker>
    </el-form-item>

    <el-form-item :label="$t('groupSelect.title')">
      <el-select class="production-analysis__group-picker"
        size="small"
        v-model="group">
        <el-option
          v-for="option in groupSelectOptions" :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('chartTypeSelect.title')">
      <el-select class="production-analysis__chart-type-picker"
        size="small"
        v-model="chartType">
        <el-option
          v-for="option in chartTypeSelectOptions" :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button class="noprint"
        type="success"
        size="small"
        :disabled="!hasDateRange || !isDirty"
        @click="commitQuery">
        {{ $t('buttons.commit') }}
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import moment from 'moment'

export default {

  name: 'ProductionAnalysisQueryPanel',

  i18n: {
    messages: {
      de: {
        buttons: {
          commit: 'ANZEIGEN'
        },
        dateRangePicker: {
          seperator: '-',
          startPlaceholder: 'Startdatum',
          endPlaceholder: 'Enddatum',
          shortcuts: {
            last3Days: 'letz. 3 Tage',
            last7Days: 'letz. 7 Tage',
            last14Days: 'letz. 14 Tage',
            last30Days: 'letz. 30 Tage',
            last90Days: 'letz. 90 Tage'
          },
          title: 'Zeitraum'
        },
        groupSelect: {
          optionLabels: {
            hour: 'Stunde',
            day: 'Tag',
            week: 'Woche',
            month: 'Monat'
          },
          title: 'Aggregat'
        },
        readyTypeDisplay: {
          value: 'Verfügbarkeit',
          title: 'Daten'
        },
        chartTypeSelect: {
          optionLabels: {
            line: 'Linie',
            column: 'Balken'
          },
          title: 'Diagrammtyp'
        }
      }
    }
  },

  data () {
    return {
      dateRange: null,
      group: 'days',
      chartType: 'line'
    }
  },

  computed: {
    readyType () {
      return this.$store.state.productionAnalysis.readyType
    },

    dateRangePickerOptions () {
      const prefix = 'dateRangePicker.shortcuts.'

      return {
        shortcuts: [
          { text: this.$t(prefix + 'last3Days'), onClick: picker => this.pickDateRange(picker, [3, 'day']) },
          { text: this.$t(prefix + 'last7Days'), onClick: picker => this.pickDateRange(picker, [7, 'day']) },
          { text: this.$t(prefix + 'last14Days'), onClick: picker => this.pickDateRange(picker, [14, 'day']) },
          { text: this.$t(prefix + 'last30Days'), onClick: picker => this.pickDateRange(picker, [30, 'day']) },
          { text: this.$t(prefix + 'last90Days'), onClick: picker => this.pickDateRange(picker, [90, 'day']) }
        ]
      }
    },

    groupSelectOptions () {
      const prefix = 'groupSelect.optionLabels.'

      return [
        { label: this.$t(prefix + 'hour'), value: 'hours' },
        { label: this.$t(prefix + 'day'), value: 'days' },
        { label: this.$t(prefix + 'week'), value: 'weeks' },
        { label: this.$t(prefix + 'month'), value: 'months' }
      ]
    },

    chartTypeSelectOptions () {
      const prefix = 'chartTypeSelect.optionLabels.'

      return [
        { label: this.$t(prefix + 'line'), value: 'line' },
        { label: this.$t(prefix + 'column'), value: 'column' }
      ]
    },

    adjustedDateRange () {
      if (this.dateRange) {
        return [
          moment(this.dateRange[0]).startOf('day').toISOString(),
          moment(this.dateRange[1]).endOf('day').toISOString()
        ]
      } else {
        return this.dateRange
      }
    },

    isDirty () {
      const localDateRangeString = JSON.stringify(this.adjustedDateRange)
      const storeDateRangeString = JSON.stringify(this.$store.state.productionAnalysis.dateRange)

      if (localDateRangeString !== storeDateRangeString) return true
      if (this.group !== this.$store.state.productionAnalysis.group) return true
      if (this.chartType !== this.$store.state.productionAnalysis.chartType) return true

      return false
    },

    hasDateRange () {
      return !!this.dateRange
    }
  },

  methods: {
    pickDateRange (picker, args) {
      picker.$emit('pick', [
        moment().subtract(...args).toISOString(),
        moment().toISOString()
      ])
    },

    commitQuery () {
      this.$store.commit('SET_PRODUCTION_ANALYSIS_DATE_RANGE', [...this.adjustedDateRange])
      this.$store.commit('SET_PRODUCTION_ANALYSIS_GROUP', this.group)
      this.$store.commit('SET_PRODUCTION_ANALYSIS_CHART_TYPE', this.chartType)
    },

    resetQuery () {
      const storeDateRange = this.$store.state.productionAnalysis.dateRange

      this.dateRange = storeDateRange
        ? [...storeDateRange]
        : storeDateRange

      this.group = this.$store.state.productionAnalysis.group
      this.chartType = this.$store.state.productionAnalysis.chartType
    }
  },

  created () {
    this.resetQuery()
  }

}
</script>

<style lang="scss">
  .production-analysis__query-panel {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
      line-height: 1;
      padding-bottom: .125rem;
    }
  }

  .production-analysis__ready-type-display {
    min-width: 150px;
    max-width: 150px;
  }

  .production-analysis__date-range-select {
    min-width: 300px;

    .el-range-separator {
      padding: 0
    }
  }

  .production-analysis__chart-type-picker {
    min-width: 100px;
    max-width: 100px;
  }

  .production-analysis__group-picker {
    min-width: 100px;
    max-width: 100px;
  }
</style>
