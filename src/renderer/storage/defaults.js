export default {
  isDatabasePersistent: false,
  isAutoImportEnabled: false,

  isFullScreen: false,

  importConfigs: [
    {
      pattern: 'BDE_Stoermeldungen*',
      delimiter: ';',
      hasHeader: true,
      columns: [
        {
          key: 'VarName',
          type: 'string'
        },
        {
          key: 'VarValue',
          type: 'number',
          separators: {
            thousands: '',
            decimal: ''
          }
        },
        {
          key: 'TimeString',
          type: 'datetime',
          format: 'DD.MM.YYYY HH:mm:ss'
        }
      ],
      contents: [
        {
          model: 'fault.count',
          test: {
            key: 'VarName',
            pattern: 'BDE_SM_*_Count'
          },
          template: {
            name: 'VarName',
            value: 'VarValue',
            timestamp: 'TimeString'
          },
          options: {
            isUpsert: false
          }
        },
        {
          model: 'fault.time',
          test: {
            key: 'VarName',
            pattern: 'BDE_SM_*_Time'
          },
          template: {
            name: 'VarName',
            value: 'VarValue',
            timestamp: 'TimeString'
          },
          options: {
            isUpsert: false
          }
        },
        {
          model: 'output.count',
          test: {
            key: 'VarName',
            pattern: 'BDE_SM_ProductCounter'
          },
          template: {
            value: 'VarValue',
            timestamp: 'TimeString'
          },
          options: {
            isUpsert: false
          }
        }
      ]
    },
    {
      pattern: 'BDE_AnlagenReady*',
      delimiter: ';',
      hasHeader: true,
      columns: [
        {
          key: 'VarName',
          type: 'string'
        },
        {
          key: 'VarValue',
          type: 'number',
          separators: {
            thousands: '',
            decimal: ''
          }
        },
        {
          key: 'TimeString',
          type: 'datetime',
          format: 'DD.MM.YYYY HH:mm:ss'
        }
      ],
      contents: [
        {
          model: 'ready.time',
          test: {
            key: 'VarName',
            pattern: 'BDE_ready_@(option*|*stream|sema)_Time'
          },
          template: {
            name: 'VarName',
            value: 'VarValue',
            timestamp: 'TimeString'
          },
          options: {
            isUpsert: false
          }
        }
      ]
    }
  ],

  faultSignalsChartConfig: {
    graphs: [
      {
        pattern: 'BDE_SM_01*',
        label: {
          de: 'Störung Nr.1'
        },
        bullet: 'round',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_02*',
        label: {
          de: 'Störung Nr.2'
        },
        bullet: 'square',
        lineColor: '',
        dashLength: 5
      },
      {
        pattern: 'BDE_SM_03*',
        label: {
          de: 'Störung Nr.3'
        },
        bullet: 'diamond',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_04*',
        label: {
          de: 'Störung Nr.4'
        },
        bullet: 'triangleUp',
        lineColor: '',
        dashLength: 3
      },
      {
        pattern: 'BDE_SM_05*',
        label: {
          de: 'Störung Nr.5'
        },
        bullet: 'triangleDown',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_06*',
        label: {
          de: 'Störung Nr.6'
        },
        bullet: 'round',
        lineColor: '',
        dashLength: 5
      },
      {
        pattern: 'BDE_SM_07*',
        label: {
          de: 'Störung Nr.7'
        },
        bullet: 'square',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_08*',
        label: {
          de: 'Störung Nr.8'
        },
        bullet: 'diamond',
        lineColor: '',
        dashLength: 3
      },
      {
        pattern: 'BDE_SM_09*',
        label: {
          de: 'Störung Nr.9'
        },
        bullet: 'triangleUp',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_10*',
        label: {
          de: 'Störung Nr.10'
        },
        bullet: 'triangleDown',
        lineColor: '',
        dashLength: 5
      },
      {
        pattern: 'BDE_SM_11*',
        label: {
          de: 'Störung Nr.11'
        },
        bullet: 'round',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_12*',
        label: {
          de: 'Störung Nr.12'
        },
        bullet: 'square',
        lineColor: '',
        dashLength: 3
      },
      {
        pattern: 'BDE_SM_13*',
        label: {
          de: 'Störung Nr.13'
        },
        bullet: 'diamond',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_14*',
        label: {
          de: 'Störung Nr.14'
        },
        bullet: 'triangleUp',
        lineColor: '',
        dashLength: 5
      },
      {
        pattern: 'BDE_SM_15*',
        label: {
          de: 'Störung Nr.15'
        },
        bullet: 'triangleDown',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_SM_16*',
        label: {
          de: 'Störung Nr.16'
        },
        bullet: 'round',
        lineColor: '',
        dashLength: 3
      }
    ]
  },

  readySignalsChartConfig: {
    graphs: [
      {
        pattern: 'BDE_ready_option1*',
        label: {
          de: 'Option Nr.1'
        },
        bullet: 'round',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_ready_option2*',
        label: {
          de: 'Option Nr.2'
        },
        bullet: 'square',
        lineColor: '',
        dashLength: 5
      },
      {
        pattern: 'BDE_ready_option3*',
        label: {
          de: 'Option Nr.3'
        },
        bullet: 'diamond',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_ready_option4*',
        label: {
          de: 'Option Nr.4'
        },
        bullet: 'triangleUp',
        lineColor: '',
        dashLength: 3
      },
      {
        pattern: 'BDE_ready_option5*',
        label: {
          de: 'Option Nr.5'
        },
        bullet: 'triangleDown',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_ready_downstream*',
        label: {
          de: 'Downstream'
        },
        bullet: 'round',
        lineColor: '',
        dashLength: 5
      },
      {
        pattern: 'BDE_ready_upstream*',
        label: {
          de: 'Upstream'
        },
        bullet: 'square',
        lineColor: '',
        dashLength: ''
      },
      {
        pattern: 'BDE_ready_sema*',
        label: {
          de: 'Sema'
        },
        bullet: 'diamond',
        lineColor: '',
        dashLength: 3
      }
    ]
  }
}
