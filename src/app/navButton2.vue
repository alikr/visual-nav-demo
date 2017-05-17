<template>
  <svg :width='width' :height='height'>
    <defs>
      <mask id="maskLine" maskUnits="objectBoundingBox" x="0" y="0" :width="width*2" height="500">
        <path d='' fill="#fff"></path>
      </mask>
    </defs>
    <g :transform="translate">
      <g class='logos'>
        <image xlink:href="img/logo.png" x="-100" y="-100" width="200" height="200"></image>
      </g>
      <path :d='outArc' fill="rgba(0,236,255,0.4)"></path>
      <g class='dots' :transform='dotsRotate[0]._rotate'>
        <template v-for='item in dots'>
          <line :stroke='stroke' :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2"></line>
        </template>
      </g>
      <template v-for='item in arcs1'>
        <path :fill='stroke' :d="item.d" class='arc' :transform='item._rotate'></path>
      </template>
      <template v-for='item in arcs2'>
        <path fill='rgba(68,235,255,0.2)' :d="item.d" class='arc' :transform='item._rotate'></path>
      </template>
    </g>
    <g :transform="translate" class="out">
      <g>
        <template v-for='item in outDots'>
          <circle :fill='stroke' :cx="item.cx" :cy="item.cy" r='1'></circle>
        </template>
      </g>
      <g>
        <path fill='rgba(68,235,255,0.2)' :d="arcs3_line"></path>
        <path fill='rgba(68,235,255,0.2)' :d="arcs3.d"></path>
      </g>
      <g>
        <path fill='rgba(68,235,255,0.2)' :d="arcs4_line"></path>
        <path fill='rgba(68,235,255,0.2)' :d="arcs4.d"></path>
      </g>
      <g>
        <path fill='rgba(68,235,255,0.2)' :d="arcs5_line"></path>
        <path fill='rgba(68,235,255,0.2)' :d="arcs5.d"></path>
      </g>
      <g :transform="triangle1.transform">
        <path :fill='stroke' :d="triangle1.d"></path>
      </g>
      <g :transform="triangle2.transform">
        <path :fill='stroke' :d="triangle2.d"></path>
      </g>

      <g class="outline">
        <template v-for='(item, index) in outLines'>
          <path fill='none' :stroke="stroke" :d="item"></path>
        </template>
        <g mask="url(#maskLine)" class="maskLine">
          <template v-for='(item, index) in outLines'>
            <path fill='#ff0' stroke="none" :d="item"></path>
          </template>
        </g>

        <g transform="rotate(-70)" class="outLines2">
          <template v-for='(item, index) in outLines2'>
            <line :stroke='stroke' stroke-width="2"></line>
          </template>
        </g>
      </g>
      <g class="nav">
        <template v-for='(item, index) in navs'>
          <g :transform="item.translate">
            <g class="nav_rotate">
              <circle cx="0" cy="0" r='20' :fill='stroke' stroke='none'></circle>
              <path :d='item.d' fill-rule='evenodd' :fill='stroke' :stroke='stroke'></path>
            </g>
            <text x="0" y="0" dy="8" text-anchor='middle' fill='#fff' font-size="20px">{{index}}</text>
          </g>
        </template>
      </g>
    </g>
    <circle :cx="cx" :cy="cy" :r='r' fill='rgba(7,9,33,0.1)' :stroke='stroke'></circle>
    <circle :cx="cx" :cy="cy" :r='r+7' fill='none' :stroke='stroke'></circle>
    <circle :cx="cx" :cy="cy" :r='r+15' fill='none' :stroke='stroke' stroke-width=2></circle>
    <circle :cx="cx" :cy="cy" :r='r+25' fill='none' :stroke='stroke'></circle>
    <circle :cx="cx" :cy="cy" :r='r+35' fill='none' :stroke='stroke' stroke-width=3></circle>
  </svg>
