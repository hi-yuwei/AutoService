<template>
    <div>
        <!-- 问题 -->
        <div class="chart_left clearfix">
            <div class="reply content  animated bounceInLeft width-100 " :class="{'w-85':(talk.type=='initial'||!talk.refContent)}">
                <p class="reply-content" v-html="talk.resultContent.title?talk.resultContent.title:talk.refContent.title"></p>
                <div class="reply-item" v-if="talk.type!=='initial'">
                    <div v-for="item in talk.refContent.content">
                        <p class="reply-content">{{item.contentTitle}}</p>
                        <button class="item-content" v-for="list in item.menuList" @click="clickMenu(list.menuContent,list.menuLink,'click')">
                            <div class="item-content_left" @touchstart.stop="clickMenu(list.menuContent,list.menuLink,'touch')"  :class="{'w-100':!list.menuTitle}">{{list.menuContent}}</div>
                            <div class="item_content_right" v-if="list.menuTitle">{{list.menuTitle}}</div>
                        </button>
                    </div>
                </div>
                <div class="reply-feedback" v-if="talk.type!=='initial'&&talk.businessType.solve">
                    <span class="feedback-txt">答案是否解决您的问题？</span>
                    <button class="feedback-btn" @click="feedback(talk.lastProblem,0)" :class="{'is-click':isClisk}">未解决</button>
                    <button class="feedback-btn btn-resolve" @click="feedback(talk.lastProblem,1)" :class="{'is-click':isClisk}">解决</button>
                </div>
                <div class="reply-feedback t_r" v-if="talk.type!=='initial'&&talk.businessType.join">
                    <span class="feedback-txt"></span>
                    <button class="feedback-btn btn-resolve" @click="gameStart()">参加</button>
                </div>
            </div>
        </div>
        <!-- 菜单 -->
        <!-- 初始状态&&有值 -->
        <div class="chart_left clearfix" v-if="talk.type=='initial'&&talk.resultContent">
            <div class="column content animated bounceInLeft">
                <template v-for="item in talk.resultContent.content">
                    <button @click="clickMenu(item.name,null,'click')" :style="'background:url(./static/imgs/'+item.type+'.png); background-repeat: no-repeat;background-position: 50% 20%;background-size:30px;background-color:white'"><br/>{{item.name}}</button>
                </template>
            </div>
        </div>
        <!-- 投资 -->
        <div class="chart_left clearfix" v-if="talk.investContent">
            <div class="invest content animated bounceInLeft">
                <p class="reply-content">{{talk.investContent.title}}</p>
            </div>
            <div class="invest content invest-project animated bounceInLeft">
                <p class="invest-recommend">
                    <i class="recommed-line recommed-line_left"></i>
                    <span class="recommend-txt">为您推荐</span>
                    <i class="recommed-line recommed-line_right"></i>
                </p>
                <template v-for="item in talk.investContent.content">
                    <div @click="getInvestUrl(item.data.id,item.type)" class="invest-item">
                        <h2 class="invest-title">
                            <template v-for="(item,index) in item.data.tagList">
                                <span class="title-tag tag-yellow">{{item.listLabel}}</span>
                            </template>
                            <!-- 散标&&允许新手 -->
                            <span class="title-tag tag-yellow" v-if="item.data.isLimitBeginner&&item.type=='borrow'">新手专享</span>
                            <!-- 散标&&有返年化 -->
                            <span class="title-tag tag-blue" v-if="item.data.rewardRate&&item.type=='borrow'">满标返年化{{talk.rewardRate}}%</span>
                            <!-- 债权 -->
                            <span class="title-tag tag-blue" v-if="item.type=='bond'">债权转让</span>
                            <!-- 月月丰&&允许用红包 -->
                            <span class="title-tag tag-yellow" v-if="item.data.isUseBonus&&item.type=='fina'">可用红包</span>{{item.data.title}}</h2>
                        <div class="invest-info clearfix" v-show="item.type=='borrow'">
                            <div class="info-rate">
                                <span class="rate-moeny">{{item.data.loanRate | formatMoeny}}<i>%</i></span>
                                <span v-if="item.data.subsidyRate" class="subsidy-rate">+{{item.data.subsidyRate | formatMoeny}}%</span><br/>
                                <span>历史年化收益率</span>
                            </div>
                            <div class="info-day">
                                <span class="day-num">期限{{item.data.cycle}}{{item.data.cycleType}}</span><br/>
                                <span>可投:{{item.data.surplusAmount| formatMoeny}}元</span>
                            </div>
                        </div>
                        <div class="invest-info clearfix" v-show="item.type=='fina'">
                            <div class="info-rate">
                                <span class="rate-moeny">{{item.data.yearRate | formatMoeny}}<i>%</i></span>
                                <span v-if="item.data.subsidyRate" class="subsidy-rate">+{{item.data.subsidyRate | formatMoeny}}%</span><br/>
                                <span>历史年化收益率</span>
                            </div>
                            <div class="info-day">
                                <span class="day-num">期限{{item.data.cycleNew}}{{item.data.cycleTypeShow}}</span><br/>
                                <span>可投:{{item.data.surplusAmount| formatMoeny}}元</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

