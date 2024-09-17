<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ info }}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      info: null,
    }
  },
  created () {
    axios
      .get('http://[localhost:3001]/posts')
      .then(response => (this.info = response))
  }
}
</script>
