<template>
  <div :class="['nav',{active:nav.hover,inactive:!nav.hover}]" @mouseleave='showNav(false)'>
    <div class="nav_l_c"></div>
    <div class="nav_l">
      <div class="sprite nav_l1"></div>
      <div class="sprite nav_l2"></div>
      <div class="sprite nav_vline"></div>
      <div class="sprite nav_border">
        <div class="bor_c">
          <div class="sprite nav_n1" @click="goNav('nav1')">nav1</div>
          <div class="sprite nav_n2" @click="goNav('nav2')">nav2</div>
        </div>
      </div>
    </div>
    <div class="nav_r_c"></div>
    <div class="nav_r">
      <div class="sprite nav_r1"></div>
      <div class="sprite nav_r2"></div>
      <div class="sprite nav_vline"></div>
      <div class="sprite nav_border">
        <div class="bor_c">
          <div class="sprite nav_n1" @click="goNav('nav3')">nav3</div>
          <div class="sprite nav_n2" @click="goNav('nav4')">nav4</div>
        </div>
      </div>
    </div>
    <div :class="['con',{active:!close,close:close}]" @click='openTip' @mouseenter='showNav(true)'>
      <div class="nav_c"></div>
      <div class="nav_c2"></div>
      <div class="nav_ring"></div>
      <div class="logo"></div>
      <div class="tip">
        <div class="txt">
          <span class="ani_dot">...</span>
        </div>
      </div>
      <div class="ani">
        <svg width="100%" height="100%">
          <g :transform="'translate('+cx+','+(cy-4)+')'">
            <circle :r='r' cx=0 cy=2 :fill="'rgba(0,169,184,'+opacity+')'"></circle>
            <path id="tri1" fill='#00C5D5' :d="triangles[0]"></path>
            <path id="tri2" fill='#00C5D5' :d="triangles[1]"></path>
            <path id="tri3" fill='#00C5D5' :d="triangles[2]"></path>
            <path id="tri4" fill='#00C5D5' :d="triangles[3]"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import css from '../css/c-nav.css';
import TWEEN from 'lib/tween';
import {
  mapGetters
} from 'vuex';
import store from '_vuex/store';
var d3 = Object.assign({}, require("d3-timer"));
export default {
  store,
  data: function() {
    return {
      cx: 0,
      cy: 0,
      r: 0, //切换中间圆状态后的半径
      cr: 60, //中间小圆半径
      opacity: 0,
      close: false, //切换中间圆状态
      triangles: { //四个三角形path
        0: '',
        1: '',
        2: '',
        3: '',
      },
    }
  },
  computed: mapGetters({
    nav: 'nav'
  }),
  created() {
    var width, height;
    width = height = 380;
    this.cx = width / 2;
    this.cy = height / 2;
    var r = this.cr;
    this.triangles[0] = getTriangle(r, 0);
    this.triangles[1] = getTriangle(r, 90);
    this.triangles[2] = getTriangle(r, 180);
    this.triangles[3] = getTriangle(r, 270);
  },
  mounted() {
    var _this = this;
    var d3t = d3.timer(() => {
      TWEEN.update();
      _this.nav.hide ? (d3t.stop(), TWEEN.removeAll()) : true;
    });
  },
  methods: {
    goNav(name) {
      // this.$router.push({
      //   path: name
      // });
    },
    showNav(flag) {
      this.$store.commit('ACTIVE', flag);
    },
    openTip() { //切换显示导航消息
      var _this = this;
      var cr = _this.cr;
      _this.opacity = 0.6;
      var isOpen = _this.close;
      var pag = isOpen ? -45 : 45; //切换状态后偏移角度
      var r1 = isOpen ? [cr, 0] : [0, cr];
      var r2 = isOpen ? [cr + 33, cr] : [0, cr + 33];
      var t1 = new TWEEN.Tween({
        r: r1[0]
      }).to({
        r: r1[1]
      }, 400).start();
      t1.onUpdate(function() {
        _this.r = this.r;
      });
      t1.onComplete(function() {
        _this.opacity = 0;
      });
      var t2 = new TWEEN.Tween({
        r: r2[0],
        t: 0
      }).to({
        r: r2[1],
        t: 1
      }, 400).start();
      t2.onUpdate(function() {
        var r = this.r;
        var p = pag * this.t;
        _this.triangles[0] = updateTriangle(cr, r, 0, p);
        _this.triangles[1] = updateTriangle(cr, r, 90, p);
        _this.triangles[2] = updateTriangle(cr, r, 180, p);
        _this.triangles[3] = updateTriangle(cr, r, 270, p);
      });
      t2.onComplete(function() {
        _this.close = !isOpen;
      });
    }
  }
}

function updateTriangle(cr, r, angle, t) {
  r = r || 0;
  angle = (angle + t) * Math.PI / 180;
  var gapAngle = (10 - r / cr) * Math.PI / 180; //弧线上的2个坐标间距
  return getTriPath(r, angle, gapAngle);
}

function getTriPath(r, angle, gapAngle) {
  var d1 = angle;
  var d2 = angle - gapAngle;
  var d3 = angle + gapAngle;
  var x1 = Math.cos(d1) * (r - 10);
  var y1 = Math.sin(d1) * (r - 10);
  var x2 = Math.cos(d2) * r;
  var y2 = Math.sin(d2) * r;
  var x3 = Math.cos(d3) * r;
  var y3 = Math.sin(d3) * r;
  return 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2 + 'L' + x3 + ',' + y3 + 'Z';
}

function getTriangle(r, angle) {
  r = r || 0;
  angle = angle * Math.PI / 180;
  var gapAngle = 10 * Math.PI / 180; //弧线上的2个坐标间距
  return getTriPath(r, angle, gapAngle);
}
</script>
