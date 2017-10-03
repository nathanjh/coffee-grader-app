<template lang="html">
  <a :href="`${baseURL}auth/${authProvider}?origin=${authOriginURL}&hashmode=${hashMode}`">
    <div id="auth-button" :style="backgroundStyle">
      <span class="icon" :style="iconStyle"></span>
      <span class="button-text" :style="textStyle">
        <slot></slot>
      </span>
    </div>
  </a>
</template>

<script>
import router from '../../router'

export default {
  props: {
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    authProvider: {
      type: String,
      required: true
    },
    providerIcon: {
      type: String,
      required: true
    },
    baseURL: {
      type: String,
      required: true
    }
  },
  computed: {
    backgroundStyle () {
      return {
        background: this.bgColor
      }
    },
    textStyle () {
      return {
        color: this.textColor
      }
    },
    iconStyle () {
      return {
        background: `no-repeat center/110% url(${this.providerIcon})`
      }
    },
    authOriginURL () {
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8080/'
      }
    },
    hashMode () {
      return router.mode === 'hash'
    }
  }
}
</script>

<style lang="css">
  #auth-button {
    display: inline-block;
    background: white;
    color: #444;
    width: 190px;
    border-radius: 2px;
    /*border: thin solid #888;*/
    white-space: nowrap;
  }
  #auth-button:hover {
    box-shadow: 0 2px 28px rgba(0,0,0,0.25), 0 2px 10px rgba(0,0,0,0.22);
    cursor: pointer;
  }
  #auth-button:active {
    box-shadow: inset 0 0 0 32px rgba(0,0,0,0.1);
  }
  span.label {
    font-family: serif;
    font-weight: normal;
  }
  span.icon {
    display: inline-block;
    vertical-align: middle;
    width: 42px;
    height: 42px;
  }
  span.button-text {
    display: inline-block;
    vertical-align: middle;
    padding-left: 6px;
    font-size: 15px;
    font-weight: bold;
  }
</style>
