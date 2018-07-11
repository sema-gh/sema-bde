<template>
  <el-card class="resource-list__item w-100 flex-fix mt1"
    v-loading="isBeingConsumed">

    <label class="mr-auto f6">
      {{ resource.name }}
    </label>

    <el-button
      size="mini"
      icon="el-icon-download"
      :type="isDirty ? 'primary' : 'info'"
      :plain="!isDirty"
      :disabled="isConsuming"
      @click="consume">
    </el-button>

  </el-card>
</template>

<script>
export default {

  name: 'ResourceListItem',

  props: {
    resource: {
      type: Object,
      required: true
    }
  },

  computed: {
    isConsuming () {
      return this.$store.getters.isConsuming
    },

    isBeingConsumed () {
      return this.resource.consume.status === 'pending'
    },

    isDirty () {
      return this.resource.hash !== this.resource.consume.hash
    }
  },

  methods: {
    async consume () {
      await this.$store.dispatch('consumeResource', this.resource)
    }
  }

}
</script>

<style lang="scss">
  .resource-list__item {
    box-shadow: none;

    .el-card__body {
      display: flex;
      align-items: center;
      padding: .5rem;
    }
  }
</style>