</template>

<script>
export default {
  components: {},
  props: ["talk", "gameStart"],
  data() {
    return {
      isClisk: false,
      clickFlag:false
    };
  },
  beforeCreate() {},
  methods: {
    clickMenu: function(txt, href,from) {      
      if(from=="touch"){
         this.clickFlag=true
      }else{
        if(this.clickFlag){
          this.clickFlag=false
          return
        }
      }
      //点击菜单
      if (href) {
        location.href = href;
        return false;
      }
      this.$emit("toAi", txt, "normal");
    },
    feedback(txt, status) {
      //解决、未解决&&参加、放弃
      this.isClisk = true;
      this.$emit("toAi", txt, "feedback", status);
    },
    getInvestUrl(id, type) {
      //获取标的链接
      var investType = type == "borrow" ? "invest" : type;
      if (Number(this.$public.isApp()) < 3) {
        window.location.href = 
          "baoxiang://APPProjectInvesting?investId=" +
          id +
          "&type=" +
          investType
        ;
      } else {
        window.location.href = "//m.bxjr.com/lc/" + investType + "/detail/" + id + ".html";
      }
    }
  },
  mounted() {},
  created() {},
  filters: {
    formatMoeny: function(value) {
      if (isNaN(value)) {
        return 0;
      } else {
        return Number(value).toFixed(2);
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/public";
.w-85 {
  max-width: 85%!important;
}
.width-100 {
  width: 100%!important;
}
.is-click {
}
.reply {
  .w-100 {
    width: 100% !important;
    font-size: px2rem(30) !important;
  }
  .reply-content {
    padding-bottom: 1.5%;
    a {
      color: $ft-2d4;
    }
  }
  .item-content {
    position: relative;
    display: table;
    table-layout: fixed;
    width: 100%;
    padding: 7% px2rem(54) 7% 0;
    line-height: 1.4;
    vertical-align: middle;
    font-size: 0;
    color: $ft-2d4;
    border-top: 1px solid $ft-e1e;
    .item-content_left {
      // display: table-cell;
      // width: 65%;
          text-align: left;
      padding-right: 5%;
      font-size: px2rem(14);
      vertical-align: middle;
      height: 0;
      line-height: 0;
    }
    .item_content_right {
      display: table-cell;
      width: 35%;
      font-size: px2rem(14);
      color: $ft-2d4;
      text-align: right;
      vertical-align: middle;
    }
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      right: px2rem(20);
      width: px2rem(20);
      height: px2rem(20);
      border-top: 1px solid $ft-e1e;
      border-right: 1px solid $ft-e1e;
      @include transform(rotate(45deg) translateY(-50%));
    }
  }
  .reply-feedback {
    padding: 2% px2rem(54) 2% 0;
    line-height: px2rem(46);
    font-size: 0;
    border-top: 1px solid $ft-e1e;
    .feedback-txt {
      display: inline-block;
      width: 60%;
      font-size: px2rem(24);
      color: $ft-999;
    }
    .feedback-btn {
      display: inline-block;
      width: 20%;
      line-height: px2rem(46);
      font-size: px2rem(24);
      color: $ft-2d4;
      background: transparent;
      outline: none;
      border: 1px solid $ft-2d4;
    }
    .btn-resolve {
      background: $ft-2d4;
      color: $bg-white;
    }
    .is-click {
      color: $ft-999;
      border-color: $ft-999;
      pointer-events: none;
    }
    .btn-resolve.is-click {
      background: $ft-999;
      color: $bg-white;
    }
  }
}

.column {
  width: 100%;
  background: transparent !important;
  &.content {
    padding-left: 0;
    padding-right: 0;
  }
  & > button {
    float: left;
    border: none;
    width: 28%;
    margin-top: 5%;
    padding: 9% 2% 5% 2%;
    font-size: px2rem(24);
    color: $ft-2d4;
    text-align: center;
    background: $bg-white;
    @include border-radius(4px);
    .column-img {
      width: 30% !important;
      margin-bottom: 4%;
    }
  }
  & > button:not(:nth-child(3n)) {
    margin-right: 8%;
  }
}

.invest {
  &.invest-project {
    width: 100%;
    padding: px2rem(40) 0 0;
  }
  width: 85%;
  float: none !important;
  margin-top: 5%;
  .invest-item {
    display: block;
    padding: 0 1rem;
  }
  .invest-item:not(:last-child) .invest-info {
    border-bottom: 1px solid $ft-e1e;
  }
  .invest-recommend {
    padding: 0 1rem;
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
    padding-bottom: px2rem(20);
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
