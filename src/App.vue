<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
console.log(route);

const baseServer = "https://luoyisen.com";
const endPoint = "/shareserver";

const list = ref([]);

const routeStack = computed(() => {
  return route.path.split("/").filter((_) => !!_);
});

const getData = (
  url = `${baseServer}${(endPoint + route.path).replace("//", "/")}`
) => {
  console.log(url);
  fetch(url)
    .then((_) => _.json())
    .then((res) => {
      list.value = res;
    });
};

router.isReady().then(getData);
router.afterEach(() => getData());

const onclickItem = (item) => {
  switch (item.type) {
    case "directory":
      openDirectory(item);
      break;

    case "file":
      openFile(item);
      break;

    default:
      openFile(item);
      break;
  }
};

const openDirectory = (item) => {
  router.push(`${route.path}/${item.name}`.replace("//", "/"));
};

const backToDirectory = (idx) => {
  router.push(`/${routeStack.value.splice(0, idx + 1).join("/")}`);
};

const openFile = (item) => {
  const url = `${baseServer}${endPoint}${route.path}/${item.name}`;
  window.open(url);
};

const mode = ref(Number(localStorage.mode || 0) || 0);
const modeList = ["list", "grid"];
const changeMode = () => {
  mode.value += 1;
  mode.value %= modeList.length;
  localStorage.mode = mode.value;
};

const isImage = (name) => {
  return /\.jpg|\.jpeg|\.png|\.gif/i.test(name);
};

const tooltip = ref("");
const generateTooltip = (item) => {
  tooltip.value = `${item.name}
  ${item.size}
  ${item.mtime}`;
};
</script>

<template>
  <div class="page">
    <div class="tooltip">{{ tooltip }}</div>

    <div class="hd">
      <div class="routeStack">
        <span @click="backToDirectory(-1)">Root</span>
        <span
          v-for="(item, idx) in routeStack"
          :key="idx"
          @click="backToDirectory(idx)"
          >/{{ item }}</span
        >
      </div>

      <div class="modeIcon" :class="modeList[mode]" @click="changeMode"></div>
    </div>

    <div :class="modeList[mode]">
      <div
        class="item"
        :class="{ image: isImage(item.name) }"
        v-for="(item, idx) in list"
        :key="idx"
        @click="onclickItem(item)"
        @hover="generateTooltip(item)"
      >
        <img
          :src="`${baseServer}${endPoint}${route.path}/${item.name}`"
          alt=""
        />
        <div class="icon" :class="`${item.type}`"></div>
        <div class="name">{{ item.name }}</div>
        <div class="time">{{ item.mtime }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;

  .hd {
    width: 100%;
    height: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .routeStack {
      height: 100%;
      font-weight: bold;
      display: flex;
      align-items: center;
      span {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        &:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    .modeIcon {
      cursor: pointer;
      width: 1.5rem;
      height: 1.5rem;
      background-color: transparent;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      &.list {
        background-image: url("@/assets/imgs/list.png");
      }
      &.grid {
        background-image: url("@/assets/imgs/grid.png");
      }
    }
  }

  .list {
    width: 100%;
    height: calc(100% - 2.5rem);
    overflow: auto;
    .item {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-radius: 0.5rem;
      transform: scaleY(1);
      border: 1px solid transparent;
      transition: all linear 0.1s;
      &:hover {
        border: 1px solid #e6e6e6;
        transform: scaleY(1.01);
        box-shadow: 0 0 0.6rem 0.6rem #e6e6e609;
      }

      img {
        display: none;
      }
      .icon {
        width: 1rem;
        height: 1rem;
        margin-right: 1rem;
        background-position: center center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-color: transparent;

        &.file {
          background-image: url("@/assets/imgs/icon_file.png");
        }

        &.directory {
          background-image: url("@/assets/imgs/icon_directory.png");
        }
      }

      .name {
        margin-right: auto;
      }
    }
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    .item {
      cursor: pointer;
      width: 7rem;
      height: auto;
      margin-bottom: 0.5rem;
      img {
        display: none;
      }
      .icon {
        margin: 0 auto;
        width: 4rem;
        height: 4rem;
        background-position: center center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-color: transparent;

        &.file {
          background-image: url("@/assets/imgs/icon_file.png");
        }

        &.directory {
          background-image: url("@/assets/imgs/icon_directory.png");
        }
      }
      .name {
        width: 100%;
        padding: 0 0.2rem;
        box-sizing: border-box;
        word-break: break-all;
        text-align: center;

        display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
        -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
        text-overflow: ellipsis; /* 可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
        line-clamp: 3;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .time {
        display: none;
      }

      &.image {
        img {
          display: block;
          width: 4rem;
          margin: 0 auto;
        }
        .icon {
          display: none;
        }
      }
    }
  }
}
</style>
