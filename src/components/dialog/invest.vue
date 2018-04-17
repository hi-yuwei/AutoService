<template>
    <!-- 投资标的 -->
    <div class="chart_left clearfix">
        <div class="invest content">
            <p class="invest-recommend">
                <i class="recommed-line recommed-line_left"></i>
                <span class="recommend-txt">为您推荐</span>
                <i class="recommed-line recommed-line_right"></i>
            </p>
            <h2 class="invest-title">
                <template v-for="(item,index) in talk.tagList">
                    <span class="title-tag tag-yellow">{{item.listLabel}}</span>
                </template>
                <!-- 散标&&允许新手 -->
                <span class="title-tag tag-yellow" v-if="talk.isLimitBeginner&&talk.subjectType=='borrow'">新手专享</span>
                <!-- 散标&&有返年化 -->
                <span class="title-tag tag-blue" v-if="talk.rewardRate&&talk.subjectType=='borrow'">满标返年化{{talk.rewardRate}}%</span>
                <!-- 债权 -->
                <span class="title-tag tag-blue" v-if="talk.subjectType=='bond'">债权转让</span>
                <!-- 月月丰&&允许用红包 -->
                <span class="title-tag tag-yellow" v-if="talk.isUseBonus&&talk.subjectType=='fina'">可用红包</span>{{talk.title}}</h2>
            <div class="invest-info clearfix">
                <div class="info-rate">
                    <span class="rate-moeny">{{talk.loanRate | formatMoeny}}
                        <i>%</i>
                    </span>
                    <span v-if="talk.subsidyRate" class="subsidy-rate">+{{talk.subsidyRate | formatMoeny}}%</span><br/>
                    <span>历史年化利率</span>
                </div>
                <div class="info-day">
                    <span class="day-num">期限{{talk.cycle}}{{talk.cycleType}}</span><br/>
                    <span>可投:3844.00元</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// alreadyAmount: 113047,
// amount: 200000,
// borrowId: 90184,
// cycle: 180,
// cycleType: "天",
// id: 90184,
// isLimitBeginner: 0,
// isUseBonus: 1,
// loanRate: "9.5",
// number: 0,
// rewardRate: 1,
// tagList:[{detailLabel:'1',listLabel:'哈哈哈'}],
// resultType:type,
// status: 'process',
// subjectType: 'borrow',
// subsidyRate: 1,
// title: "【女神节】专项活动的活动大活的的"
export default {
  components: {},
  props: ["talk"],
  data() {
    return {};
  },
  beforeCreate() {},
  methods: {},
  mounted() {},
  filters: {
    formatMoeny: function(value) {
      if (isNaN(value)) {
        return 0;
      } else {
        return Number(value).toFixed(2);
      }
    }
  },
  created() {}
};
</script>
<style lang="scss">
@import "../../assets/public";

.invest {
  padding-top: px2rem(40) !important;
  width: 100%;
  .invest-recommend {
    font-size: 0;
    color: $ft-2d4;
    text-align: center;
    vertical-align: middle;
    .recommend-txt {
      position: relative;
      display: inline-block;
      width: 28%;
      font-size: px2rem(24);
      vertical-align: middle;
      &::before {
        content: "";
        position: absolute;
        top: -40%;
        left: 50%;
        width: px2rem(40);
        height: px2rem(24);
        background: url("../../assets/images/shopping_crown.png") no-repeat
          center;
        background-size: 100%;
        @include transform(translateX(-50%));
      }
    }
    .recommed-line {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      width: 36%;
      height: px2rem(6);
      background: $ft-2d4;
      &::before {
        content: "";
        position: absolute;
        width: px2rem(10);
        height: px2rem(10);
        background: $ft-2d4;
        @include transform(rotate(45deg) translateY(-50%));
      }
    }
    .recommed-line_left {
      left: 0;
    }
    .recommed-line_left::before {
      top: 50%;
      right: -2%;
    }
    .recommed-line_right::before {
      top: 50%;
      left: -2%;
    }
  }
  .invest-title {
    padding: px2rem(40) 0;
    font-size: px2rem(30);
    color: $ft-333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .title-tag {
      margin-right: 2%;
      height: px2rem(32);
      padding: px2rem(4) px2rem(10);
      font-size: px2rem(24);
      vertical-align: text-bottom;
      @include border-radius(px2rem(16));
      border-bottom-right-radius: 0px;
    }
    .tag-yellow {
      background-color: $ft-ffd;
    }
    .tag-blue {
      background-color: $ft-c3d;
    }
  }
  .invest-info {
    font-size: 0;
    color: $ft-999;
    .info-rate {
      display: inline-block;
      width: 50%;
      font-size: px2rem(12);
      .rate-moeny {
        font-size: px2rem(72);
        color: $ft-fc3;
        > i {
          font-size: px2rem(14);
          font-style: normal;
        }
      }
      .subsidy-rate {
        font-size: px2rem(28);
        color: $ft-fc3;
      }
    }
    .info-day {
      display: inline-block;
      width: 50%;
      font-size: px2rem(12);
      text-align: right;
      .day-num {
        color: $ft-333;
      }
    }
  }
}
</style>
