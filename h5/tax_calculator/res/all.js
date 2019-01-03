var app = new Vue({
  el: '#app',
  data: {
    viewer: 'home',
    popup: '',
    type: '',
    forms: {
      total: '',
      area: '',
      fapiao: 1,
      oldPrice: '',
      fangchanzheng: 0,
      only: 1,
      first: 1,
      fangchanzhengTime: ''
    },
    options: {
      fapiao: {
        title: '是否提供上一手购房发票',
        value: {
          0: '否',
          1: '是'
        }
      },
      fangchanzheng: {
        title: '房产证年限',
        value: {
          0: '不满2年',
          1: '满2年',
          2: '满5年'
        }
      },
      only: {
        title: '是否家庭唯一住房（卖方）',
        value: {
          0: '否',
          1: '是'
        }
      },
      first: {
        title: '是否家庭首套房',
        value: {
          0: '二套',
          1: '首套'
        }
      }
    },
    result: {
      qishui: { value: 0, formula: '' },
      zengzhishui: { value: 0, formula: '' },
      geshui: { value: 0, formula: '' },
      tudishui: { value: 0, formula: '' },
      fangchanshui: { value: 0, formula: '' },
      yinhuashui: { value: 0, formula: '总价0.05%' },
      shiyongshui: { value: 0, formula: '2元/平方米' }
    },
    select: {},
    chart: {},
    loading: false,
    showResult: false,
    bubbleTips: '',
    bubble: false
  },
  mounted: function () {
    $('.wrapper').css('min-height', $(window).height());
  },
  computed: {
    totalTax: function () {
      var tax = 0;
      for (var p in this.result) {
        tax += (isNaN(this.result[p].value) ? 0 : Number(this.result[p].value));
      }
      return tax;
    }
  },
  methods: {
    jump2From: function () {
      setTimeout(function () {
        app.viewer = 'calculator';
        $('html, body').css({ height: 'auto' });
      }, 800);
    },
    showSelect: function (option) {
      this.popup = 'select';
      this.select = this.options[option];
      this.select.option = option;
    },
    selectOption: function (key, val) {
      this.forms[key] = Number(val);
      setTimeout(function () {
        app.popup = '';
      }, 200);
    },
    startCompute: function () {
      if (this.forms.total == '' || this.forms.total <= 0) {
        this.bubbleTips = '请输入房款总价';
        this.bubble = true;
        setTimeout(function () {
          app.bubble = false;
        }, 2000);
        return;
      }
      if (this.forms.area == '' || this.forms.area <= 0) {
        this.bubbleTips = '请输入建筑面积';
        this.bubble = true;
        setTimeout(function () {
          app.bubble = false;
        }, 2000);
        return;
      }
      if (this.type != 1 && this.forms.fapiao == 1 && (this.forms.oldPrice == '' || this.forms.oldPrice <= 0)) {
        this.bubbleTips = '请输入上一手交易价格';
        this.bubble = true;
        setTimeout(function () {
          app.bubble = false;
        }, 2000);
        return;
      }

      this.loading = true;
      this.computeFn();
      this.createChart();
      this.showResult = true;
      setTimeout(function () {
        app.loading = false;
        app.scrollToElement(document.querySelector('.calculator-result'));
      }, 500);
    },
    restartCompute: function () {
      // this.chart.clear();
      // this.result = {
      //   qishui: { value: 0, formula: '' },
      //   zengzhishui: { value: 0, formula: '' },
      //   geshui: { value: 0, formula: '' },
      //   tudishui: { value: 0, formula: '' },
      //   fangchanshui: { value: 0, formula: '' },
      //   yinhuashui: { value: 0, formula: '总价0.05%' },
      //   shiyongshui: { value: 0, formula: '2元/平方米' }
      // };
      this.scrollToElement(document.querySelector('.calculator-form'));
    },
    scrollToElement: function (el) {
      $('html, body').animate({ scrollTop: el.offsetTop }, 500);
    },
    createChart: function () {
      var chart = document.getElementById('chart');
      chart.style.width = window.screen.width + 'px';
      chart.style.height = window.screen.width * 0.5 + 'px';

      if (!this.chart) {
        this.chart.clear();
      }

      this.chart = echarts.init(chart);

      var option = {
        legend: {
          orient: 'vertical',
          right: '6%',
          top: '12%',
          data: ['契税', '增值税', '个税']
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            label: { normal: { show: false } },
            lableLine: { normal: { show: false } },
            data: [
              { value: this.result.qishui.value, name: '契税', itemStyle: { normal: { color: '#343880' } } },
              { value: this.result.zengzhishui.value, name: '增值税', itemStyle: { normal: { color: '#9092b9' } } },
              { value: this.result.geshui.value, name: '个税', itemStyle: { normal: { color: '#cacbde' } } }
            ]
          }
        ]
      };

      this.chart.setOption(option);
    },
    computeFn: function () {
      if (this.type == 1) {
        this.computeType1();
      } else if (this.type == 2) {
        if (this.forms.area < 144) {
          this.computeType2();
        } else {
          this.computeType3();
        }
      } else if (this.type == 3) {
        this.computeType3();
      } else if (this.type == 4) {
        this.computeType4();
      }
    },
    computeType1: function () {
      if (this.forms.first) {
        if (this.forms.area <= 90) {
          this.result.qishui.value = this.forms.total * 10000 * 0.01;
          this.result.qishui.formula = '(1%)';
        } else {
          this.result.qishui.value = this.forms.total * 10000 * 0.015;
          this.result.qishui.formula = '(1.5%)';
        }
      } else {
        this.result.qishui.value = this.forms.total * 10000 * 0.03;
        this.result.qishui.formula = '(3%)';
      }
    },
    computeType2: function () {
      // 契税
      this.computeType1();

      // 增值税
      if (this.forms.fangchanzheng == 0) {
        this.result.zengzhishui.value = this.forms.total * 10000 * 0.056;
        this.result.zengzhishui.formula = '(总价5.6%)';
      } else {
        this.result.zengzhishui.value = 0;
        this.result.zengzhishui.formula = '(免征)';
      }

      // 个税
      if (this.forms.fangchanzheng == 2 && this.forms.only) {
        this.result.geshui.value = 0;
        this.result.geshui.formula = '(免征)';
      } else {
        if (this.forms.fapiao) {
          this.result.geshui.value = (this.forms.total - this.forms.oldPrice) * 10000 * 0.2;
          this.result.geshui.formula = '(差额20%)';
        } else {
          this.result.geshui.value = this.forms.total * 10000 * 0.01;
          this.result.geshui.formula = '(总价1%)';
        }
      }
    },
    computeType3: function () {
      // 契税
      this.computeType1();

      // 增值税
      if (this.forms.fangchanzheng == 0) {
        this.result.zengzhishui.value = this.forms.total * 10000 * 0.056;
        this.result.zengzhishui.formula = '(总价5.6%)';
      } else {
        if (this.forms.fapiao) {
          this.result.zengzhishui.value = (this.forms.total - this.forms.oldPrice) * 10000 * 0.056;
          this.result.zengzhishui.formula = '(差额5.6%)';
        } else {
          this.result.zengzhishui.value = this.forms.total * 10000 * 0.056;
          this.result.zengzhishui.formula = '(总价5.6%)';
        }
      }

      // 个税
      if (this.forms.fangchanzheng == 2 && this.forms.only) {
        this.result.geshui.value = 0;
        this.result.geshui.formula = '(免征)';
      } else {
        if (this.forms.fapiao) {
          this.result.geshui.value = (this.forms.total - this.forms.oldPrice) * 10000 * 0.2;
          this.result.geshui.formula = '(差额20%)';
        } else {
          this.result.geshui.value = this.forms.total * 10000 * 0.01;
          this.result.geshui.formula = '(总价1%)';
        }
      }
    },
    computeType4: function () {
      // 契税
      this.result.qishui.value = this.forms.total * 10000 * 0.03;

      if (this.forms.fapiao) {
        this.result.zengzhishui.value = (this.forms.total - this.forms.oldPrice) * 10000 * 0.056;
        this.result.zengzhishui.formula = '(差额5.6%)';
        this.result.geshui.value = (this.forms.total - this.forms.oldPrice) * 10000 * 0.2;
        this.result.geshui.formula = '(差额20%)';
        this.result.tudishui.value = '难以核算';
        this.result.tudishui.formula = '(公式复杂)';
        this.result.fangchanshui.value = '难以核算';
        this.result.fangchanshui.formula = '(公式复杂)';
      } else {
        this.result.zengzhishui.value = this.forms.total * 10000 * 0.056;
        this.result.zengzhishui.formula = '(总价5.6%)';
        this.result.geshui.value = this.forms.total * 10000 * 0.015;
        this.result.geshui.formula = '(总价1.5%)';
        this.result.tudishui.value = this.forms.total * 10000 * 0.05;
        this.result.tudishui.formula = '(总价5%)';
        this.result.fangchanshui.value = this.forms.oldPrice * 10000 * 0.7 * 0.012 * this.forms.fangchanzhengTime / 12;
        this.result.fangchanshui.formula = '(原发票价×70%×1.2%×月数/12)';
      }

      this.result.yinhuashui.value = this.forms.total * 10000 * 0.0005;
      this.result.shiyongshui.value = this.forms.area * 2;
    }
  }
});
