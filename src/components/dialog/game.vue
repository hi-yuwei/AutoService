<template>
    <div>
        <div class="pk"></div>
        <div class="pk-toast"></div>
        <div class="pk-time">
            <div class="pk-count" >
                {{countNum}}
            </div>
        </div>
        <div class="pk-score">
            <div class="score-box">
                {{score}}
            </div>
        </div>
    </div>
</template>

<script>
import jqueryeasing from "../../../static/jquery.easing.min.js"
export default {
    props:["talk","gameEnd"],
    data() {
        return {
            screenH: document.body.offsetHeight,
            screenW: document.body.offsetWidth,
            RX: document.body.offsetWidth - 70,
            RY: document.body.offsetHeight - 70,
            TIMER: "",
            TIMERCLOCK: "",
            speed: "",
            x: "",
            y: "",
            countNum: 4,
            score: 0,
            options: {
                allReds: 10,//总下落红包个数
                scoreList: [1, 2, 3, 4, 50, -10],//分数
                chanceList: [50, 25, 10, 5, 1, 9],//概率
                fakeSign:""//单次游戏签名
            }
        };
    },
    beforeCreate() {},
    methods: {
        init() {
            // 初始化
            this.bindDom();
        },
        randomNum(begin, end) {
            // 范围随机数生成器
            return Math.floor(Math.random() * (end - begin)) + begin;
        },
        //概率模型 返回
        random() {
            var arr2 = this.options.chanceList;
            var sum = 0,
                factor = 0,
                random = Math.random();

            for (var i = arr2.length - 1; i >= 0; i--) {
                sum += arr2[i]; // 统计概率总和
            }
            random *= sum; // 生成概率随机数
            for (var i = arr2.length - 1; i >= 0; i--) {
                factor += arr2[i];
                if (random <= factor) return i;
            }
            return 0;
        },
        eases() {
            // 红包运动模式 
            var easeNum = parseInt(this.randomNum(0, 5));
            switch (easeNum) {
                case 0:
                    return "easeInQuad";
                    break;
                case 1:
                    return "swing";
                    break;
                case 2:
                    return "easeInExpo";
                    break;
                case 3:
                    return "easeInQuint";
                    break;
                case 4:
                    return "easeInOutBounce";
                    break;
            }
        },
        theme(num) {
            // 红包皮肤
            switch (num) {
                case 0:
                    return "pk1";
                    break;
                case 1:
                    return "pk2";
                    break;
                case 2:
                    return "pk3";
                    break;
                case 3:
                    return "pk4";
                    break;
                case 4:
                    return "pk5";
                    break;
                case 5:
                    return "bo";
                    break;
                default:
                    return "bo";
            }
        },
        recordScore(scoreTouch) {
            // this.score += this.scoreList[scoreTouch]
            this.score += parseInt(scoreTouch);
        },
        bindDom() {
            this.x = parseInt(this.randomNum(0, this.RX)); // 红包起始x坐标
            this.y = parseInt(this.randomNum(70, 300)); // 红包起始y坐标
            this.speed = this.randomNum(3000, 5000); // 红包运动总时长

            var lock = this.random();
            var _key = this.luck_key;
            var luck = this.theme(lock);
            var score = this.options.scoreList[lock];
            // this.recordScore(score)
            var pkDom = $(
                '<div class="pk ' +
                    luck +
                    '" data-score="' +
                    score +
                    '"' +
                    "></div>"
            );
            pkDom.css({ left: this.x + "px", top: "-" + this.y + "px" });
            pkDom.animate({ top: this.RY }, this.speed, this.eases(), () => {
                $(pkDom).remove();
            });
            pkDom.on("touchstart", e => {
                $(pkDom).addClass("boom");
                setTimeout(
                    () => {
                        this.recordScore($(pkDom)[0].dataset.score);
                        $(pkDom).remove();
                    },
                    // .bind(this)
                    200
                );
            });
            $("body").append(pkDom);
        },
        start(alltime, amount) {
            var time = 0;
            alltime ? (alltime = alltime) : (alltime = 30000);
            amount ? (amount = amount) : (amount = 50);
            var intervalTime = parseInt(alltime / amount);
            this.TIMER = setInterval(() => {
                time++;
                if (time > amount) {
                    this.stop();
                }
                this.init();
            }, intervalTime);
        },
        stop() {
            clearInterval(this.TIMER);
            clearInterval(this.TIMERCLOCK);
            window.setTimeout(() => {
                this.showScore();

                $(".pk-score").on("touchstart", (e) => {
                    e.preventDefault();
                    this.cleanScore();
                });
                $(".pk-toast").on("touchstart", (e) => {
                    e.preventDefault();
                    this.cleanScore();
                });

                $(".pk").remove();
            }, 5000);
        },
        showScore() {
            $(".pk-toast").css("display", "block");
            if (this.score < 0) {
                this.score = 0;
            }
            var tempScore = (this.score + "").split("");
            // var tempScore = "100".split("")
            $(".score-box").html(this.score)
            $(".pk-score").css("display", "block");
        },
        cleanScore() {
            this.gameEnd(this.score,this.options.fakeSign)
            // this.callBackFun(this.score);
            $(".pk-toast").off("touchstart");
            $(".pk-score").off("touchstart");
            $(".pk-toast").css("display", "none");
            $(".pk-time").css("display", "none");
            $(".pk-score").css("display", "none");
            $(".score-box").html("");
        },
        gameStart(options) {
            if(options){
                this.options = options
            }
            $(".pk-toast").css("display", "block");
            $(".pk-time").css("display", "block");
            if (this.countNum < 4) {
                $(".pk-count").css("display", "block");
                if (this.countNum < 1) {
                    this.score = 0;
                    this.start(20000, this.options.allReds);
                    $(".pk-count").css("display", "none");
                    this.countNum = 4;
                    return;
                }
            }
            this.countNum--;
            window.setTimeout(() => {
                this.gameStart();
            }, 1000);
        }
    },
    mounted() {
        // this.gameStart();
        
    },
    created() {}
};
</script>
<style lang="scss">
// @import "../../assets/talk";
</style>
