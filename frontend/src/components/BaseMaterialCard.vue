<template>
  <v-card
    v-bind="$attrs"
    :title="title"
    :subtitle="subtitle"
    data-cy="card"
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

    <template
      v-if="$slots.append"
      #append
    >
      <slot name="append" />
    </template>

    <template
      v-if="$slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>

    <v-card-text>
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
