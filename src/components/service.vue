<template>
    <div>
        <iscroll-view class="scroll-view" ref="iscroll" id="test">
            <div class="chartBox">
                <component :is="item.resultType" :talk="item" :gameStart="gameStart" @toAi="sayToAI" v-for="item in items" :key="item.id"></component>
            </div>
        </iscroll-view>
        <div class="input_box" id="inputBox">
            <!-- <i class="fl img keyboard" id="js_key_voice"></i> -->
            <input type="text" class="text" v-model="myWord">
            <button class="send-btn fr" id="js_send" @click="send">发送</button>
        </div>
        <game ref="myGame" :talk="talk" :gameEnd="gameEnd"></game>
    </div>
</template>

<script>
import iSay from "./dialog/iSay";
import game from "./dialog/game";
import tp001 from "./dialog/reply";
export default {
    components: {
        iSay,
        game,
        tp001
    },
    data() {
        return {
            items: [],
            myWord: "",
            iscroll: null
        };
    },
    methods: {
        talk(type) {
            var sendData = {
                eventType: type,
                content: "",
                note: "",
                needManual: "",
                userId: ""
            };

            this.$public.getApi(sendData).then(res => {
                if (res.data.resultCode !== "qas001") {
                    this.sayError();
                    return false;
                }
                this.items.push(res.data);
            });
            // this.items.push(res);
            this.toBottom();
        },
        send() {
            if (this.myWord === "") {
                return;
            }
            this.sayToAI(this.myWord, "normal");

            this.myWord = "";
        },
        sayToAI(word, type, status) {
            var sendData = {
                eventType: type,
                content: word,
                note: "",
                needManual: "",
                userId: "",
                feedback: status //解决，未解决时才有
            };
            this.$public.getApi(sendData).then(res => {
                if (res.data.resultCode !== "qas001") {
                    this.sayError();
                    return false;
                }
                this.items.push(res.data);
                this.toBottom();
            });
            if (status == 0) {
                word = "未解决";
            } else if (status == 1) {
                word = "解决";
            }

            this.items.push({
                resultType: "iSay",
                sentence: word
            });
            this.toBottom();
        },
        toBottom() {
            setTimeout(() => {
                this.iscroll.refresh();
                let scrollHeight = document.getElementById("test").children[0]
                    .clientHeight;
                let windowHeight = window.innerHeight;
                if (scrollHeight > windowHeight) {
                    this.iscroll.scrollTo(0, windowHeight - scrollHeight, 500);
                }
            }, 500);
        },
        gameStart() {
            var sendData = {
                eventType: "game",
                content: "get_anti_fake_sign",
                note: "",
                needManual: "",
                userId: ""
            };
            this.$public.getApi(sendData).then(res => {
                if (res.data.resultCode !== "qas001") {
                    this.sayError();
                    return false;
                }
                this.$refs.myGame.gameStart(
                    res.data.resultContent.content.data
                );
            });
            //游戏开始

            return;
        },
        gameEnd(score, fakeSign) {
            var sendData = {
                eventType: "game",
                content: "get_smart_game_result_by_score",
                note: "",
                needManual: "",
                userId: "",
                feedback: JSON.stringify({
                    score: score + "",
                    fakeSign: fakeSign
                })
            };
            this.$public.getApi(sendData).then(res => {
                if (res.data.resultCode !== "qas001") {
                    this.sayError();
                    return false;
                }
                this.items.push(res.data);
                this.toBottom();
            });
        },
        sayError() {
            this.items.push({
                text: "象宝正常学习中，请稍后再试",
                resultCode: "qas001",
                resultType: "tp001",
                businessType: {},
                resultContent: {
                    title: "象宝正常学习中，请稍后再试",
                    content: ""
                },
                refContent: "",
                investContent: "",
                created_at: "",
                occurrence: 1,
                resource: "",
                sessionId: "",
                adapters: "",
                specialTypeId: "",
                note: ""
            });
            this.toBottom();
        },
        pageInit() {
            this.talk("initial");
        }
    },
    mounted() {
        this.iscroll = this.$refs.iscroll;
        this.$public.setPageInit(this.talk);
        this.$public.pageInit("initial");
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" soped>
@import "../assets/talk";
</style>
