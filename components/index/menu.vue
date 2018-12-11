<template>
    <div class="m-menu">
      <dl class="nav" @mouseleave="leave">
        <dt>全部分类</dt>
        <dd
          v-for="(item, idx) in menu"
          :key="idx"
          @mouseenter="enter"
        >
          <i :class="item.type"/>{{item.name}}<span class="arrow"/>
        </dd>
      </dl>
      <div class="detail"
           v-if="kind"
           @mouseenter="sover"
           @mouseleave="sout">
        <div v-for="(item, index) in curDetail.child">
          <h4 :key="index">{{item.title}}</h4>
          <span
            v-for="v in item.child">
            {{v}}
          </span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "menu",
    data() {
      return {
        kind: '',
        menu: [
          {
            type: 'food',
            name: '美食',
            child: [{
              title: '美食',
              child: ['代金券','甜点饮品']
            }]
          },
          {
            type: 'takeout',
            name: '外卖',
            child: [{
              title: '外卖',
              child: ['美团外卖']
            }]
          },
          {
            type: 'hotel',
            name: '酒店',
            child: [{
              title: '酒店星级',
              child: ['代金券','甜点饮品']
            }]
          }
        ]
      }
    },
    computed: {
      curDetail() {
        return this.menu.filter((item) => item.type === this.kind)[0]
      }
    },
    methods: {
      leave() {
        this.timer = setTimeout(() => {
          this.kind = ''
        }, 150)
      },
      enter(e) {
        console.log(e.target.querySelector('i'))
        this.kind = e.target.querySelector('i').className
      },
      sover() {
        clearTimeout(this.timer)
      },
      sout() {
        this.kind = ''
      }
    }
  }
</script>

<style lang="css">

</style>
