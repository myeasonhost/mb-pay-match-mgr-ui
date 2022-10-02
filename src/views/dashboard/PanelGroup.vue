<template>
  <div>
    <MerchantStatis ref="MerchantStatis" v-if="is_show === 1"></MerchantStatis>
    <ManageStatis ref="ManageStatis" v-if="is_show === 2"></ManageStatis>
  </div>
</template>

<script>
  import MerchantStatis from './MerchantStatis'
  import ManageStatis from './ManageStatis'
  import {getUserProfile} from "@/api/system/user";

  export default {
    data() {
      return {
        is_show: 0,
        user: {},
      }
    },
    created() {
      this.getUser();
    },
    components: {
      MerchantStatis,
      ManageStatis
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data;
          if (response.data.roles[0].roleKey === 'admin') {
            this.is_show = 2;
          } else {
            this.is_show = 1;
          }
        });
      },
    }
  }
</script>

