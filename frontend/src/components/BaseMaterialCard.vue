<template>
  <v-card
    v-bind="$attrs"
    :title="title"
    :subtitle="subtitle"
  >
    <template
      v-if="$slots.title"
      #title
    >
      <slot name="title" />
    </template>
    <template
      v-if="$slots.subtitle"
      #subtitle
    >
      <slot name="subtitle" />
    </template>

    <v-card-text class="pb-0">
      <slot name="default" />
    </v-card-text>

    <template
      v-if="$slots.actions"
      #actions
    >
      <slot name="actions" />
    </template>
  </v-card>
</template>

<script>
export default {
  name: "BaseMaterialCard",
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
  },
}
</script>
