<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>HomeManager</v-toolbar-title>
      <v-spacer />
      <v-btn to="/">Dashboard</v-btn>
      <v-btn to="/about">About</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
