<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  autoindex_server as baseServer,
  autoindex_endpoint as endPoint,
} from "../RouterConfig.json";

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const list = ref([]);

const spliceUri = () => {
  return `${baseServer}${(endPoint + route.path).replace("//", "/")}`;
};

const routeStack = computed(() => {
  return route.path.split("/").filter((_) => !!_);
});

const vhistory = ref({});
const updateHistory = () => {
  vhistory.value = window.history;
};

const getData = (uri = spliceUri()) => {
  loading.value = true;
  fetch(uri)
    .then((_) => _.json())
    .then((res) => {
      list.value = res.map((_) => {
        const obj = {
          ..._,
          uri: `${uri}/${_.name}`,
          isImage: isImage(_.name),
          isMP4: isMP4(_.name),
        };
        return obj;
      });
      updateHistory();
    })
    .finally(() => (loading.value = false));
};

// router.isReady().then(getData);
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
  window.open(item.uri);
};

const mode = ref(
  window.innerWidth < 500 ? 1 : Number(localStorage.mode || 0) || 0
);
const modeList = ["list", "grid"];
const changeMode = () => {
  mode.value += 1;
  mode.value %= modeList.length;
  localStorage.mode = mode.value;
};

const isImage = (name) => {
  return /\.jpg|\.jpeg|\.png|\.gif|\.svg|\.webp/i.test(name);
};

const isMP4 = (name) => {
  return /\.mp4/i.test(name);
};
</script>

<template>
  <div class="page">
    <Transition>
      <div v-show="loading" class="loading">加载中...</div>
    </Transition>

    <div class="total">共{{ list.length }}项</div>

    <div class="hd">
      <div class="routeD">
        <div
          class="icon back"
          :class="{ disabled: !vhistory.state?.back }"
          @click="router.back"
        ></div>
        <div
          class="icon forward"
          :class="{ disabled: !vhistory.state?.forward }"
          @click="router.forward"
        ></div>
        <div class="icon refresh" @click="router.go(0)"></div>
      </div>
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
        v-for="(item, idx) in list"
        :key="idx"
        @click="onclickItem(item)"
      >
        <img v-if="mode == 1 && item.isImage" :src="item.uri" alt="" />
        <video
          v-else-if="mode == 1 && item.isMP4"
          :src="item.uri"
          :autoplay="false"
          :controls="false"
        ></video>
        <div v-else class="icon" :class="`${item.type}`"></div>
        <div class="name">{{ item.name }}</div>
        <div class="time">{{ item.mtime }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  user-select: none;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #333;
  color: #e6e6e6;

  .loading {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .total {
    position: fixed;
    right: 0.1rem;
    bottom: 0.1rem;
    font-size: 0.8rem;
  }

  .hd {
    width: 100%;
    height: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .routeD {
      margin-right: 1rem;
      display: flex;
      .icon {
        cursor: pointer;
        width: 1rem;
        height: 1rem;

        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
        &.back {
          margin-right: 0.5rem;
          background-image: url("@/assets/imgs/back.png");
        }
        &.forward {
          background-image: url("@/assets/imgs/back.png");
          margin-right: 0.5rem;
          transform: rotateZ(180deg);
        }
        &.refresh {
          background-image: url("@/assets/imgs/refresh.png");
        }
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
    .routeStack {
      margin-right: auto;
      font-weight: bold;
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
    justify-content: flex-start;
    align-content: flex-start;
    width: 100%;
    height: calc(100% - 2.5rem);
    overflow: auto;
    .item {
      flex-grow: 0;
      flex-shrink: 0;
      cursor: pointer;
      width: 7rem;
      height: auto;
      margin-bottom: 0.5rem;

      img,
      video {
        display: block;
        width: 4rem;
        margin: 0 auto;
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
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