</template>
<script>
import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';
Vue.use(Vuex);
export default {
  data: function() {
    return {
      width: 200, //svg宽度
      height: 200, //svg高度
      cx: 100, //中心坐标x
      cy: 100, //中心坐标y
      r: 100, //最小半径
      stroke: 'rgba(68,235,255,0.8)', //边框颜色
      dots: [], //里圈短线坐标
      dotsRotate: [{
        rotate: 0,
        step: this.getRandomStep(),
        _rotate: 'rotate(0)'
      }], //里圈短线旋转
      outDots: [], //外圈短线坐标
      outLines: [], //外圈长线坐标
      outLines2: [], //外圈长线坐标
      arcs1: [], //里圈小弧线
      arcs2: [], //里圈大弧线
      arcs3: {
        d: '',
        rotate: 0,
        step: this.getRandomStep()
      }, //外圈弧线1
      arcs4: {
        d: '',
        rotate: 0,
        step: this.getRandomStep()
      }, //外圈弧线2
      arcs5: {
        d: '',
        rotate: 0,
        step: this.getRandomStep()
      }, //外圈弧线3
      arcs3_line: '', //外圈弧线1的线
      arcs4_line: '', //外圈弧线2的线
      arcs5_line: '', //外圈弧线3的线
      translate: '', //平移到中心
      outArc: '', //外层宽弧线
      triangle1: {
        d: '',
        transform: '',
        x: 0,
        y: 0
      },
      triangle2: {
        d: '',
        transform: '',
        x: 0,
        y: 0
      },
      navs: [],
      areaPath: ''
    }
  },
  computed: Vuex.mapGetters({
    name: 'name'
  }),
  created() {
    var _this = this;
    var minr = this.r;
    var width = window.innerWidth;
    var height = window.innerHeight;
    _this.width = width;
    _this.height = height;
    var cx = _this.cx = width / 2;
    var cy = _this.cy = height / 2;
    _this.translate = 'translate(' + cx + ',' + cy + ')';
    _this.outArc = d3.arc()
      .innerRadius(minr + 15)
      .outerRadius(minr + 40)
      .startAngle(0)
      .endAngle(Math.PI * 2)();
    var arc = d3.arc();

    //里圈短线坐标
    var dots = 100;
    var dotsR = minr + 7;
    var dotr = 3;
    var angle = 360 / dots * Math.PI / 180;
    for (var i = 0; i < dots; i++) {
      var the = i * angle;
      var lr = dotsR + dotr;
      var sr = dotsR - dotr;
      var x1 = Math.cos(the) * sr;
      var y1 = Math.sin(the) * sr;
      var x2 = Math.cos(the) * lr;
      var y2 = Math.sin(the) * lr;
      _this.dots.push({
        x1,
        y1,
        x2,
        y2
      });
    };

    //外圈长线坐标
    var dots = 35;
    var dotsR = minr + 95;
    var dotr = 15;
    var angle = 85 / dots * Math.PI / 180;
    for (var i = 0; i < dots; i++) {
      var the = i * angle + Math.PI / 60;
      var lr = dotsR + dotr;
      var sr = dotsR - dotr;
      var x1 = Math.cos(the) * sr;
      var y1 = Math.sin(the) * sr;
      var x2 = Math.cos(the) * lr;
      var y2 = Math.sin(the) * lr;

      var stepAngle = Math.PI / 270;
      the += stepAngle;
      var x3 = Math.cos(the) * sr;
      var y3 = Math.sin(the) * sr;
      var x4 = Math.cos(the) * lr;
      var y4 = Math.sin(the) * lr;
      _this.outLines.push('M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2 + 'L' + x4 +
        ',' + y4 + 'L' + x3 + ',' + y3 + 'Z');
    };

    //最外圈长线坐标
    _this.updateOutLines2();

    //外圈小圆坐标
    var dots = 200;
    var dotsR = minr + 95;
    var angle = 360 / dots * Math.PI / 180;
    var lines = d3.range(dots);
    for (var i = 0; i < dots; i++) {
      var cx = Math.cos(i * angle) * dotsR;
      var cy = Math.sin(i * angle) * dotsR;
      _this.outDots.push({
        cx,
        cy
      });
    };

    //里圈小弧线
    var arcs1 = 4;
    var angle = Math.PI / 4;
    var gapAngle = Math.PI * 2 / arcs1 - angle;
    for (var i = 0; i < arcs1; i++) {
      var start = (angle + gapAngle) * i;
      var d = arc.innerRadius(minr + 30)
        .outerRadius(minr + 40)
        .startAngle(start)
        .endAngle(start + angle)();
      var step = _this.getRandomStep();
      _this.arcs1.push({
        d: d,
        rotate: 0,
        step: step,
        _rotate: 'rotate(0)'
      });
    }

    //里圈大弧线
    var arcs2 = 2;
    var angle = Math.PI / 2;
    var gapAngle = Math.PI * 2 / arcs2 - angle;
    for (var i = 0; i < arcs2; i++) {
      var start = (angle + gapAngle) * i;
      var d = arc.innerRadius(minr + 20)
        .outerRadius(minr + 40)
        .startAngle(start)
        .endAngle(start + angle)();
      var step = _this.getRandomStep();
      _this.arcs2.push({
        d: d,
        rotate: 0,
        step: step,
        _rotate: 'rotate(0)'
      });
    }

    //外圈弧线1
    var angle = Math.PI / 2;
    var start = 0;
    var innerRadius = minr + 85;
    var d = arc.innerRadius(innerRadius)
      .outerRadius(innerRadius + 20)
      .startAngle(start)
      .endAngle(start + angle)();
    _this.arcs3.d = d;
    _this.arcs3_line = arc.innerRadius(innerRadius + 20 + 6)
      .outerRadius(innerRadius + 20 + 8)
      .startAngle(start)
      .endAngle(start + angle)();

    //外圈弧线2
    var start = Math.PI;
    var innerRadius = minr + 80;
    var d = arc.innerRadius(innerRadius)
      .outerRadius(innerRadius + 20)
      .startAngle(start)
      .endAngle(start + angle)();
    _this.arcs4.d = d;

    _this.arcs4_line = arc.innerRadius(innerRadius + 20 + 6)
      .outerRadius(innerRadius + 20 + 8)
      .startAngle(start)
      .endAngle(start + angle)();

    //外圈弧线3
    var start = Math.PI;
    var innerRadius = minr + 64;
    var d = arc.innerRadius(innerRadius)
      .outerRadius(innerRadius + 20)
      .startAngle(0)
      .endAngle(0 + angle)();
    _this.arcs5.d = d;

    _this.arcs5_line = arc.innerRadius(innerRadius + 10)
      .outerRadius(innerRadius + 12)
      .startAngle(0 + Math.PI / 100)
      .endAngle(0 + angle - Math.PI / 100)();

    _this.triangle1 = _this.getRriangle(minr + 80, 13);
    _this.triangle2 = _this.getRriangle(minr + 80, 180);

    _this.setNav();
  },
  mounted() {
    var _this = this;
    var ro = 0;
    var dir = 1;
    //开始旋转
    startRotate();

    function startRotate() {
      requestAnimationFrame(startRotate);

      ro = ro + dir * 0.5;
      dir = ro >= 180 || ro <= 0 ? -dir : dir;
      var x = Math.cos(ro) * _this.r;
      var y = Math.sin(ro) * _this.r;
      _this.triangle1.x = x;
      _this.triangle1.y = y;
      var angle_d = (-ro) - 90;
      _this.triangle1.transform = 'rotate(' + angle_d + ')';
      _this.triangle2.transform = 'rotate(' + (-angle_d + 70) + ')';
      var rotates = [_this.arcs1, _this.arcs2, _this.dotsRotate];
      var lists = [];
      rotates.forEach(function(d, i) {
        d.forEach(function(v, j) {
          lists.push(v);
        });
      });
      lists.forEach(function(d, i) {
        var direction = i % 2 == 0 ? 1 : -1;
        var _rotate = d.rotate;
        var _step = d.step;
        d.rotate = _rotate < 360 ? _rotate + direction * _step : 0;
        d._rotate = 'rotate(' + d.rotate + ')';
      });
    }

    _this.setGauge();
    _this.setOutLines2();
  },
  methods: {
    getRandomStep() {
      return 0.5 + Math.random() * 0.5;
    },
    getRriangle(r, angle) {
      r = r || 0;
      angle = angle || 0;
      var d1 = angle;
      var d2 = angle - Math.PI / 50;
      var d3 = angle + Math.PI / 50;
      var x1 = Math.cos(d1) * (r - 20);
      var y1 = Math.sin(d1) * (r - 20);
      var x2 = Math.cos(d2) * r;
      var y2 = Math.sin(d2) * r;
      var x3 = Math.cos(d3) * r;
      var y3 = Math.sin(d3) * r;
      var angle_d = (angle - 90);
      var path = 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2 + 'L' + x3 + ',' + y3 + ',L' + x1 + ',' + y1 + 'Z';
      return {
        d: path,
        transform: 'translate(0,0)',
        x: 0,
        y: 0
      };
    },
    navCircle(index) {
      var arcs2 = 3;
      var minr = 30;
      var startAg = Math.PI / 3 * index;
      var angle = Math.PI / 3;
      var gapAngle = Math.PI * 2 / arcs2 - angle;
      var nav_arc = d3.arc().innerRadius(minr)
        .outerRadius(minr + 6)
        .startAngle(startAg)
        .endAngle(startAg + angle)() + d3.arc().innerRadius(minr)
        .outerRadius(minr + 6)
        .startAngle(startAg + angle + gapAngle)
        .endAngle(startAg + angle * 2 + gapAngle)() + d3.arc().innerRadius(minr)
        .outerRadius(minr + 6)
        .startAngle(startAg + angle * 2 + gapAngle * 2)
        .endAngle(startAg + angle * 3 + gapAngle * 2)();
      var nav_circle = d3.arc().innerRadius(minr - 2)
        .outerRadius(minr + 8)
        .startAngle(0)
        .endAngle(Math.PI * 2)();
      var r = this.r + 95;
      var the = Math.PI / 10 * index + Math.PI / 30 * index;
      var cx = -Math.cos(the) * r;
      var cy = -Math.sin(the) * r;
      return {
        d: nav_arc + nav_circle,
        translate: 'translate(' + cx + ',' + cy + ')'
      };
    },
    setNav() {
      for (var i = 1; i < 4; i++) {
        var nav = this.navCircle(i);
        this.navs.push(nav);
      }
    },
    setGauge() {
      var _this = this;
      var minr = _this.r;
      var data = [];
      var total = 20;
      var maxR = minr + 5;
      for (var i = 0; i <= total; i++) {
        data.push({
          x: i,
          y: (40 + Math.random() * maxR)
        });
      }
      var angle = d3.scaleLinear().domain([0, total]).range([0, Math.PI * 2]);
      var radius = d3.scaleLinear().domain([0, maxR]).range([0, maxR]);
      var line = d3.radialArea()
        .innerRadius(function(d) {
          return radius(d.y)
        })
        .outerRadius(function(d) {
          return radius(d.y + maxR)
        })
        .angle(function(d) {
          return angle(d.x)
        })
        .curve(d3.curveBasisClosed);
      var _preAreaPath = this.areaPath;
      var _currentAreaPath = this.areaPath = line(data);
      var svg = d3.select(_this.$el);
      svg.select('#maskLine path')
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attrTween('d', function(d, i) {
          var interpolate = d3.interpolate(_preAreaPath, _currentAreaPath);
          return function(t) {
            return interpolate(t);
          };
        })
        .on("end", function() {
          _this.setGauge();
        });
    },
    updateOutLines2(flag) {
      var _this = this;
      var minr = _this.r;
      var dots = 10;
      var dotsR = minr + 120;
      var angle = 60 / dots * Math.PI / 180;
      for (var i = 0; i < dots; i++) {
        var dotr = Math.random() * 80;
        var the = i * angle;
        var lr = dotsR + dotr;
        var sr = dotsR;
        var x1 = Math.cos(the) * sr;
        var y1 = Math.sin(the) * sr;
        var x2 = Math.cos(the) * lr;
        var y2 = Math.sin(the) * lr;
        var dashLen = 3 + Math.random() * 60;
        var dashGap = 10 + Math.random() * 20;
        var item = {
          x1,
          y1,
          x2,
          y2,
          dash: dashLen + ',' + dashGap
        };
        flag ? _this.outLines2[i] = item : _this.outLines2.push(item);
      };
    },
    setOutLines2() {
      var _this = this;
      var svg = d3.select(_this.$el);
      _this.updateOutLines2(true);
      var data = JSON.parse(JSON.stringify(_this.outLines2));
      var lines = svg.selectAll('.outLines2 line');
      lines
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attrTween('stroke-dasharray', function(d, i) {
          var _p = d3.select(this).attr('stroke-dasharray');
          var _v = data[i];
          var interpolate = d3.interpolate(_p, _v.dash);
          return function(t) {
            return interpolate(t);
          };
        })
        .attrTween('x1', function(d, i) {
          var _p = +(d3.select(this).attr('x1') || 0);
          var _v = data[i];
          var interpolate = d3.interpolate(_p, _v.x1);
          return function(t) {
            return interpolate(t);
          };
        })
        .attrTween('x2', function(d, i) {
          var _p = +(d3.select(this).attr('x2') || 0);
          var _v = data[i];
          var interpolate = d3.interpolate(_p, _v.x2);
          return function(t) {
            return interpolate(t);
          };
        })
        .attrTween('y1', function(d, i) {
          var _p = +(d3.select(this).attr('y1') || 0);
          var _v = data[i];
          var interpolate = d3.interpolate(_p, _v.y1);
          return function(t) {
            return interpolate(t);
          };
        })
        .attrTween('y2', function(d, i) {
          var _p = +(d3.select(this).attr('y2') || 0);
          var _v = data[i];
          var interpolate = d3.interpolate(_p, _v.y2);
          return function(t) {
            return interpolate(t);
          };
        })
        .on("end", function() {
          _this.setOutLines2();
        });
    }
  }
}
</script>
<style lang="css">
.logos {
  background: url(../resources/img/logo.png);
}
</style>
